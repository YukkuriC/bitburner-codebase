// entry deploying daemons starting from darkweb
// called on home server
import { getPassword, getProbes } from './libs/fsLib'
import { dfsCall } from '../BASE'

export async function main(ns: NS) {
    const { singularity, dnet } = ns
    ns.tprint('backdoor start')
    await dfsCall(
        (s) => getProbes(s),
        async (host, root) => {
            singularity.connect(root)
            singularity.connect(host)
            await singularity.installBackdoor()
            ns.tprint(`${host}: backdoor installed`)
        },
        async (s) => {
            if (!dnet.isDarknetServer(s)) return false
            const details = dnet.getServerDetails(s)
            if (details.hasSession) return true

            const pw = getPassword(s)
            if (typeof pw !== 'string') return false
            const ret = await ns.dnet.connectToSession(s, pw)
            return ret.success
        },
        'darkweb',
    )
}
