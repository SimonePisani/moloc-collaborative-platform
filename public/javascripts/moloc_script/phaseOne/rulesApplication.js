function matchRules (phrase, ruleType) {
	try {	
		for (var i = 0; i < _rules.length; i++) {
			var rule = _rules[i];
            if (rule.type == ruleType) {
				var matchTable = matchRule(rule, phrase);
				if (matchTable) {
					return {
						rule       : rule,
						phrase     : phrase,
						matchTable : matchTable
					}	
				}					
			}
		}
		return null;
	} catch ( e ) {
		alert("matchRules " + e);
	}
}

function matchRule (rule, phrase) {
	try {
		var pattern = rule.pattern;
		var coverTable = [];
		for (var i = 0; i < pattern.length; i++) { // coverTable is a boolean array same size of rule pattern
			coverTable.push(false);
		}
		var matchTable = [];
		for (var i = 0; i < phrase.length; i++) {
			var word = phrase[i];
			matchWord(word, pattern, coverTable, matchTable);
		}
		if (isRuleFired(coverTable)) {
			var matchTable1 = [];
			for (var i = 0; i < matchTable.length; i++) {
				if (matchTable[i] != undefined) {
					matchTable1.push(matchTable[i]);
				}
			}
			return matchTable1;		
		} else {
			clearPhrase(phrase);
			return null;
		}
	} catch ( e ) {
		alert("matchRule " + e);
	}
}

function clearPhrase (phrase) {
	try {
		for (var i = 0; i < phrase.length; i++) {
			var word = phrase[i];
			word.fired = false;
			word.kind = "none";
		}
	} catch ( e ) {
		alert("clearPhrase " + e);
	}
}	

function matchWord (word, pattern, coverTable, matchTable) {
	try {
		for (var i = 0; i < pattern.length; i++) { 
			var ruleElement = pattern[i];
			if (!coverTable[i]) {
				switch (ruleElement.type) {
					case "token" : {
						var ruleElementKind = ruleElement.kind;
						if (ruleElementKind == "role" || ruleElementKind == "document"){
							var voice = findInGlossary(word.id);
							if (voice) {
								if (ruleElementKind == voice.kind) {
									coverTable[i] = true;
                                    matchTable[i] = voice;
									word.fired = true;
									word.kind = ruleElementKind;
									return;
								} else {
									// word is in glossary but of another kind: discarded
								}
							} else {
								// word is not in glossary: discarded
							}
						} else {
							if (ruleElement.kind == word.type && word.syntax == "noun") {	
								coverTable[i] = true;
								matchTable[i] = word;
								word.fired = true;
								return;
							}
						}
						break;
					}
					case "word" : {
						if (sameWord(ruleElement, word)) {
							coverTable[i] = true;
							word.fired = true;
							return;
						}
						if ("alternatives" in ruleElement) {
							var alternatives = ruleElement.alternatives;
							for (var j = 0; j < alternatives.length; j++) {
								var alternativeRuleElement = alternatives[j];
								if (sameWord(alternativeRuleElement, word)) {
									coverTable[i] = true;
									word.fired = true;
									return;
								}								
							}
						}
						break;                       
					}
				}
			}
		}	
	} catch ( e ) {
		alert("matchWord " + e);
	}
}

function sameWord (word1, word2) {
	try {
		var b = word1.type   == word2.type &&
				word1.syntax == word2.syntax &&
				word1.id     == word2.id &&
				word1.pieces == word2.pieces;
		return b;
	} catch ( e ) {
		alert("sameWord " + e);
	}
}

function findInGlossary (id) {
	try {
		var i = 0;
		while (i < _glossary.length && _glossary[i].id != id) {
			i++;
		}
		if (i < _glossary.length) {
			return _glossary[i];
		} else {
			return null;
		}
	} catch ( e ) {
		alert("findInGlossary " + e);
	}
}

function isRuleFired (coverTable) {
	try {
		var c = 0;
		for (var i = 0; i < coverTable.length; i++) {
			if (coverTable[i]) {
				c++;
			}
		}
    return c == coverTable.length;
	} catch ( e ) {
		alert("isRuleFired " + e);
	}
}