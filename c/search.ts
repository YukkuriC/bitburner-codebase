// search and display all coding contracts among servers

import { bfsBind } from 'BASE.js'

export async function searchContracts(ns: NS) {
    const ret = {} as Record<string, string[]>
    await bfsBind(ns)(
        (h) => {
            // ls
            var contracts = ns.ls(h, '.cct')
            if (contracts.length == 0) return
            ret[h] = contracts
        },
        null,
        'home',
    )
    return ret
}

export async function main(ns) {
    const contracts = await searchContracts(ns)
    for (const [k, v] of Object.entries(contracts)) {
        ns.tprint(k + ':')
        for (const c of v) {
            ns.tprint('- ' + c)
        }
    }
}
