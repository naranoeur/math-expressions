

function Expression (t = []) {
	// starts out empty
	this.power1term;
	this.expressionTerms = t;
}


// of there are no polynomialSubterms, then it's regular polynomial addition and subtraction
Expression.prototype.addExpressionTerm = function (e) {
	if (e.polynomialSubterms.length == 0) {
		this.power1term.add(e.power1polynomial);
		return;
	}
	this.expressionTerms.push(e);
}

Expression.prototype.subtractExpressionTerm = function (e) {
	if (e.polynomialSubterms.length == 0) {
		this.power1term.subtract(e.power1polynomial);
		return;
	}
	// multiply power1polynomial of expression term by -1
	//e.setNegative();
	this.expressionTerms.push(e);
}

module.exports = Expression;
