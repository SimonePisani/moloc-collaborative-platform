function cloneExp (exp) {
	try {
		var newExp = {
			type : exp.type
		}
		if ("ruleClass" in exp) {
			newExp.ruleClass = exp.ruleClass;
		}
		switch (exp.type) {
			case "skip"  :
			case "simple" : {
				newExp.args = exp.args
				break;
			}
			case "repeat"   : {
				var newArg0 = cloneExp(exp.args[0]);
				newExp.args = [newArg0]
				break;
			}
			case "sequence" :
			case "parallel" : {
				var newArg0 = cloneExp(exp.args[0]);
				var newArg1 = cloneExp(exp.args[1]);
				newExp.args = [newArg0, newArg1]
				break;
			}
			case "choice" : {
				var newArg0 = cloneExp(exp.args[0]);
				var newArg1 = cloneExp(exp.args[1]);
				var newArg2 = cloneExp(exp.args[2]);
				newExp.args = [newArg0, newArg1, newArg2]
				break;
			}
		}
		return newExp;
	} catch ( e ) {
		alert("cloneExp " + e);
	}
}		

function checkCoordinationExpression () {
	try {
		var exp = _coordinationExpression.exp;
		_coordinationExpressionErrors = [];
		if (_coordinationExpression.error) {
			var message = localizeMessage("Syntax error");
			var error = {
				message : message
			}
			_coordinationExpressionErrors.push(error);
		} else {
			var lastDecisions = {};
			checkExp(exp, lastDecisions, _coordinationExpressionErrors);
			var choiceDecisions = {};
			findDecisionInChoice(exp, choiceDecisions, _coordinationExpressionErrors);
			checkDecisions(lastDecisions, choiceDecisions, _coordinationExpressionErrors);
		}
	} catch ( e ) {
		alert("checkCoordinationExpression " + e);
	}
}

function checkExp (exp, lastDecisions, errors) {
	try {
		switch (exp.type) {
			case "skip"  : {
				break;
			}
			case "simple" : {
				break;
			}
			case "repeat"   : {
				var lastActivity = checkIteration(exp.args[0], lastDecisions, errors);
				var lastActivityName = computeLastActivityName(lastActivity)
				if (lastActivity.type != "choice") {
					if (lastActivity.type != "simple" || lastActivity.ruleClass != "decision") {
						var firstActivity = findFirstActivity(exp.args[0]);
						var message = localizeMessage("Iteration begins with") + " " + firstActivity + " " +
									localizeMessage("and ends with") + " " + lastActivityName;
						var error = {
							message : message
						}
						errors.push(error);
					} else {
						lastDecisions[lastActivity.args[0].id] = true;
					}
				}
				break;
			}
			case "sequence" : {
				checkExp(exp.args[0], lastDecisions, errors);
				checkExp(exp.args[1], lastDecisions, errors);
                break;
			}
			case "choice" : {
				checkExp(exp.args[0], lastDecisions, errors);
				checkExp(exp.args[1], lastDecisions, errors);
				checkExp(exp.args[2], lastDecisions, errors);
				break;
			}
			case "parallel" : {
				checkExp(exp.args[0], lastDecisions, errors);
				checkExp(exp.args[1], lastDecisions, errors);
				break;
			}
		}
	} catch ( e ) {
		alert("checkExp " + e);
	}
}

function checkIteration (exp, lastDecisions, errors) {
	try {
		switch (exp.type) {
			case "skip"  : {
				return exp;
			}
			case "simple" : {
				return exp;
			}
			case "repeat"   : {
				var lastActivity = checkIteration(exp.args[0], errors);
				var lastActivityName = computeLastActivityName(lastActivity);
				var firstActivity = findFirstActivity(exp.args[0]);
				if (lastActivity.type != "choice") {
					if (lastActivity.type != "simple" || lastActivity.ruleClass != "decision") {
						var message = localizeMessage("Iteration begins with") + " " + firstActivity + " " +
									localizeMessage("and ends with") + " " + lastActivityName;
						var error = {
							message : message
						}
						errors.push(error);
					} else {
						lastDecisions[lastActivity.args[0].id] = true;
					}
				}
				return exp;
			}
			case "sequence" : {
				return checkIteration(exp.args[1], lastDecisions, errors);
			}
			case "choice" : {
				return exp;
			}
			case "parallel" : {
				return exp;
			}
		}
	} catch ( e ) {
		alert("checkIteration " + e);
	}
}

function computeLastActivityName (exp) {
	try {
		switch (exp.type) {
			case "skip"  : {
				return "skip";
			}
			case "simple" : {
				return exp.args[0].id;
			}
			case "repeat"   : {
				return localizeMessage("loop");
			}
			case "sequence" : {
				alert("lastActivity: sequence");
				return "?";
			}
			case "choice" : {
				return localizeMessage("choice");
			}
			case "parallel" : {
				return localizeMessage("parallel");
			}
		}
	} catch ( e ) {
		alert("computeLastActivityName " + e);
	}
}		

function findFirstActivity (exp) {
	try {
		switch (exp.type) {
			case "skip"  : {
				return "skip";
			}
			case "simple" : {
				return exp.args[0].id;
			}
			case "repeat"   : {
				return findFirstActivity(exp.args[0]);
			}
			case "sequence" : {
				return findFirstActivity(exp.args[0]);
			}
			case "choice" : {
				return exp.args[0].id;
			}
			case "parallel" : {
				return findFirstActivity(exp.args[0]);
			}
		}	} catch ( e ) {
		alert("findFirstActivity " + e);
	}
}

function findDecisionInChoice (exp, decisions, errors) {
	try {
		switch (exp.type) {
			case "skip"  : {
				break;
			}
			case "simple" : {
				break;
			}
			case "repeat"   : {
				findDecisionInChoice(exp.args[0], decisions, errors);
				break;
			}
			case "sequence" : {
				findDecisionInChoice(exp.args[0], decisions, errors);
				findDecisionInChoice(exp.args[1], decisions, errors);
                break;
			}
			case "choice" : {
				var decisionExp = exp.args[0];
				if (decisionExp.type == "simple" && decisionExp.ruleClass == "decision") {
					decisions[decisionExp.args[0].id] = true
				} else {
					var message = localizeMessage("Missing decision") + ": " + decisionExp.args[0].id;
					var error = {
						message : message
					}
					errors.push(error);				
				}
				findDecisionInChoice(exp.args[1], decisions, errors);
				findDecisionInChoice(exp.args[2], decisions, errors);
				break;
			}
			case "parallel" : {
				findDecisionInChoice(exp.args[0], decisions, errors);
				findDecisionInChoice(exp.args[1], decisions, errors);
				break;
			}
		}
	} catch ( e ) {
		alert("findDecisionInChoice " + e);
	}
}

function checkDecisions (lastDecisions, choiceDecisions, errors) {
	try {
		for (var decisionId in _decisions) {
			if (!(decisionId in lastDecisions) && !(decisionId in choiceDecisions)) {
				var message = localizeMessage("Decision not allowed") + " " + decisionId;
				var error = {
					message : message
				}
				errors.push(error);				
			}
		}
	} catch ( e ) {
		alert("checkDecisions " + e);
	}
}