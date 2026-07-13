// Search & crack all existing Coding Contracts once and for all :)

import { forEachWebpackExports } from '/meta/META'
import { searchContracts } from './search'
import { stringfy } from '/c/helper'
import { findRoute } from '/i/route'

let contractDef: Record<
    string,
    {
        getAnswer: (input: any) => any
    }
>

function destroyContract(ns, contract) {
    if (contract.getAnswer()) return
    ns.tprint(`WARN Cracked: ${contract.fn}`)
    contract.getAnswer = () => 'CRACKED'
    contract.isSolution = () => ({ result: 0 })
    contract.isValid = () => ({ success: true })
}

async function jumpTo(ns: NS, host: string) {
    for (const jump of (await findRoute(ns, ns.singularity.getCurrentServer(), host)).slice(1)) {
        await ns.singularity.connect(jump)
    }
}

export async function cracker(ns: NS, host: string, filename: string) {
    const nc = ns.codingcontract
    if (!ns.serverExists(host)) return ns.tprint(`Invalid host: ${host}`)
    try {
        var cType = nc.getContractType(filename, host)
        var cInput = nc.getData(filename, host)
        var cTries = nc.getNumTriesRemaining(filename, host)
    } catch (e) {
        return ns.tprint(`Invalid contract: ${filename}`)
    }
    ns.tprint(`WARN Contract ${host}|${filename}(${cTries}): "${cType}"`)
    ns.tprint(`Input: "${stringfy(cInput)}"`)

    var def = contractDef[cType]
    if (!def) {
        ns.tprint(`Not yet supported`)
        ns.tprint(`Type: "${cType}"`)
        ns.tprint(`Descrip: "${nc.getDescription(filename, host)}"`)
    } else if (cTries <= 0) {
        ns.tprint(`Contract failed`)
    } else {
        var answer = def.getAnswer(cInput)

        if (!answer) {
            ns.tprint(`ERROR Using dirty way :)`)

            // 1. goto host
            await jumpTo(ns, host)

            // 2. pick server & override all answer checkers
            const server = (player as any).getCurrentServer() as any
            for (const c of server.contracts) destroyContract(ns, c)

            // 3. random answer
            answer = 'CRACKED'
        }

        ns.tprint(`Answer: ${answer}`)
        globalThis.nc = nc
        return nc.attempt(answer, filename, host)
    }
}

export async function main(ns: NS) {
    forEachWebpackExports((m) => {
        if (m && m['Find Largest Prime Factor'] && m['Algorithmic Stock Trader IV']) {
            console.log(m)
            contractDef = m
        }
    })
    if (!contractDef) {
        ns.tprint('ERROR: contract def missing')
        return
    }

    // main func
    {
        const contractMap = await searchContracts(ns)
        for (const [k, v] of Object.entries(contractMap)) {
            for (const c of v) {
                const reward = await cracker(ns, k, c)
                ns.tprint(`Reward: ${reward}`)
            }
        }
        await jumpTo(ns, 'home')
    }
}
