// boost current server RAM to run any scripts

import { player } from './META'

export async function main() {
    const server = player.getCurrentServer()
    server.setMaxRam(Infinity)
}
