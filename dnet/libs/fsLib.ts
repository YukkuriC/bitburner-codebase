// special lib for persistent data IO
export const STORE_TARGET = 'darkweb'

const mapProbe = globalThis.mapProbe ?? {}
const mapPassword = globalThis.mapPassword ?? {}

export function getProbes(ns: NS, host: string) {
    const raw = mapProbe[host]
    if (typeof raw !== 'string') return []
    return raw.split('\n').filter((x) => x.trim())
}
export function getPassword(ns: NS, host: string) {
    const raw = mapPassword[host]
    if (typeof raw !== 'string') return null
    return raw
}
export function setProbes(ns: NS, host: string, probes: string[]) {
    mapProbe[host] = probes.join('\n')
}
export function setPassword(ns: NS, host: string, pw: string) {
    mapPassword[host] = pw
}

globalThis.mapProbe = mapProbe
globalThis.mapPassword = mapPassword
