// special lib for persistent data IO
export const STORE_TARGET = 'darkweb'

export function pathProbe(host: string) {
    return `/dnet_probes/${host}.txt`
}
export function pathPassword(host: string) {
    return `/dnet_password/${host}.txt`
}

function readFileFromStore(ns: NS, path: string) {
    const success = ns.scp(path, ns.getHostname(), STORE_TARGET)
    if (!success) return null
    return ns.read(path).trim()
}
function writeFileToStore(ns: NS, path: string, content: string) {
    ns.write(path, content, 'w')
    ns.scp(path, STORE_TARGET)
}

export function getProbes(ns: NS, host: string) {
    const raw = readFileFromStore(ns, pathProbe(host))
    if (typeof raw !== 'string') return []
    return raw.split('\n').filter((x) => x.trim())
}
export function getPassword(ns: NS, host: string) {
    const raw = readFileFromStore(ns, pathPassword(host))
    if (typeof raw !== 'string') return null
    return raw
}
export function setProbes(ns: NS, host: string, probes: string[]) {
    writeFileToStore(ns, pathProbe(host), probes.join('\n'))
}
export function setPassword(ns: NS, host: string, pw: string) {
    writeFileToStore(ns, pathPassword(host), pw)
}
