// source hack
export const doc = eval('document')
export const global = eval('window')
export const getHandler = obj => Object.entries(obj).
	find(entry => entry[0].startsWith('__reactProps'))?.[1]
const getProps = obj => getHandler(obj).children.props
let boxes = Array.from(doc.querySelectorAll("[class*=MuiBox-root]"))
export const props = boxes.map(box => getProps(box)).find(x => x?.player)
export const player = global.player = props.player
export const terminal = global.terminal = props.terminal
export const router = global.router = props.router

export async function main(ns) {
	console.log(props)
}