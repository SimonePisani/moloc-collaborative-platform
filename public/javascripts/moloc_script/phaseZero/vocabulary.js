function createBaseVocabulary () {
	try {
		for (var group in _wordGroups) {
			var words = _wordGroups[group].words;
			var syntax = _wordGroups[group].syntax;
			addToVocabulary(words, syntax);
		}
} catch ( e ) {
        alert("createBaseVocabulary " + e);
    }
}

function addToVocabulary (words, syntax) {
	try {
		for (var i = 0; i < words.length; i++) {
			var word = words[i];
			if (word in _baseVocabulary) {
				var voice = _baseVocabulary[word];
				if (voice.syntax != syntax) {
					alert("addToVocabulary: existing voice " + word + " with syntax " + voice.syntax + " instead of" + syntax);
				}
 			} else {
				var voice = {
					type : "word",
					syntax : syntax,
					id : word,
					pieces : [word]
				}
				_baseVocabulary[word] = voice;
			}
		}
	} catch ( e ) {
		alert("addToVocabulary " + e);
	}
}

function processVocabulary () {
	try {
		_articles = {};
		for (var wordId in _baseVocabulary) {
			var word = _baseVocabulary[wordId];
			if (word.syntax == "article") {
				_articles[wordId] = true;
			}
		}
	} catch ( e ) {
		alert("processVocabulary " + e);
	}
}

_baseVocabulary = {
	
  "," :
  {
    type   : "word",
    syntax : "comma",
    mode   : "",
    id     : ",",
    pieces : [","]
  },

  "." :
  {
    type   : "word",
    syntax : "dot",
    mode   : "",
    id     : ".",
    pieces : ["."]
  },

  ":" :
  {
    type   : "word",
    syntax : "colon",
    mode   : "",
    id     : ":",
    pieces : [":"]
  },

  ";" :
  {
    type   : "word",
    syntax : "semicolon",
    mode   : "",
    id     : ";",
    pieces : [";"]
  },

  "'" :
  {
    type   : "word",
    syntax : "apostrophe",
    mode   : "",
    id     : "'",
    pieces : ["'"]
  },
}