const parsePolynomial = require('./polynomialParser');
const ExpressionTerm = require('./types/ExpressionTerm');



function isComma(ch) {
	return /,/.test(ch);
}

function isDot(ch) {
	return /\./.test(ch);
}

function isDigit(ch) {
	return /\d/.test(ch);
}

function isLetter(ch) {
	return /[a-z]/i.test(ch);
}

function isOperator(ch) {
	return /\+|-|\*|\/|\^/.test(ch);
}

function isLeftParenthesis(ch) {
	return /\(/.test(ch);
}

function isRightParenthesis(ch) {
	return /\)/.test(ch);
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

function floatCmpr (x, y) {
	if (Math.abs(x - y) < 0.0000001) {
		return 0;
	} else if (x > y) {
		return 1;
	} else {
		return -1;
	}
}


// --- Expression ---- //

// Tokenizes string based on parenthesis
function parseExpression (str) {

	// check for special character '@'
	if (str.indexOf('@') >= 0) {
		throw new Error("Error: ");
	}

	// remove spaces
	str = removeSpaces(str);

  // Remove parenthesis
  const stack = [];
  const pols = [];
  let i = 0;
  while (i < str.length) {
    if (str[i] == '(') {
      stack.push(i);
      i++;
    } else if (str[i] == ')') {
      if (stack.length > 0) {
        let start = stack.pop();
        pols.push(str.substring(start + 1, i));
        let placeholder = `@${pols.length - 1}`
        str = str.substring(0,start) + placeholder + str.substr(i + 1);
        i = start + placeholder.length;
      } else {
				throw new Error("Error: unbalanced parenthesis");
      }
    } else {
      i++;
    }
  }
	pols.push(str);
  if (stack.length > 0 || pols.length == 0) {
    throw new Error("Error: unbalanced parenthesis");
  }

	// parse each term
	for (let i = 0; i < pols.length; i++) {
		pols[i] = parsePolynomial(pols[i], pols);
    // return an array of Expression Terms: need to simplify them and handle stuff


    // Simplify a bit... Note if student makes expression too complicated, it will not get parsed correctly
    if (pols[i].length > 1) {
      console.log("hmm try simplifying");
			throw new Error("Error: please try simplifying first.");
    } else if (pols[i].length == 0) {
      console.log("hmm something's not right");
			throw new Error("Error: something's not right.");
    }
    if (pols[i][0].isExpressionTerm && pols[i][0].power1polynomial && !pols[i][0].polynomialSubterms) {
      pols[i] = pols[i][0].power1polynomial;
    }
	}
  if (pols[pols.length - 1].isPolynomial) {
    pols[pols.length - 1].print();
  } else {
    pols[pols.length - 1][0].print();
  }
	//pols[pols.length - 1].print();
  //console.log(pols[pols.length - 1]);
}


function removeSpaces (s) {
	return s.replace(/\s+/g, '');
}

 //parseExpression('(5*x^2 + 1) + x^3 + 1');
// parseExpression('2*(x + x^3)');


// let pol1 = parsePolynomial("5");
// let pol2 = parsePolynomial("x^3 + 2");
//pol1.print();
//pol2.print();
// let pol3 = polynomialAdd(pol1, pol2);
// pol3.print();

// console.log( parseTerm('2'));

// console.log(parseSubterm("3^2"));

module.exports = parseExpression;
