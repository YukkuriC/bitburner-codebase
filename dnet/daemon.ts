// periodically auto-hack & spread scripts to neighbors

import * as fs from './libs/fsLib'
import { call, callWait } from './libs/callLib'

export async function main(ns: NS) {
    const { dnet } = ns
    const host = ns.getHostname()
    while (1) {
        const probes = (await ns.dnet.probe()).filter((x) => {
            if (x === 'darkweb' || x === host) return false
            return ns.dnet.isDarknetServer(x)
        })
        fs.setProbes(ns, host, probes)
        for (const sub of probes) {
            if (ns.scriptRunning(ns.getScriptName(), sub)) continue
            await callWait(ns, 'hack', host, [sub])
            const pw = fs.getPassword(ns, sub)
            if (typeof pw !== 'string') continue
            await dnet.connectToSession(sub, pw)
            await callWait(ns, 'copier', host, [sub, pw])
            await callWait(ns, 'postHack', sub)
        }

        await dnet.nextMutation()
    }
}
