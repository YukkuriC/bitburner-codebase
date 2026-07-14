// lib for hacking nodes
import { getCracker } from '../crackers/crackers'

export async function hack(ns: NS, host: string) {
    ns.dnet.freezeServer
    const details = await ns.dnet.getServerDetails(host)
    if (details.depth < 0) return

    const cracker = getCracker(details.modelId)
    if (!cracker) {
        ns.tprint(`ERROR: unsupported model: ${details.modelId}\nHost: ${ns.getServer(host).hostname}`)
        // ns.tprint(JSON.stringify(details, undefined, 2))
        return
    }

    const pw = await cracker(ns, host, details)
    if (typeof pw === 'string') {
        ns.tprint(`CRACKED: ${host} (${details.modelId}) = ${pw}`)
    } else {
        ns.tprint(`ERRORED: ${host} (${details.modelId}) = ${pw}`)
        return pw
    }
    return pw
}
