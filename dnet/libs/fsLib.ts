// special lib for persistent data IO

const mapProbe = globalThis.mapProbe ?? {}
const mapPassword = globalThis.mapPassword ?? {}
const mapLocks = globalThis.mapLocks ?? {}

// single-thread lock
export function lock(host: string, steal = false) {
    if (mapLocks[host] && !steal) return false
    mapLocks[host] = true
    return true
}
export function unlock(host: string, steal = false) {
    mapLocks[host] = false
}

// data
export function getProbes(host: string) {
    const raw = mapProbe[host]
    if (typeof raw !== 'string') return []
    return raw.split('\n').filter((x) => x.trim())
}
export function getPassword(host: string) {
    const raw = mapPassword[host]
    if (typeof raw !== 'string') return null
    return raw
}
export function setProbes(host: string, probes: string[]) {
    mapProbe[host] = probes.join('\n')
}
export function setPassword(host: string, pw: string) {
    mapPassword[host] = pw
}

globalThis.mapProbe = mapProbe
globalThis.mapPassword = mapPassword
globalThis.mapLocks = mapLocks
