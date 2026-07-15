// prepare server to run after acquired session

import { authArgs } from './libs/authLib'
import { call } from './libs/callLib'

export async function main(ns: NS) {
    const [dest, pw] = await authArgs(ns)
    while (1) {
        const details = ns.dnet.getServerDetails(dest)
        if (details.blockedRam <= 0) break
        await ns.dnet.memoryReallocation(dest)
    }
    call(ns, 'daemon', dest)
}
