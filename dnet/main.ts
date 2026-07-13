import { call, callWait } from './libs/callLib'

export async function main(ns: NS) {
    const host = ns.getHostname()
    ns.tprint('run on: ' + host)
    await callWait(ns, 'copier', host, ['darkweb'])
    call(ns, 'daemon', 'darkweb')
}
