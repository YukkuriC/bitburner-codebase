// cause an instant crash in terminal,
// can be used for resetting

import { sleep, waitUntil } from 'BASE'
import { player, terminal } from '/meta/META'

export async function main(ns) {
	terminal.print(ns)
}