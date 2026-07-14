import { terminal, forEachWebpackExports } from './META'

const helpers = {
    ensureDarknet() {
        if (!globalThis.DarknetModel) {
            forEachWebpackExports((obj) => {
                if (obj.Network && obj.serverState) {
                    globalThis.DarknetModel = obj
                }
            })
        }
    },
    getDarknetServerState: (host) => {
        helpers.ensureDarknet()
        return globalThis.DarknetModel.serverState.get(host)
    },
}

export const SuperTerminal = {
    connect(host) {
        terminal.connectToServer(host, true)
    },
    getServer(host) {
        const old = player.currentServer
        player.currentServer = host
        let ret
        try {
            ret = player.getCurrentServer()
        } catch {}
        player.currentServer = old
        if (!ret) throw 'not a server: ' + host
        return ret
    },
    heartbleed(host) {
        const states = helpers.getDarknetServerState(host)
        if (!states) return
        return states.serverLogs.find((l) => {
            if (typeof l.message !== 'object') return false
            return true
        })?.message
    },
}

terminal.meta = SuperTerminal

export async function main() {
    ns.ramOverride(1.6)
}
