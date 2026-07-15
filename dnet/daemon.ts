// periodically auto-hack & spread scripts to neighbors

import * as fs from './libs/fsLib'
import { call, callWait } from './libs/callLib'
import { reconnectUntilReached } from './libs/authLib'

export async function main(ns: NS) {
    const { dnet } = ns
    const host = ns.getHostname()
    let first = true
    let lockAllCount = 0
    while (1) {
        const probes = (await ns.dnet.probe()).filter((x) => {
            if (x === host) return false
            return ns.dnet.isDarknetServer(x)
        })
        fs.setProbes(host, probes)
        let reached = probes.length <= 0
        for (const sub of probes) {
            if (sub === 'darkweb') continue
            if (ns.scriptRunning(ns.getScriptName(), sub)) {
                const pw = fs.getPassword(sub)
                await callWait(ns, 'activeMover', host, [sub, pw])
                continue
            }
            if (fs.lock(host, first)) {
                lockAllCount = 0
                reached = true
                await callWait(ns, 'hack', host, [sub])
                const pw = fs.getPassword(sub)
                if (typeof pw !== 'string') continue
                await reconnectUntilReached(ns, sub, pw)
                await callWait(ns, 'copier', host, [sub, pw])
                await callWait(ns, 'postHack', sub)
                await callWait(ns, 'activeMover', host, [sub, pw])
                fs.unlock(host)
            }
        }

        await dnet.nextMutation()
        first = false
        if (!reached) lockAllCount++
        if (lockAllCount >= 5) first = true
    }
}
