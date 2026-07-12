// 生成于 GLM-5
const fs = require('fs')
const path = require('path')
const http = require('http')

// 检查依赖
let WebSocket = null
let chokidar = null

try {
    WebSocket = require('ws')
} catch (e) {
    console.error('[ERROR] Missing dependency: ws. Run: npm install ws')
    process.exit(1)
}

try {
    chokidar = require('chokidar')
} catch (e) {
    console.warn('[WARN] chokidar not found, file watching disabled. Run: npm install chokidar to enable.')
}

// 生成于 GLM-5
const baseDir = path.resolve(__dirname, '..')
const ignoredDirs = ['TOOLS', 'old', 'node_modules', '.git']

let idCounter = 0
const connections = new Set()
const pendingRequests = new Map() // id -> { resolve, reject, timeout }
const syncingFiles = new Set() // 正在同步的文件，避免循环

// 配置
const config = {
    host: process.env.BITBURNER_HOST || 'localhost',
    port: parseInt(process.env.BITBURNER_PORT) || 12525,
    watch: process.env.BITBURNER_WATCH !== 'false',
}

// JSON-RPC 消息构建器
function createRequest(method, params) {
    return JSON.stringify({ jsonrpc: '2.0', id: ++idCounter, method, params })
}

function successResponse(id, result) {
    return JSON.stringify({ jsonrpc: '2.0', id, result })
}

function errorResponse(id, error) {
    return JSON.stringify({ jsonrpc: '2.0', id, error })
}

// 检查是否是脚本文件
function isScript(filename) {
    if (filename.endsWith('.d.ts')) return false
    return filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.script') || filename.endsWith('.txt')
}

// 检查路径是否应该被忽略
function shouldIgnore(absPath) {
    const relPath = path.relative(baseDir, absPath)
    const parts = relPath.split(path.sep)
    return parts.some((part) => ignoredDirs.includes(part))
}

// 遍历文件（排除忽略目录）
function* walkFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            if (!ignoredDirs.includes(entry.name)) {
                yield* walkFiles(fullPath)
            }
        } else if (entry.isFile() && isScript(entry.name)) {
            yield fullPath
        }
    }
}

// 将本地路径转换为游戏内文件名（统一格式：带前导 /）
function localPathToGamePath(absPath) {
    const relPath = path.relative(baseDir, absPath).replace(/\\/g, '/')
    return '/' + relPath
}

// 统一文件名格式（确保带前导 /）
function normalizeFilename(filename) {
    if (!filename.startsWith('/')) return '/' + filename
    return filename
}

// 将游戏路径转换为本地路径
function gamePathToLocalPath(filename) {
    const normalized = normalizeFilename(filename)
    return path.join(baseDir, normalized.replace(/^\//, ''))
}

// 发送请求到 Bitburner 并等待响应
function sendRequestAndWait(ws, method, params, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const id = ++idCounter
        const msg = JSON.stringify({ jsonrpc: '2.0', id, method, params })

        const timer = setTimeout(() => {
            pendingRequests.delete(id)
            reject(new Error(`Request ${method} timed out`))
        }, timeoutMs)

        pendingRequests.set(id, { resolve, reject, timer })

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(msg)
        } else {
            clearTimeout(timer)
            pendingRequests.delete(id)
            reject(new Error('WebSocket not connected'))
        }
    })
}

// 处理来自 Bitburner 的响应
function handleResponse(msg) {
    const pending = pendingRequests.get(msg.id)
    if (!pending) return false

    pendingRequests.delete(msg.id)
    clearTimeout(pending.timer)

    if (msg.error) {
        pending.reject(new Error(msg.error))
    } else {
        pending.resolve(msg.result)
    }
    return true
}

// 处理来自 Bitburner 的请求（Bitburner 主动发送的）
function handleRequest(ws, msg) {
    const { id, method, params } = msg

    if (method === 'getFile') {
        const { filename, server = 'home' } = params
        const localPath = gamePathToLocalPath(filename)

        if (shouldIgnore(localPath)) {
            ws.send(errorResponse(id, 'File is in ignored directory'))
            return
        }

        try {
            const content = fs.readFileSync(localPath, 'utf-8')
            ws.send(successResponse(id, content))
        } catch (e) {
            ws.send(errorResponse(id, `Failed to read file: ${e.message}`))
        }
    } else if (method === 'getFileNames') {
        const files = []
        for (const filePath of walkFiles(baseDir)) {
            files.push(localPathToGamePath(filePath))
        }
        ws.send(successResponse(id, files))
    } else if (method === 'getAllFiles') {
        const files = []
        for (const filePath of walkFiles(baseDir)) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8')
                files.push({ filename: localPathToGamePath(filePath), content })
            } catch (e) {}
        }
        ws.send(successResponse(id, files))
    } else {
        ws.send(errorResponse(id, `Unknown method: ${method}`))
    }
}

// 处理 WebSocket 消息
function handleMessage(ws, data) {
    let msg
    try {
        msg = JSON.parse(data)
    } catch (e) {
        console.error('[ERROR] Invalid JSON:', data)
        return
    }

    // 响应还是请求？
    if (msg.result !== undefined || msg.error !== undefined) {
        handleResponse(msg)
    } else if (msg.method) {
        handleRequest(ws, msg)
    } else {
        console.error('[ERROR] Unknown message format:', msg)
    }
}

// 推送单个文件到 Bitburner（等待响应确认）
async function pushFileAndWait(ws, filename, content) {
    const normalizedFilename = normalizeFilename(filename)
    if (syncingFiles.has(normalizedFilename)) return // 避免循环
    syncingFiles.add(normalizedFilename)

    try {
        await sendRequestAndWait(ws, 'pushFile', { filename, content, server: 'home' })
        console.log(`[PUSH] ${normalizedFilename} OK`)
    } catch (e) {
        console.error(`[PUSH] ${normalizedFilename} FAILED: ${e.message}`)
    } finally {
        syncingFiles.delete(normalizedFilename)
    }
}

// 推送文件到所有 Bitburner 客户端（广播，不等待）
function pushFileToClients(filename, content) {
    const normalizedFilename = normalizeFilename(filename)
    if (syncingFiles.has(normalizedFilename)) return
    syncingFiles.add(normalizedFilename)

    const msg = createRequest('pushFile', { filename, content, server: 'home' })

    for (const ws of connections) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(msg)
        }
    }

    console.log(`[PUSH] ${normalizedFilename} (${connections.size} client(s))`)
    
    // 短暂标记，防止立即被 watcher 触发的拉取覆盖
    setTimeout(() => syncingFiles.delete(normalizedFilename), 1000)
}

// 删除文件通知所有客户端
function deleteFileFromClients(filename) {
    const normalizedFilename = normalizeFilename(filename)
    const msg = createRequest('deleteFile', { filename, server: 'home' })

    for (const ws of connections) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(msg)
        }
    }

    console.log(`[DELETE] ${normalizedFilename} (${connections.size} client(s))`)
}

// 从 Bitburner 拉取单个文件（仅当本地不存在或内容不同时写入）
async function pullFileFromBitburner(ws, filename) {
    const normalizedFilename = normalizeFilename(filename)
    if (syncingFiles.has(normalizedFilename)) return

    syncingFiles.add(normalizedFilename)

    try {
        const remoteContent = await sendRequestAndWait(ws, 'getFile', { filename, server: 'home' })
        const localPath = gamePathToLocalPath(filename)

        if (shouldIgnore(localPath)) return

        // 检查本地文件是否存在及内容
        let localContent = null
        let localExists = false
        try {
            localContent = fs.readFileSync(localPath, 'utf-8')
            localExists = true
        } catch (e) {
            // 本地文件不存在
        }

        if (!localExists) {
            // 本地不存在，写入新文件
            const dir = path.dirname(localPath)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }
            fs.writeFileSync(localPath, remoteContent, 'utf-8')
            console.log(`[PULL] ${normalizedFilename} (new)`)
        } else if (localContent !== remoteContent) {
            // 内容不同，更新本地
            fs.writeFileSync(localPath, remoteContent, 'utf-8')
            console.log(`[PULL] ${normalizedFilename} (updated)`)
        } else {
            // 内容相同，跳过
            console.log(`[PULL] ${normalizedFilename} (same, skip)`)
        }
    } catch (e) {
        console.error(`[ERROR] Failed to pull ${filename}: ${e.message}`)
    } finally {
        // 延长标记时间，防止 watcher 触发
        setTimeout(() => syncingFiles.delete(normalizedFilename), 2000)
    }
}

// 同步策略：先推送本地所有文件，再从 Bitburner 拉取本地不存在的文件
async function fullSync(ws) {
    console.log('[SYNC] Starting full sync...')

    // 1. 推送本地所有文件到 Bitburner（等待每个推送完成）
    const localFiles = []
    for (const filePath of walkFiles(baseDir)) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8')
            const gamePath = localPathToGamePath(filePath)
            localFiles.push({ filename: gamePath, content })
            await pushFileAndWait(ws, gamePath, content)
        } catch (e) {
            console.error(`[ERROR] Failed to push ${filePath}: ${e.message}`)
        }
    }
    console.log(`[SYNC] Pushed ${localFiles.length} local files`)

    // 2. 获取 Bitburner 的文件列表
    try {
        const remoteFiles = await sendRequestAndWait(ws, 'getAllFiles', { server: 'home' })

        // 3. 找出 Bitburner 有但本地没有的文件，拉取
        const localFileSet = new Set(localFiles.map(f => normalizeFilename(f.filename)))
        for (const remoteFile of remoteFiles) {
            const normalizedRemote = normalizeFilename(remoteFile.filename)
            if (!localFileSet.has(normalizedRemote)) {
                await pullFileFromBitburner(ws, remoteFile.filename)
            }
        }
        console.log('[SYNC] Pull complete')
    } catch (e) {
        console.error(`[ERROR] Failed to get remote files: ${e.message}`)
    }
}

// 启动文件监听器
function startWatcher() {
    if (!chokidar || !config.watch) {
        console.log('[INFO] File watching is disabled')
        return null
    }

    // Windows 上使用正确的 glob 模式
    const watcher = chokidar.watch(baseDir, {
        ignored: (filePath) => {
            // 忽略隐藏文件
            if (/(^|[\/\\])\../.test(filePath)) return true
            // 忽略特定目录
            const relPath = path.relative(baseDir, filePath)
            const parts = relPath.split(path.sep)
            if (parts.some(part => ignoredDirs.includes(part))) return true
            // 忽略非脚本文件
            const basename = path.basename(filePath)
            if (filePath !== baseDir && !isScript(basename) && !fs.statSync(filePath).isDirectory()) return true
            return false
        },
        ignoreInitial: true,
        persistent: true,
        awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 },
    })
    
    console.log(`[INFO] Watching directory: ${baseDir}`)

    watcher
        .on('add', (filePath) => {
            console.log(`[WATCH] add: ${filePath}`)
            if (shouldIgnore(filePath) || !isScript(path.basename(filePath))) return
            if (connections.size === 0) {
                console.log('[WATCH] No clients connected, skip push')
                return
            }
            try {
                const content = fs.readFileSync(filePath, 'utf-8')
                const gamePath = localPathToGamePath(filePath)
                pushFileToClients(gamePath, content)
            } catch (e) {
                console.error(`[ERROR] Failed to read ${filePath}: ${e.message}`)
            }
        })
        .on('change', (filePath) => {
            console.log(`[WATCH] change: ${filePath}`)
            if (shouldIgnore(filePath) || !isScript(path.basename(filePath))) return
            if (connections.size === 0) {
                console.log('[WATCH] No clients connected, skip push')
                return
            }
            try {
                const content = fs.readFileSync(filePath, 'utf-8')
                const gamePath = localPathToGamePath(filePath)
                pushFileToClients(gamePath, content)
            } catch (e) {
                console.error(`[ERROR] Failed to read ${filePath}: ${e.message}`)
            }
        })
        .on('unlink', (filePath) => {
            console.log(`[WATCH] unlink: ${filePath}`)
            if (shouldIgnore(filePath) || !isScript(path.basename(filePath))) return
            if (connections.size === 0) {
                console.log('[WATCH] No clients connected, skip delete')
                return
            }
            const gamePath = localPathToGamePath(filePath)
            deleteFileFromClients(gamePath)
        })
        .on('error', (error) => {
            console.error(`[ERROR] Watcher error: ${error.message}`)
        })
        .on('ready', () => {
            console.log('[INFO] File watcher ready')
        })

    console.log('[INFO] File watcher started')
    return watcher
}

// 创建 WebSocket 服务器
function createServer() {
    const server = http.createServer()
    const wss = new WebSocket.Server({ server })

    wss.on('connection', (ws, req) => {
        const clientAddr = req.socket.remoteAddress
        console.log(`[CONNECT] Client connected from ${clientAddr}`)
        connections.add(ws)

        ws.on('message', (data) => handleMessage(ws, data))
        ws.on('close', () => {
            console.log(`[DISCONNECT] Client disconnected from ${clientAddr}`)
            connections.delete(ws)
            // 清理未完成的请求
            for (const [id, pending] of pendingRequests) {
                pending.reject(new Error('Connection closed'))
                pendingRequests.delete(id)
                clearTimeout(pending.timer)
            }
        })
        ws.on('error', (error) => {
            console.error(`[ERROR] WebSocket error: ${error.message}`)
            connections.delete(ws)
        })

        // 连接后延迟执行完整同步
        setTimeout(() => {
            fullSync(ws).catch((e) => console.error('[ERROR] Full sync failed:', e.message))
        }, 500)
    })

    return { server, wss }
}

// 主函数
function main() {
    console.log('='.repeat(50))
    console.log('Bitburner Remote API Server')
    console.log('='.repeat(50))
    console.log(`[CONFIG] Host: ${config.host}`)
    console.log(`[CONFIG] Port: ${config.port}`)
    console.log(`[CONFIG] Watch: ${config.watch}`)
    console.log(`[CONFIG] Base directory: ${baseDir}`)
    console.log(`[CONFIG] Ignored directories: ${ignoredDirs.join(', ')}`)
    console.log('='.repeat(50))

    const { server, wss } = createServer()
    const watcher = startWatcher()

    server.listen(config.port, config.host, () => {
        console.log(`[READY] Server listening on ws://${config.host}:${config.port}`)
        console.log('')
        console.log('[INFO] Connect from Bitburner:')
        console.log('       Options -> Remote API -> Hostname: ' + config.host)
        console.log('       Options -> Remote API -> Port: ' + config.port)
        console.log('       Then click "Connect"')
        console.log('')
    })

    // 优雅关闭
    process.on('SIGINT', () => {
        console.log('\n[INFO] Shutting down...')
        if (watcher) watcher.close()
        wss.close()
        server.close()
        process.exit(0)
    })

    // 命令行交互
    const readline = require('readline')
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    rl.on('line', (input) => {
        const cmd = input.trim().toLowerCase()
        switch (cmd) {
            case 'sync':
                if (connections.size > 0) {
                    for (const ws of connections) {
                        fullSync(ws).catch((e) => console.error('[ERROR] Sync failed:', e.message))
                    }
                } else {
                    console.log('[WARN] No clients connected')
                }
                break
            case 'status':
                console.log(`[STATUS] ${connections.size} client(s) connected`)
                break
            case 'help':
                console.log('Commands: sync, status, help, exit')
                break
            case 'exit':
            case 'quit':
                console.log('[INFO] Shutting down...')
                if (watcher) watcher.close()
                wss.close()
                server.close()
                process.exit(0)
                break
            default:
                if (cmd) console.log(`[WARN] Unknown command: ${cmd}. Type 'help' for commands.`)
        }
    })
}

main()