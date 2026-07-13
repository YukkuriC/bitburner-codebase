// prepare server to run after acquired session

import { call } from './libs/callLib'

export async function main(ns: NS) {
    const host = ns.getHostname()
    await ns.dnet.memoryReallocation(host)
    // await ns.dnet.setStasisLink(true)
    call(ns, 'daemon', host)
}
