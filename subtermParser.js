const Subterm = require('./types/subterm');
const Term = require('./types/term');
const Polynomial = require('./types/polynomial');

function splitUpSubterm (str) {
	if (str.length == 0) {
		return null;
	}

	let coef;
	let exp;
	let index = str.indexOf('^');
	if (index < 0) {
		coef = str;
		exp = 1;
	} else {
		coef = str.substring(0, index);
		exp = str.substr(index + 1);
		if (exp.length == 0 || coef.length == 0) {
			throw new Error("Error: an exponent or a coefficients is missing");
		}
	}
	return {coef, exp};
}

// Either a number or an exponent
function parseSubterm (str) {
	let subterm = splitUpSubterm(str);
	if (!subterm) {
		return null;
	}
	let {coef, exp} = subterm;

  // Exponent must be a number for now
  exp = Number(exp);
  if(isNaN(exp)) {
		throw new Error("Error: the exponents must be numeric");
  }

  if (isVariable(coef)) {
    return new Subterm( coef, exp );
  }

  coef = Number(coef);

  if (isNaN(coef)) {
		throw new Error("Error: syntax error");
  }

  return new Subterm(coef, exp);
}


function parseSpecialSubterm (str, specialArr) {
	let subterm = splitUpSubterm(str);
	if (!subterm) {
		return null;
	}
	let {coef, exp} = subterm;

	// handle exponent
	// If exponent is 1, then don't do anything. Otherwise convert to somethign workable.
	// If exponent isn't the type currently accepted return null.
	if (exp === 1) {

	} else if (isSpecial(exp) >= 0) {
		let indx = isSpecial(exp);
		exp = specialArr[indx];
		if (isPolynomialNumber(exp)) {
			exp = getPolynomialNumber(exp);
		} else {
			throw new Error("Error: invalid exponent");
		}
	} else if (isNumber(exp)) {
		exp = Number(exp);
	} else {
		throw new Error("Error: invalid exponent");
	}

	// handle coefficient
	// If coefficient is special, then handle it seperate.
	// If polynomial coefficient can be simplified do so, otherwise take to exponent and return the polynomial
	if (isSpecial(coef) >= 0) {

		let indx = isSpecial(coef);
		coef = specialArr[indx];
		if (!coef.isPolynomial) {
			throw new Error("Error: please try simplifying first");
		}
		coef.toExponent(exp);
		return coef;

	} else if (isVariable(coef)) {

		let term = new Term();
		term.subterms[coef] = exp;
		return new Polynomial([term]);

	} else if (isNumber(coef)) {

		coef = Number(coef);
		let term = new Term();
		term.coef = Math.pow(coef, exp);
		return new Polynomial([term]);

	} else {
		throw new Error("Error: syntax error");
	}

}

// ---- Helpers ---- //

function isPolynomialNumber (p) {
	if (p.terms.length != 1) {
		return false;
	}
	if (Object.keys(p.terms[0].subterms).length != 0) {
		return false;
	}
	return true;
}

function getPolynomialNumber (p) {
	return p.terms[0].coef;
}

function isPolynomailVariable (p) {
	if (p.terms.length != 1) {
		return false;
	}
	let k = Object.keys(p.terms[0].subterms);
	if (k.length != 1) {
		return false;
	}
	if (p.terms[0].subterms[k[0]] != 1 || p.terms[0].subterms.coef != 1) {
		return false;
	}
	return true;
}

function getPolynomialVariable () {
	let k = Object.keys(p.terms[0].subterms);
	return k[0];
}

// string parsing Helpers

function isLetter(ch) {
	return /[a-z]/i.test(ch);
}

function isVariable(s) {
   return typeof s == "string" && s.length == 1 && isLetter(s);
}

function isOperator(ch) {
	return /\+|-|\*|\/|\^/.test(ch);
}

function isSpecial (s) {
	if (s.length == 0 || s[0] != '@') {
		return -1;
	}
	let x = Number(s.substr(1));
	if (isNaN(x) || !Number.isInteger(x)) {
		return -1;
	} else {
		return x;
	}
}

function isNumber (s) {
	return !isNaN(Number(s));
}

module.exports = {
	parseSubterm,
	parseSpecialSubterm
}
