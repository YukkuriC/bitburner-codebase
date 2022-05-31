import { props } from '/meta/META'

export async function main(ns) {
	const player = props.player
	player.loseMoney = player.gainMoney
	props.terminal.print('MONEY HACKED!')
}