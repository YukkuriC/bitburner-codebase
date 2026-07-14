// keeps resending to counter backdoored network loss
export async function resendUntilReached(ns: NS, host: string, pw: string) {
    while (1) {
        const res = await ns.dnet.authenticate(host, pw)
        if (res.code != 408) return res
    }
}
