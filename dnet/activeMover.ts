// make hacked server more likely to move

import { reconnectUntilReached } from './libs/authLib'
import { call } from './libs/callLib'

export async function main(ns: NS) {
    const dest = String(ns.args[0] ?? 'darkweb')
    const pw = ns.args[1]
    if (typeof pw === 'string') await reconnectUntilReached(ns, dest, pw)
    ns.dnet.induceServerMigration(dest)
}
