function createCoordinationExpression () {
    try {		
		_coordinationExpression = parseExpression(_phrases, 0, 0);
		var error = _coordinationExpression.error;
		var outcome = _coordinationExpression.outcome;
		var exp;	
		if (error) {
			exp = {
				ruleClass : "activity",
				type      : "skip",
				args      : []
			}
        } else {
			var ids = idMerge();
			exp = normalizeExpression(outcome, ids);
        }
		_coordinationExpression.exp = exp;
    } catch ( e ) {
        alert("createCoordinationExpression " + e);
    }
}

function parseExpression (phrases, i, level) {
	try {
		//var error = {
		//	error  : true
		//}
		var structure = "";
		var args = [];
		var stop = false;
		while (i < phrases.length && !stop) {
			// choice
			if (checkChoice(phrases, i, level)) {
				var choice = parseChoice(phrases, i, level);
				if (choice.error) {
					//error.code = choice.code + "ExpChoice @" + i + "\n";
					//error.structure = structure + choice.structure;
					return {
						error     : true,
						code      : choice.code + "ExpChoice @" + i + "\n",
						structure : structure + choice.structure
					}
				}
				i = choice.index;
				structure += choice.structure;
				args.push(choice.outcome);
			// parallel
			} else if (checkParallel(phrases, i, level)) {
				var parallel = parseParallel(phrases, i, level);
				if (parallel.error) {
					//error.code = parallel.code + "ExpParallel @" + i + "\n";
					//error.structure = structure + parallel.structure;
					return {
						error     : true,
						code      : parallel.code + "ExpParallel @" + i + "\n",
						structure : structure + parallel.structure
					}
				}
				i = parallel.index;
				structure += parallel.structure;
				args.push(parallel.outcome);			
			// repeat
			} else if (checkRepeat(phrases, i, level)) {
				var repeat = parseRepeat(phrases, i, level);
				if (repeat.error) {
					//error.code = repeat.code + "ExpRepeat @" + i + "\n";
					//error.structure = structure + repeat.structure;
					return {
						error     : true,
						code      : repeat.code + "ExpRepeat @" + i + "\n",
						structure : structure + repeat.structure
					}
				}
				i = repeat.index;
				structure += repeat.structure;
				args.push(repeat.outcome);			
			// phrase
			} else if (checkPhrase(phrases, i, level)) {
				var phrase = parsePhrase(phrases, i, level);
				if (phrase.error) {
					//error.code = phrase.code + "ExpPhrase @" + i + "\n";
					//error.structure = structure + phrase.structure;
					return {
						error     : true,
						code      : phrase.code + "ExpPhrase @" + i + "\n",
						structure : structure + phrase.structure
					}
				}
				if (phrase.outcome.ruleClass == "activity" || 
					phrase.outcome.ruleClass == "genericActivity" ||
                    phrase.outcome.ruleClass == "flow" || 
					phrase.outcome.ruleClass == "decision") {
					structure += phrase.structure;
					args.push(phrase.outcome);
				}
				i = phrase.index;
			} else {
				stop = true;
			}
		}
        var outcome;
		if (level == 0) {
			while (i < phrases.length) {
				// lineFeed
				var parsedLineFeed = parseLineFeed(phrases, i);
				if (parsedLineFeed.error) {
					//error.code = parsedLineFeed.code + "ExpLineFeed @" + i + "\n";
					//error.structure = structure + parsedLineFeed.structure;
					return {
						error     : true,
						code      : parsedLineFeed.code + "ExpLineFeed @" + i + "\n",
						structure : structure + parsedLineFeed.structure
					}
				}
				i = parsedLineFeed.index;
			}
			if (args.length == 0) {
				outcome = {
					type  : "skip",
					args : []
				}
				structure += "skip";			
			} else {
				outcome = {
					type  : "sequence",
					args : args
				}
			}
			return {
				error     : false,
				index     : i,
				outcome   : outcome,
				structure : structure
			}
		} else {
			if (args.length == 0) {
				outcome = {
					type  : "skip",
					args : []
				} 
				structure += "skip";
			} else {
				outcome = {
					type  : "sequence",
					args : args
				}
			}
			return {
				error     : false,
				index     : i,
				outcome   : outcome,
				structure : structure
			}
		}
	} catch ( e ) {
		alert("parseExpression " + e);
	}
}

function parseChoice (phrases, i, level) {
	// decision linefeed
	// phrase
	// lineFeed
	// exp1 
	// lineFeed
	// exp2
	// lineFeed
	try {
		var error = {
			error  : true,
		}
		var structure = "";
		// blanks
		var parsedBlanks = parseBlanks(phrases, i, level);
		if (parsedBlanks.error) {
			error.code = parsedBlanks.code + "ChoiceBlanks @" + i + "\n";
			error.structure = structure + parsedBlanks.structure;
			return error;
		}
		i = parsedBlanks.index;
		structure += parsedBlanks.structure;
		// decision
		i++;
		structure += "Decisione.";
		// lineFeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "ChoiceLineFeed1 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// phrase
		var parsedPhrase = parsePhrase(phrases, i, level + 1);
		if (parsedPhrase.error) {
			error.code = parsedPhrase.code + "ChoicePhrase @" + i + "\n";
			error.structure = structure + parsedPhrase.structure;
			return error;
		}
		i = parsedPhrase.index;
		structure += parsedPhrase.structure;
		// lineFeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "ChoiceLineFeed2 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// exp1
		var parsedExp1 = parseExpression(phrases, i, level + 1);
		if (parsedExp1.error) {
			error.code = parsedExp1.code + "ChoiceExp1";
			error.structure = structure + parsedExp1.structure;
			return error;
		}
		i = parsedExp1.index;
		structure += parsedExp1.structure;
		// linefeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "ChoiceLineFeed3 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// exp2
		var parsedExp2 = parseExpression(phrases, i, level + 1);
		if (parsedExp2.error) {
			error.code = parsedExp2.code + "ChoiceExp2 @" + i + "\n";
			error.structure = structure + parsedExp2.structure;
			return error;
		}
		i = parsedExp2.index;
		structure += parsedExp2.structure;
		// lineFeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "ChoiceLineFeed4 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// success
		var outcome = {
			type  : "choice",
			args : [parsedPhrase.outcome, parsedExp1.outcome, parsedExp2.outcome]
		}
		return {
			error     : false,
			index     : i,
			outcome   : outcome,
			structure : structure
		}
	} catch ( e ) {
		alert("parseChoice " + e);
	}
}

function parseParallel (phrases, i, level) {
	// parallel lineFeed
	// exp1 
	// lineFeed
	// exp2
	// lineFeed
	try {
		var error = {
			error     : true
		}
		var structure = "";
		// blanks
		var parsedBlanks = parseBlanks(phrases, i, level);
		if (parsedBlanks.error) {
			error.code = parsedBlanks.code + "ParallelBlanks @" + i + "\n";
			error.structure = structure + parsedBlanks.structure;
			return error;
		}
		i = parsedBlanks.index;
		structure += parsedBlanks.structure;
		// parallel
		i++;
		structure += "Parallelo.";
		// lineFeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "ParallelLineFeed1 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// exp1
		var parsedExp1 = parseExpression(phrases, i, level + 1);
		if (parsedExp1.error) {
			error.code = parsedExp1.code + "ParallelExp1 @" + i + "\n";
			error.structure = structure + parsedExp1.structure;
			return error;
		}
		i = parsedExp1.index;
		structure += parsedExp1.structure;
		// linefeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "ParallelLineFeed2 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// exp2
		var parsedExp2 = parseExpression(phrases, i, level + 1);
		if (parsedExp2.error) {
			error.code = parsedExp2.code + "ParallelExp2 @" + i + "\n";
			error.structure = structure + parsedExp2.structure;
			return error;
		}
		i = parsedExp2.index;
		structure += parsedExp2.structure;
		// lineFeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "ParallelLineFeed3 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// success
		var outcome = {
			type  : "parallel",
			args : [parsedExp1.outcome, parsedExp2.outcome]
		}			
		return {
			error     : false,
			index     : i,
			outcome   : outcome,
			structure : structure
		}
	} catch ( e ) {
		alert("parseParallel " + e);
	}
}

function parseRepeat (phrases, i, level) {
	// repeat linefeed
	// exp 
	// lineFeed
	try {
		var error = {
			error  : true,
		}
		var structure = "";
		// blanks
		var parsedBlanks = parseBlanks(phrases, i, level);
		if (parsedBlanks.error) {
			error.code = parsedBlanks.code + "RepeatBlanks @" + i + "\n";
			error.structure = structure + parsedBlanks.structure;
			return error;
		}
		i = parsedBlanks.index;
		structure += parsedBlanks.structure;
		// repeat
		i++;
		structure += "Ripeti.";
		// lineFeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "RepeatLineFeed1 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// exp
		var parsedExp = parseExpression(phrases, i, level + 1);
		if (parsedExp.error) {
			error.code = parsedExp.code + "RepeatExp @" + i + "\n";
			error.structure = structure + parsedExp.structure;
			return error;
		}
		i = parsedExp.index;
		structure += parsedExp.structure;
		// linefeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + " RepeatLineFeed2 @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// success
		var outcome = {
			type  : "repeat",
			args : [parsedExp.outcome]
		}
		return {
			error     : false,
			index     : i,
			outcome   : outcome,
			structure : structure
		}
	} catch ( e ) {
		alert("parseRepeat " + e);
	}
}

function parsePhrase (phrases, i, level) {
	// blanks phrase lineFeed
	try {
		var error = {
			error  : true,
		}
		var structure = "";
		// blanks
		var parsedBlanks = parseBlanks(phrases, i, level);
		if (parsedBlanks.error) {
			error.code = parsedBlanks.code + "PhraseBlanks @" + i + "\n";
			error.structure = structure + parsedBlanks.structure;
			return error;
		}
		i = parsedBlanks.index;
		structure += parsedBlanks.structure;
		// phrase
		if (i >= phrases.length) {
			error.code = "PhraseLength";
			error.structure = structure;
			return error;
		}
		if (phrases[i].type != "phrase") {
			error.code = "PhraseType";
			error.structure = structure;
			return error;
		}
		var triggered = phrases[i].triggered;
		var ruleClass = phrases[i].ruleClass;
		var ruleCode = phrases[i].ruleCode;
		i++;
        if (triggered) {
            structure += ruleClass;
        } else {
            structure += "skip";
        }
		// lineFeed
		var parsedLineFeed = parseLineFeed(phrases, i);
		if (parsedLineFeed.error) {
			error.code = parsedLineFeed.code + "PhraseLineFeed @" + i + "\n";
			error.structure = structure + parsedLineFeed.structure;
			return error;
		}
		i = parsedLineFeed.index;
		structure += parsedLineFeed.structure;
		// success
		var outcome = {
			type      : "simple",
			args      : [ruleCode],
			ruleClass : ruleClass
		}
		return {
			error     : false,
			index     : i,
			outcome   : outcome,
			structure : structure
		}
	} catch ( e ) {
		alert("parsePhrase " + e);
	}
}

function parseLineFeed (phrases, i) {
	try {
		var error = {
			error : true
		}
		var structure = "";	
		if (i >= phrases.length) {
			error.code = "LineFeedLength @" + i + "\n";
			error.structure = structure;
			return error;
		}		
		if (phrases[i].type != "lineFeed") {
			error.code = "LineFeedType @" + i + "\n";
			error.structure = structure;
			return error;
		}
		i++;
		structure += "\n";
		return {
			error     : false,
			index     : i,
			structure : structure
		}
	} catch ( e ) {
		alert("parseLineFeed " + e);
	}
}

function parseBlanks (phrases, i, level) {
	try {
		var error = {
			error : true
		}
		var structure = "";
		if (i >= phrases.length) {
			error.code = "BlanksLength @" + i + "\n";
			error.structure = structure;
			return error;
		}
		if (level == 0) {
			if (phrases[i].type == "blanks") {
				error.code = "BlanksBlanks @" + i + "\n";
				error.structure = structure;
				return error;
			}
			return {
				error     : false,
				index     : i,
				structure : structure
			}
		}		
		if (phrases[i].type != "blanks") {
			error.code = "BlanksType @" + i + "\n";
			error.structure = structure;
			return error;
		}
		if (phrases[i].size != (level * TAB_SIZE)) {
			error.code = "BlanksSize @" + i + "\n";
			error.structure = structure;
			return error;
		}
		i++;
		for (var j = 0; j < level; j++) {
			structure += "==>";
		}
		return {
			error     : false,
			index     : i,
			structure : structure
		}
	} catch ( e ) {
		alert("parseBlanks " + e);
	}
}

function checkChoice (phrases, i, level) {
	try {
		if (i >= phrases.length) {
			return false;
		}
		if (level == 0) {
			return phrases[i].type == "keyword" && phrases[i].value == "Decisione";
		}
		if (phrases[i].type != "blanks") {
			return false;
		}
		if (phrases[i].size != (level * TAB_SIZE)) {
			return false;
		}
		i++;
		if (i >= phrases.length) {
			return false;
		}
		return phrases[i].type == "keyword" && phrases[i].value == "Decisione";
	} catch ( e ) {
		alert("checkChoice " + e);
	}
}

function checkRepeat (phrases, i, level) {
	try {
		if (i >= phrases.length) {
			return false;
		}
		if (level == 0) {
			return phrases[i].type == "keyword" && phrases[i].value == "Ripeti";
		}
		if (phrases[i].type != "blanks") {
			return false;
		}
		if (phrases[i].size != (level * TAB_SIZE)) {
			return false;
		}
		i++;
		if (i >= phrases.length) {
			return false;
		}
		return phrases[i].type == "keyword" && phrases[i].value == "Ripeti";
	} catch ( e ) {
		alert("checkRepeat " + e);
	}
}

function checkParallel (phrases, i, level) {
	try {
		if (i >= phrases.length) {
			return false;
		}
		if (level == 0) {
			return phrases[i].type == "keyword" && phrases[i].value == "Parallelo";
		}
		if (phrases[i].type != "blanks") {
			return false;
		}
		if (phrases[i].size != (level * TAB_SIZE)) {
			return false;
		}
		i++;
		if (i >= phrases.length) {
			return false;
		}
		return phrases[i].type == "keyword" && phrases[i].value == "Parallelo";
	} catch ( e ) {
		alert("checkParallel " + e);
	}
}

function checkPhrase (phrases, i, level) {
	try {
		if (i >= phrases.length) {
			return false;
		}
		if (level == 0) {
			return phrases[i].type == "phrase";
		}
		if (i >= phrases.length) {
			return false;
		}
		if (phrases[i].type != "blanks") {
			return false;
		}
		if (phrases[i].size != (level * TAB_SIZE)) {
			return false;
		}
		i++;
		if (i >= phrases.length) {
			return false;
		}
		return phrases[i].type == "phrase"
	} catch ( e ) {
		alert("testDecision " + e);
	}
}

function normalizeExpression (expression, ids) {
	try {
		var args = expression.args;
		switch (expression.type) {
            case "skip" : {
                return expression;
            }
			case "simple" : { // work around - fix in previous step
				var simpleExp = lookUp(args[0], ids);
				args[0] = simpleExp;				
				return expression;
			}
			case "sequence" : {
				if (args.length == 0) {
					return expression;
				}
				if (args.length == 1) {
					return normalizeExpression(args[0], ids);
				}
				var head = normalizeExpression(args[0], ids);
				var tail = {
					type  : "sequence",
					args : []
				}
				for (var i = 1; i < args.length; i++) {
					tail.args.push(args[i]);
				}				
				return {
					type  : "sequence",
					args : [head, normalizeExpression(tail, ids)]
				}
			}
			case "choice" : {
				return {
					type  : "choice",
					args : [normalizeExpression(args[0], ids), 
					        normalizeExpression(args[1], ids), 
							normalizeExpression(args[2], ids)]
				}
			}
			case "repeat" : {
				return {
					type  : "repeat",
					args : [normalizeExpression(args[0], ids)]
				}
			}
			case "parallel" : {
				return {
					type  : "parallel",
					args : [normalizeExpression(args[0], ids), 
					        normalizeExpression(args[1], ids)]
				}
			}
		}	} catch ( e ) {
		alert("normalizeExpression " + e);
	}
}

function idMerge () {
	try {
		var list = [];
		for (var id in _flows) {
			list.push(_flows[id]);
		}
		for (var id in _activities) {
			list.push(_activities[id]);
		}
		for (var id in _decisions) {
			list.push(_decisions[id]);
		}
		for (var id in _genericActivities) {
			list.push(_genericActivities[id]);
		}
		return list;
	} catch ( e ) {
		alert("idMerge " + e);
	}
}

function lookUp (id, ids) {
	try {
		var i = 0; 
		while (i < ids.length && ids[i].id != id) {
			i++;
		}
		if (i < ids.length) {
			return ids[i];
		}
		alert("lookUp: " + id + " not found");	
		return null;
	} catch ( e ) {
		alert("lookUp " + e);
	}
}