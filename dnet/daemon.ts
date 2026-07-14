// periodically auto-hack & spread scripts to neighbors

import * as fs from './libs/fsLib'
import { call, callWait } from './libs/callLib'

export async function main(ns: NS) {
    const { dnet } = ns
    const host = ns.getHostname()
    let first = true
    while (1) {
        const probes = (await ns.dnet.probe()).filter((x) => {
            if (x === host) return false
            return ns.dnet.isDarknetServer(x)
        })
        fs.setProbes(host, probes)
        for (const sub of probes) {
            if (sub === 'darkweb') continue
            if (ns.scriptRunning(ns.getScriptName(), sub)) continue
            if (fs.lock(host, first)) {
                await callWait(ns, 'hack', host, [sub])
                const pw = fs.getPassword(sub)
                if (typeof pw !== 'string') continue
                await dnet.connectToSession(sub, pw)
                await callWait(ns, 'copier', host, [sub, pw])
                await callWait(ns, 'postHack', sub)
                fs.unlock(host)
            }
        }

        await dnet.nextMutation()
        first = false
    }
}
