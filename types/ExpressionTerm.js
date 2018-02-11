const Polynomial = require('./Polynomial');

// Input is an array of polynomials
function ExpressionTerm (t = []) {
	// starts out empty
	this.isExpressionTerm = true;
	this.power1polynomial;
	this.polynomialSubterms;

	// loop through all the input polynomials
	// 1. set aside power 1 polynomials
	// 2. multiply all the other polynomials together cleanly based on exponent
	for (let i = 0; i < t.length; i++) {
		if (t[i].exp == 1 && !this.power1polynomial) {
			this.power1polynomial = t[i];
		} else if (t[i].exp == 1) {
			this.power1polynomial = this.power1polynomial.multiply(t[i]);
		} else if (!this.polynomialSubterms) {
			this.polynomialSubterms = [t[i]];
		} else {
			let found = false;
			for (let j = 0; j < this.polynomialSubterms.length; j++) {
				if (this.polynomialSubterms[j].exp == t[i].exp) {
					this.polynomialSubterms[j] = this.polynomialSubterms[j].multiply(t[i]);
					break;
				}
			}
			if (!found) {
				this.polynomialSubterms.push(t[i]);
			}
		}
	}

}

ExpressionTerm.prototype.multiplyNegativeOne = function () {
	let neg1 = Polynomial.createNegativeOne();
	if (this.power1polynomial) {
		this.power1polynomial = this.power1polynomial.multiply(neg1);
	} else {
		this.power1polynomial = neg1;
	}
}

// I want it to be grouped by exponent
ExpressionTerm.prototype.simplify = function () {

	// linear run through to extract power1 polynomials
	for (let i = this.polynomialSubterms.length - 1; i >= 0; i--) {
		if (this.polynomialSubterms[i].exp === 1) {
			this.power1polynomial = this.power1polynomial.multiply(this.polynomialSubterms[i]);
			this.polynomialSubterms.splice(i, 1);
		}
	}

	// inefficient sort O(n^2)
	for (let i = this.polynomialSubterms.length - 1; i >= 0; i--) {
		let curExp = this.polynomialSubterms[i].exp;
		for (let j = i - 1; j >= 0; j--) {
			if (floatCmpr(curExp, this.polynomialSubterms[j]) === 0) {
				this.polynomialSubterms[j] = this.polynomialSubterms[i].multiply(this.polynomialSubterms[j]);
				this.polynomialSubterms.splice(i, 1);
				break;
			}
		}
	}
}

ExpressionTerm.prototype.setNegative = function () {
	this.power1polynomial.setNegative();
}

ExpressionTerm.prototype.addPower1Pols = function (t2) {
	this.power1polynomial.add(t2.power1polynomial);
}

ExpressionTerm.prototype.print = function () {
	if (this.power1polynomial) {
		this.power1polynomial.print();
	}
	if (this.polynomialSubterms) {
		for (let i = 0; i < this.polynomialSubterms.length; i++) {
			this.polynomialSubterms[i].print();
		}
	}
}


module.exports = ExpressionTerm;
