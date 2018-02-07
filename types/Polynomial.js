const Term = require('./Term');

function Polynomial (t) {
	if (!t) {
		t = [];
	}
	this.terms = t;
	this.exp = 1;
	this.isPolynomial = true;
}



Polynomial.prototype.print = function () {
	for (let i = 0; i < this.terms.length; i++) {
		console.log(this.terms[i].coef, this.terms[i].subterms);
	}
}

Polynomial.prototype.toExponent = function (exp) {
	this.exp *= exp;
	if (this.terms.length == 1) {
		this.terms[0].toExponent(this.exponent);
		this.exponent = 1;
	}
}

Polynomial.prototype.simplify = function () {

	for (let i = this.terms.length - 1; i >= 0; i--) {
		for (let j = i - 1; j >= 0; j--) {
			// console.log(i, j);
			if (this.terms[i].same(this.terms[j])) {
				// console.log("same");
				this.terms[j].coef += this.terms[i].coef;
				this.terms.splice(i, 1);
				// console.log(this.terms);
				break;
			}
		}
	}
}

// Need to account for exponent
Polynomial.prototype.add = function (pol2) {
	this.terms = this.terms.concat(pol2.terms);
	this.simplify();
}

// Need to account for exponent
Polynomial.prototype.subtract = function (pol2) {
	for (let i = 0; i < pol2.terms.length; i++) {
		pol2.terms[i].coef *= -1;
	}
	this.add(pol2);
}

Polynomial.prototype.multiply = function (p2) {
  let result = [];
  let p1 = this;
	for (let i = 0; i < p1.terms.length; i++) {
		let t1 = p1.terms[i];
		for (let j = 0; j < p2.terms.length; j++) {
			let t2 = p2.terms[j];
			result.push(t1.multiply(t2));
		}
	}
	let resultPol = new Polynomial(result);
	resultPol.simplify();
	return resultPol;
}

Polynomial.prototype.createNegativeOne = function () {
  let t = new Term();
  t.coef = -1;
  return new Polynomial([t]);
}

Polynomial.prototype.takeReciprocal = function () {
	if (this.terms.length == 0) {
		console.log("wtf... taking reciprocal of empty polynomial");
	} else if (this.terms.length == 1) {
		this.terms[0].takeReciprocal();
	} else {
		this.exp *= -1;
	}
}

// this.terms = terms;
// this.exp = 1;
// this.isPolynomial = true;

module.exports = Polynomial;
