const Term = require('./types/term');
const Polynomial = require('./types/Polynomial');
const subtermParser = require('./subtermParser');

const parseSpecialSubterm = subtermParser.parseSpecialSubterm;
const parseSubterm = subtermParser.parseSubterm;

function tokenizeTerm (str) {
  let subterms = [];
  let buffer = "";
  let operator = true;
  for (let i = 0; i < str.length; i++) {
    if (str[i] == '*' || str[i] == '/') {
      if (buffer.length == 0) {
        console.log("Invalid subterm expression: two operators * or / next to each other");
        return null;
      } else {
        subterms.push({operator, subterm: buffer});
        buffer = "";
      }
      if (str[i] == '*') {
        operator = true;
      } else {
        operator = false;
      }
    } else {
      buffer += str[i];
    }
  }
  subterms.push({operator, subterm: buffer});
  return subterms;
}

function constructTermFromSubterms (tokens) {
  let term = new Term();

   for (let i = 0; i < tokens.length; i++) {
     if (isNaN(tokens[i].subterm.coef)) {

       if (!tokens[i].operator) {
         tokens[i].subterm.exp *= -1;
       }

       if (term.hasOwnProperty(tokens[i].coef)) {
         term.subterms[tokens[i].subterm.coef] += tokens[i].subterm.exp;
       } else {
         term.subterms[tokens[i].subterm.coef] = tokens[i].subterm.exp;
       }
     } else {
       if (tokens[i].operator) {
         term.coef *= Math.pow(tokens[i].subterm.coef, tokens[i].subterm.exp);
       } else {
         term.coef /= Math.pow(tokens[i].subterm.coef, tokens[i].subterm.exp);
       }
     }
   }
   return term;
}

function parseTerm (str) {
 // console.log(str);
 if (str.length == 0 || isOperator(str[0]) || isOperator(str[str.length - 1])) {
   return null;
 }

 let subterms = tokenizeTerm(str);
 for (let i = 0; i < subterms.length; i++) {
   subterms[i].subterm = parseSubterm(subterms[i].subterm);
 }
 let result = constructTermFromSubterms(subterms);

 return result;
}

// Need to return an ExpressionTerm
function parseSpecialTerm (str, history) {
 // console.log(str);
 if (str.length == 0 || isOperator(str[0]) || isOperator(str[str.length - 1])) {
   return null;
 }

 // tokenize the string into subterms based of *
 let subterms = tokenizeTerm(str);

 // split up subterms into regular and special
 let special = [];
 let regular = [];
 let middle;

 for (let i = 0; i < subterms.length; i++) {
   if (subterms[i].subterm.indexOf('@') < 0) {
     subterms[i].subterm = parseSubterm(subterms[i].subterm);
     regular.push(subterms[i]);
   } else {
     subterms[i].subterm = parseSpecialSubterm(subterms[i].subterm, history);
     special.push(subterms[i]);
   }
 }

 // construct term from regular subterms
 let term = constructTermFromSubterms(regular);


 for (let i = 0; i < special.length; i++) {
   if (!special[i].operator) {
     special[i].subterm.takeReciprocal();
   }
   special[i] = special[i].subterm;
 }
 // now I want to multiply the regular and special terms together
 let p = new Polynomial([term]);
 special.push(p);
 return special;
}

// Helpers

function isOperator(ch) {
	return /\+|-|\*|\/|\^/.test(ch);
}


module.exports = {
  parseTerm,
  parseSpecialTerm
}
