// make hacked server more likely to move

import { authArgs } from './libs/authLib'

export async function main(ns: NS) {
    const [dest, pw] = await authArgs(ns)
    while (1) {
        const details = ns.dnet.getServerDetails(dest)
        if (!details.isConnectedToCurrentServer) break
        await ns.dnet.induceServerMigration(dest)
    }
}
