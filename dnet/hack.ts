// hack input dnet node
import { hack } from './libs/hackLib'
import { reconnectUntilReached } from './libs/authLib'
import * as fs from './libs/fsLib'

export async function main(ns: NS) {
    const target = String(ns.args[0])
    const details = await ns.dnet.getServerDetails(target)
    const existPw = fs.getPassword(target)
    if (typeof existPw === 'string') {
        if (!details.hasSession) {
            const res = await reconnectUntilReached(ns, target, existPw)
            if (res.success) return
        }
    }
    const pw = await hack(ns, target)
    if (typeof pw === 'string') {
        fs.setPassword(target, pw)
    }
}
