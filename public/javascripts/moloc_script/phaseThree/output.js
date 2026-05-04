function outputPattern (pattern) {
	try {
		var s = "";
		for (var i = 0; i < pattern.length; i++) {
			var token = pattern[i];
			if (token.type == "word") {
				var output;
				if ("alternatives" in token) {
					var alternatives = token.alternatives;
					output = "[" + outputPieces(token.pieces) + " | ";
					for (var j = 0; j < alternatives.length; j++) {
						var alternativeToken = alternatives[j];
						if (j < alternatives.length - 1) {
							output += outputPieces(alternativeToken.pieces) + " | ";
						} else  {
							output += outputPieces(alternativeToken.pieces);
						}
					}
					output += "]";
				} else {
					output = outputPieces(token.pieces);
				}
				if ((i < pattern.length - 1 ) && (pattern[i + 1].syntax == "comma")) {
					s += output;
				} else {
					s += output + " ";
				}
			} else if (token.type == "token") {
				if ((i < pattern.length - 1 ) && (pattern[i + 1].syntax == "comma")) {
					s += upperCaseFirstChar(localizeWord(token.kind));
				} else {
					s += upperCaseFirstChar(localizeWord(token.kind)) + " ";
				}
			} else {
				alert("outputPattern: wrong token");
			}
		}
		return s;
	} catch ( e ) {
		alert("outputPattern" + e);
	}
}

function outputSentence (sentence) {
	try {
		var s = sentence[0];
		var apostrophe = false;
		for (var i = 1; i < sentence.length; i++) {
			var word = sentence[i];
			if (word == ",") {
				s += ",";
			} else if (word[word.length - 1] == "'") {
				s += " " + word;
				apostrophe = true;
			} else if (apostrophe) {
                s += word;
				apostrophe = false;
            } else {
                s += " " + word;
			}
		}
		return s;
	} catch ( e ) {
		alert("outputSentence " + e);
	}
}

function outputRole (role) {
    try {
		var s = upperCaseFirstChar(role.name);
		var subType = role.subType;
		if (subType == "collective") {
			s += " {";
			var components = role.components;
			for (var i = 0; i < components.length; i++) {
				var component = components[i];
				var componentName = component.name;
				if (i < components.length - 1) {		
					s += upperCaseFirstChar(componentName) + ", ";
				} else {
					s += upperCaseFirstChar(componentName);
				}					
			}
			s += "}";
		}
		if (subType == "juridical") {
			s += " [" + upperCaseFirstChar(localizeWord(subType)) + "]";
		}
        return s;
    } catch ( e ) {
        alert("outputRole " + e);
    }
}

function outputDocument (doc) {
    try {
		var s = upperCaseFirstChar(doc.name);
		var subType = doc.subType;
		if (subType == "public") {
			s += " [" + upperCaseFirstChar(localizeWord(subType)) + "]";
		} else if (subType == "private") {
			var owner = doc.owners[0];
			var ownerName = owner.name;
			s += " [" + upperCaseFirstChar(ownerName) + "]";
		}
		return s;
    } catch ( e ) {
        alert("outputRole " + e);
    }
}

function upperCaseFirstChar (s) {
    try {
        var firstChar = s[0].toUpperCase();
        var tail = s.substr(1, s.length -1);
        return firstChar + tail;
    } catch ( e ) {
        alert("upperCaseFirstChar " + e);
    }
}

function outputPieces (pieces) {
    try {
        var s = "";
        for (var i = 0; i < pieces.length - 1; i++) {
            var piece = pieces[i];
			if (i < pieces.length -1 && piece[piece.length - 1] == "'") {
				s += piece;
			} else {
				s += piece + " ";
			}
        }
        s += pieces[pieces.length - 1];
        return s;
    } catch ( e ) {
        alert("outputPieces " + e)
    }
}

function outputCoordExp (exp) {
	try {
		switch (exp.type) {
			case "skip" : {
				return "skip";
			}
			case "simple" : {
				return exp.args[0].id;
			}
			case "repeat" : { 
				return "*" + outputCoordExp(exp.args[0]);
			}
			case "sequence" : {
				return "(" + 
						outputCoordExp(exp.args[0]) + " , " + 
						outputCoordExp(exp.args[1]) + 
					   ")";
			}
			case "choice" : {
				return "(" + 
						outputCoordExp(exp.args[0]) + " ? " + 
						outputCoordExp(exp.args[1]) + " : " + 
						outputCoordExp(exp.args[2]) + 
					   ")";
			}
			case "parallel" : {
				return "(" + 
						outputCoordExp(exp.args[0]) + " | " + 
						outputCoordExp(exp.args[1]) + 
				        ")";
			}
			default : {
				alert("outputCoordExp: default case");
				return "";
			}
		}
	} catch ( e ) {
		alert("outputCoordExp " + e);
	}
}

function outputTrace (trace) {
	try {
		var s = "";
		while (trace != null) {
			var activity = trace.activity;
			var id = activity.args[0].id;
			trace = trace.next;
			//if (id != "skip") {
				if (trace == null) {
					s += id;
				} else {
					s += id + " , ";
				}
			//}
		}
		return s;
	} catch ( e ) {
		alert("outputTrace " + e);
	}
}