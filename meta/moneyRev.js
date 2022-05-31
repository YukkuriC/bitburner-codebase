// reverse player's spending-money action,
// now it adds same amount of money.
// can't be reverted until quitting game

import { props } from '/meta/META'

export async function main(ns) {
	const player = props.player
	player.loseMoney = player.gainMoney
	props.terminal.print('MONEY HACKED!')
}