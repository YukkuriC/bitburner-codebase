interface WebpackRequire {
    (moduleId: string | number): any
    m: Record<string | number, Function>
}

interface WebpackChunk extends Array<any> {
    0: (string | number)[]
    1: Record<string | number, Function>
    2?: (webpackRequire: WebpackRequire) => void
}

declare const webpackChunkbitburner: WebpackChunk[]
declare var webpackRequire: WebpackRequire
declare var player: Player
declare var terminal: Terminal
declare var router: Router
declare var props: {
    player: Player
    terminal: Terminal
    router: Router
}

// TODO fetch real types from bitburner-src
interface SuperTerminal {
    connect(host: string): void
    getServer(host: string): any
    heartbleed(host: string): any
}

interface Terminal {
    print(message: string): void
    executeCommands(command: string): Promise<void>
    action: unknown
    meta: SuperTerminal
}

interface Router {
    // toDevMenu(): void
}
