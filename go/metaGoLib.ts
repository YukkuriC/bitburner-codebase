import { forEachWebpackExports } from '/meta/META'

export let Go = globalThis.Go

if (!Go) {
    forEachWebpackExports((m) => {
        if (m.currentGame && m.moveOrCheatViaApi) Go = m
    })
    globalThis.Go = Go
}
