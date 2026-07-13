// basic references for exploits, with helper functions

export let doc = eval('document')
export const global = eval('globalThis')

// webpack exploit
// credits: discord server
function exposeRequire() {
    if (global.webpackRequire) return
    global.webpackChunkbitburner.push([[-1], {}, (webpackRequire) => (global.webpackRequire = webpackRequire)])
}
export function forEachWebpackExports(mapFunc) {
    if (!global.webpackChunkbitburner) {
        return
    }
    exposeRequire()
    const skippedModuleIds = new Set(Object.keys(webpackChunkbitburner[0][1]))
    for (const moduleId of Object.keys(global.webpackRequire.m).filter((id) => !skippedModuleIds.has(id))) {
        const module = global.webpackRequire(moduleId)
        if (!module) {
            continue
        }
        const exportedValues = Object.values(module)
        for (const obj of exportedValues) {
            if (obj) mapFunc(obj)
        }
    }
}
global.forEachWebpackModule = forEachWebpackExports

// expose core objects
if (!global.props) {
    const props = {}
    forEachWebpackExports((obj) => {
        if (obj.outputHistory) {
            props.terminal = obj
        }
        if (obj.achievements && obj.exploits) {
            props.player = obj
        }
        if (obj.toPage) {
            props.router = obj
        }
    })
    global.props = props
    Object.assign(global, props)
}
export const props = global.props
export let player = props.player
export let terminal = props.terminal
export let router = props.router

// clipboard functions
export async function copy(text) {
    await navigator.clipboard.writeText(text)
    if (text.length > 100) text = `${text.substring(0, 100)}...`
    return text
}
export async function paste() {
    const text = await navigator.clipboard.readText()
    return text
}

/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6)
}
