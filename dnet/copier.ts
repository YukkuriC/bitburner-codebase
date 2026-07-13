// copy all dnet scripts to dest

export function copyAllScripts(ns: NS, dest: string, verbose = false) {
    for (const script of ns.ls(undefined, 'dnet/')) {
        const success = ns.scp(script, dest, 'home')
        if (verbose) ns.tprint(`Copied ${script} to ${dest}, success=${success}`)
    }
}

export async function main(ns: NS) {
    const dest = String(ns.args[0] ?? 'darkweb')
    const pw = ns.args[1]
    if (typeof pw === 'string') await ns.dnet.connectToSession(dest, pw)
    copyAllScripts(ns, dest)
}
