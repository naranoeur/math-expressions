
// ---- Subterms ----- //

function Subterm (coef, exp = 1) {
	this.coef = coef;
	this.exp = exp;
}


// console.log(parseSubterm("x^2"));

module.exports = Subterm;
