// basic references for exploits, with helper functions

export let doc = eval('document')

// webpack exploit
// credits: discord server
function exposeRequire() {
    if (globalThis.webpackRequire) return
    globalThis.webpackChunkbitburner.push([[-1], {}, (webpackRequire) => (globalThis.webpackRequire = webpackRequire)])
}
export function forEachWebpackModule(mapFunc) {
    if (!globalThis.webpackChunkbitburner) {
        return
    }
    exposeRequire()
    const skippedModuleIds = new Set(Object.keys(webpackChunkbitburner[0][1]))
    for (const moduleId of Object.keys(globalThis.webpackRequire.m).filter((id) => !skippedModuleIds.has(id))) {
        const module = globalThis.webpackRequire(moduleId)
        if (!module) {
            continue
        }
        const exportedValues = Object.values(module)
        for (const obj of exportedValues) {
            if (obj) mapFunc(obj)
        }
    }
}

// expose core objects
if (!globalThis.props) {
    const props = {}
    forEachWebpackModule((obj) => {
        if (obj.outputHistory) {
            props.terminal = obj
        }
        if (obj.achievements && obj.exploits) {
            props.player = obj
        }
        if (obj.toPage) {
            props.router = obj
        }
    })
    globalThis.props = props
    Object.assign(globalThis, props)
}
export const props = globalThis.props
export let player = props.player
export let terminal = props.terminal
export let router = props.router

// clipboard functions
export async function copy(text) {
    await navigator.clipboard.writeText(text)
    if (text.length > 100) text = `${text.substring(0, 100)}...`
    return text
}
export async function paste() {
    const text = await navigator.clipboard.readText()
    return text
}

/** @param {NS} ns */
export async function main(ns) {
    ns.ramOverride(1.6)
}
