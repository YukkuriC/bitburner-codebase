// keeps resending to counter backdoored network loss
export async function resendUntilReached(ns: NS, host: string, pw: string) {
    while (1) {
        const res = await ns.dnet.authenticate(host, pw)
        if (res.code != 408) return res
    }
}
export async function reconnectUntilReached(ns: NS, host: string, pw: string) {
    while (1) {
        const res = await ns.dnet.connectToSession(host, pw)
        if (res.code != 408) return res
    }
}
export async function authArgs(ns: NS) {
    const dest = String(ns.args[0] ?? 'darkweb')
    const pw = ns.args[1]
    if (typeof pw === 'string') await reconnectUntilReached(ns, dest, pw)
    return [dest, pw] as const
}
