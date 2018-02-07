
function Term () {
	this.coef = 1;
	this.subterms = {}
}

Term.prototype.same = function (t) {
	const k1 = Object.keys(this.subterms);
	const k2 = Object.keys(t.subterms);

	if (k1.length != k2.length) {
		return false;
	}

	for (let i = 0; i < k1.length; i++) {
		if (k1[i] != k2[i]) {
			return false;
		}
		if (Math.abs(this.subterms[k1[i]] - t.subterms[k2[i]]) > 0.0000000001) {
			return false;
		}
	}

	return true;
}

Term.prototype.toExponent = function (exp) {
	this.coef = Math.pow(this.coef, exp);
	for (let key in this.subterms) {
		this.subterms[key] *= exp;
	}
}

Term.prototype.multiply = function (t2) {
	let t1 = this;

	let result = new Term();
	result.coef = t1.coef * t2.coef;
	result.subterms = Object.assign( {}, t1.subterms);

	const k2 = Object.keys(t2.subterms);

	for (let i = 0; i < k2.length; i++) {
		let property = k2[i];
		if (result.subterms.hasOwnProperty(property)) {
				result.subterms[property] += t2.subterms[property];
			} else {
				result.subterms[property] = t2.subterms[property];
		}
	}

	return result;
}

Term.prototype.takeReciprocal = function () {
	this.coef = 1/this.coef;
	for (let key in this.subterms) {
		this.subterms[key] *= -1;
	}
}

module.exports = Term;
