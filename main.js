var parseExpression = require('./mathParser');

try {
  parseExpression('x-2');
}
catch (err) {
   console.log(err.message);
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
