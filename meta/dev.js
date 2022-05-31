import { props } from 'BASE.js'

export async function main(ns) {
	console.log(props)
	props.router.toDevMenu()
}