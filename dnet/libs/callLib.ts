// lib to remote call & wait dnet scripts
export function call(ns: NS, script: string, host: string, args: string[] = []) {
    const scriptName = `/dnet/${script}.ts`
    if (ns.scriptRunning(scriptName, host)) return -1
    return ns.exec(scriptName, host, 1, ...args)
}
export async function callWait(ns: NS, script: string, host: string, args: string[] = []) {
    const pid = call(ns, script, host, args)
    while (ns.isRunning(pid)) {
        await ns.sleep(500)
    }
}
