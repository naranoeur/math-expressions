const Polynomial = require('./types/Polynomial');
const Term = require('./types/Term');
const ExpressionTerm = require('./types/ExpressionTerm');
const { parseTerm, parseSpecialTerm } = require('./termParser');

function parsePolynomial (str, history = []) {
  // console.log(str);
  if (str.length == 0) {
    throw new Error("Error: something is not right");
  }
  let lastCh = str[str.length - 1];
  if (isOperator(lastCh)) {
    throw new Error("Error: an operator before parenthesis");
  }

  let terms = [];
  let buffer = "";
  let operator = 1; //  + or -

  for (let i = 0; i < str.length; i++) {
    if (str[i] == '+') {
      if (buffer.length > 0) {
				terms.push({ operator, buffer });
				operator = 1;
        buffer = "";
      }
    } else if (str[i] == '-') {
      if (buffer.length > 0) {
				terms.push({ operator, buffer });
        operator = -1;
        buffer = "";
      } else {
        operator *= -1;
      }
    } else {
      buffer += str[i];
    }

  }
	terms.push({ operator, buffer }); // place leftover elements

	// pol gives us the regular part of the polynomial.
	let pol = new Polynomial();
	let special = [];
	// Split terms up into special and regular parts. If regular then parse while at it
	for (let i = 0; i < terms.length; i++) {
		if (terms[i].buffer.indexOf('@') < 0) {
			let term = parseTerm(terms[i].buffer);
			term.coef *= terms[i].operator;
			pol.terms.push(term);
		} else {
			special.push(terms[i]);
		}
	}


	pol.simplify();

  let expressionTerms = [];

  for (let i = 0; i < special.length; i++) {
    let specialPolArr = parseSpecialTerm(special[i].buffer, history);
    let expressionTerm = new ExpressionTerm(specialPolArr);
    if (special[i].operator < 0) {
      expressionTerm.multiplyNegativeOne();
    }
    expressionTerms.push(expressionTerm);
  }

  if (pol.terms.length > 0) {
    expressionTerms.push(new ExpressionTerm([pol]));
  }


	return expressionTerms;
}

// Helpers

function isOperator(ch) {
	return /\+|-|\*|\/|\^/.test(ch);
}


module.exports = parsePolynomial;
