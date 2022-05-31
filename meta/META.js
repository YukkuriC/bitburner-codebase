// basic references for exploits, with helper functions

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

// clipboard functions
export async function copy(text) {
	await navigator.clipboard.writeText(text)
	if (text.length > 100)
		text = `${text.substring(0, 100)}...`
	return text
}
export async function paste() {
	const text = await navigator.clipboard.readText()
	return text
}
