// entry deploying daemons starting from darkweb
// called on home server
import { getProbes } from './libs/fsLib'
import { dfsCall } from '../BASE'

export async function main(ns: NS) {
    const { singularity, dnet } = ns
    ns.tprint('backdoor start')
    await dfsCall(
        (s) => getProbes(ns, s),
        async (host, root) => {
            singularity.connect(root)
            singularity.connect(host)
            await singularity.installBackdoor()
            ns.tprint(`${host}: backdoor installed`)
        },
        (s) => dnet.isDarknetServer(s),
        'darkweb',
    )
}
