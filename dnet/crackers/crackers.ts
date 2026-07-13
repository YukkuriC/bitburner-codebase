// including all supported crackers for all types of dnet servers
// used by hackLib
import * as R from './rainbowSheet'

// ========== helpers ==========
function filterPwList(pwList: string[], details: DarknetServerDetails) {
    return pwList.filter((p) => {
        if (p.length !== details.passwordLength) return false
        switch (details.passwordFormat) {
            case 'numeric':
                return p.match(/^\d+$/)
            case 'alphabetic':
                return p.match(/^[a-zA-Z]+$/)
            case 'alphanumeric':
                return p.match(/^[a-zA-Z0-9]+$/)
            // TODO mooore
        }
        return true
    })
}
function error(ns, msg: string, details?: DarknetServerDetails) {
    throw `${msg}\nDetails:${JSON.stringify(details ?? {}, undefined, 2)}`
}
function* shuffleStr(str: string) {
    if (str.length <= 1) {
        yield str
        return
    }
    for (let i = 0; i < str.length; i++) {
        const char = str[i]
        const rest = str.slice(0, i) + str.slice(i + 1)
        for (const shuffled of shuffleStr(rest)) {
            yield char + shuffled
        }
    }
}
async function resendUntilReached(ns: NS, host: string, pw: string) {
    while (1) {
        const res = await ns.dnet.authenticate(host, pw)
        if (res.code != 408) return res
    }
}

// ========== factory ==========
function DictAttack(src: string[]) {
    return async (ns: NS, host: string, details: DarknetServerDetails) => {
        for (const m of filterPwList(src, details)) {
            const res = await resendUntilReached(ns, host, m)
            if (res.success) return m
        }
        error(ns, 'UPDATE YOUR RAINBOW SHEET', details)
    }
}
function RegexMatch(re: RegExp, key: keyof DarknetServerDetails, onMatch: (m: RegExpMatchArray, details: DarknetServerDetails) => string) {
    return async (ns: NS, host: string, details: DarknetServerDetails) => {
        const nums = String(details[key]).match(re)
        if (!nums) error(ns, 'UPDATE YOUR REGEXP', details)
        const pw = onMatch(nums, details)
        const res = await resendUntilReached(ns, host, pw)
        if (!res.success) error(ns, 'regex matched but failed\dMsg:' + JSON.stringify(res), details)
        return pw
    }
}
function SearchRange(details: DarknetServerDetails) {
    let min = 0,
        max = Number('9'.repeat(details.passwordLength))
    return [min, max]
}

export const ModelCrackers = {
    // calculated
    ZeroLogon: async (ns: NS, host: string) => {
        await await resendUntilReached(ns, host, '')
        return ''
    },
    'DeskMemo_3.1': RegexMatch(/\d+/g, 'passwordHint', (m) => m[0]),
    'CloudBlare(tm)': RegexMatch(/\d+/g, 'data', (m) => m.join('')),
    'FreshInstall_1.0': DictAttack(R.pwDefault),
    Laika4: DictAttack(R.pwDog),
    Pr0verFl0: RegexMatch(/\d+/g, 'passwordHint', (m, d) => '0'.repeat(d.passwordLength + Number(m.join('')))),
    // the password is the base 13 number 129 in base 10
    OctantVoxel: async (ns: NS, host: string, details: DarknetServerDetails) => {
        const [mulRaw, numRaw] = details.data.split(',')
        const mul = Number(mulRaw)
        let ret = 0
        for (const char of Array.from(numRaw)) {
            ret *= mul
            if (char >= '0' && char <= '9') {
                ret += Number(char)
            } else if (char >= 'a' && char <= 'z') {
                ret += char.charCodeAt(0) - 97 + 10
            } else if (char >= 'A' && char <= 'Z') {
                ret += char.charCodeAt(0) - 65 + 10
            }
        }
        const pw = String(ret)
        await resendUntilReached(ns, host, pw)
        return pw
    },

    // interactive
    'PHP 5.4': async (ns: NS, host: string, details: DarknetServerDetails) => {
        for (const shuffled of shuffleStr(details.data)) {
            const auth = await resendUntilReached(ns, host, shuffled)
            if (auth.success) return shuffled
        }
        error(ns, 'shuffle search failed, why?', details)
    },
    // no, we need heartbleed here, damn
    /*
    'AccountsManager_4.2': async (ns: NS, host: string, details: DarknetServerDetails) => {
        let [min, max] = SearchRange(details)
        // bsearch
        while (min <= max) {
            let mid = Math.floor((min + max) / 2)
            let pw = mid.toString()
            if (pw.length < details.passwordLength) pw = '0'.repeat(details.passwordLength - pw.length) + pw
            const auth = await resendUntilReached(ns, host, pw)
            if (auth.success) return pw
            if (auth.message === 'Higher') min = mid + 1
            else max = mid - 1
        }
        error(ns, 'binary search failed, why?', details)
    },
    'Factori-Os': async (ns: NS, host: string, details: DarknetServerDetails) => {
        let candidates = Array(SearchRange(details)[1])
            .fill(0)
            .map((_, i) => i + 1)
        // bsearch
        while (candidates.length > 0) {
            let test = candidates.shift()
            let pw = String(test)
            const auth = await resendUntilReached(ns, host, pw)
            if (auth.success) return pw
            const notDivisible = auth.data == false
            candidates = candidates.filter((c) => !(c % test > 0) === notDivisible)
            // no, we need heartbleed here, damn
            ns.tprint(`test ${test} ${notDivisible} ${JSON.stringify(auth)} ${candidates.join(',')}`)
        }
        error(ns, 'factor search failed, why?', details)
    },
    NIL: async (ns: NS, host: string, details: DarknetServerDetails) => {
        const locked = Array(details.passwordLength)
        for (let digit = 0; digit < 10; digit++) {
            const fill = Array(details.passwordLength).fill(digit)
            for (let i = 0; i < details.passwordLength; i++) {
                if (typeof locked[i] === 'number') fill[i] = locked[i]
            }
            const pw = fill.join('')
            const auth = await resendUntilReached(ns, host, pw)
            if (auth.success) return pw
            const mask = auth.data.split(',').map((x) => x === 'yes')
            for (let i = 0; i < details.passwordLength; i++) {
                if (mask[i]) locked[i] = digit
            }
        }
        error(ns, 'mask test failed, why?', details)
    },
    */
}
