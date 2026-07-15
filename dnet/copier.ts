// copy all dnet scripts to dest

import { authArgs } from './libs/authLib'

export function copyAllScripts(ns: NS, dest: string, verbose = false) {
    for (const script of ns.ls(undefined, 'dnet/')) {
        const success = ns.scp(script, dest, 'home')
        if (verbose) ns.tprint(`Copied ${script} to ${dest}, success=${success}`)
    }
}

export async function main(ns: NS) {
    const [dest, pw] = await authArgs(ns)
    copyAllScripts(ns, dest)
}
