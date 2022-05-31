export function dePrime(num) {
	var cnt = {}
	for (var i = 2; i * i < num; i++) {
		while (num % i == 0) {
			cnt[i] = (cnt[i] || 0) + 1
			num /= i
		}
	}
	cnt[num] = (cnt[num] || 0) + 1
	return cnt
}

export function cached(func) {
	var _cc = {}
	return (...args) => {
		var key = args.join('|')
		var v = _cc[key]
		if (v == undefined) {
			v = _cc[key] = func(...args)
		}
		return v
	}
}