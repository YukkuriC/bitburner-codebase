import { Go } from './metaGoLib'

export async function main(ns: NS) {
    const {
        currentGame,
        currentGame: { board },
    } = Go
    if (currentGame.previousPlayer === null) return
    let n = board.length
    for (let i = 0; i < n; i += 2) {
        for (let j = 0; j < n; j += 2) {
            const cell = board[i][j]
            if (!cell) continue
            cell.color = 'Black'
        }
    }
    for (let i = 0; i < n; i += 2) {
        for (let j = 0; j < n; j += 2) {
            const cell = board[i][j]
            if (cell?.color === 'Black') {
                cell.color = 'Empty'
                return await ns.go.makeMove(i, j)
            }
        }
    }
}
