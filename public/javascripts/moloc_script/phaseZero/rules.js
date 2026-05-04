function processRules () {
    try {
		preProcessRules();
        for (var i = 0; i < _rules.length; i++) {
			var rule = _rules[i];
			var pattern = rule.pattern;
			var ruleElements = [];
            for (var j = 0; j < pattern.length; j++) {
				var ruleElement = pattern[j];
                switch (ruleElement.type) {
                    case "word" : {
						if ("value" in ruleElement) { // value
							if (ruleElement.value in _baseVocabulary) {
								var voice = _baseVocabulary[ruleElement.value];
								if ("values" in ruleElement) {
									voice = cloneVoice(voice);
									var alternatives = [];
									for (var k = 0; k < ruleElement.values.length; k++) {
										if (ruleElement.values[k] in _baseVocabulary) {
											var alternativeVoice = _baseVocabulary[ruleElement.values[k]];
											alternatives.push(alternativeVoice);
										} else {
											alert("processRules: " + ruleElement.values[k] + " not in _baseVocabulary");
										}
									}
									voice.alternatives = alternatives;
								}
								ruleElements.push(voice);
							}  else {
								alert("processRules: " + ruleElement.value + " not in _baseVocabulary");
							}	
						} else if ("values" in ruleElement) { // values
							if (ruleElement.values[0] in _baseVocabulary) {
								var voice = _baseVocabulary[ruleElement.values[0]];
								voice = cloneVoice(voice);
								var alternatives = [];
								for (var k = 1; k < ruleElement.values.length; k++) {
									if (ruleElement.values[k] in _baseVocabulary) {
										var alternativeVoice = _baseVocabulary[ruleElement.values[k]];
										alternatives.push(alternativeVoice);
									} else {
										alert("processRules: " + ruleElement.values[k] + " not in _baseVocabulary");
									}
								}
								voice.alternatives = alternatives;
								ruleElements.push(voice);
							} else {
								alert("processRules: " + ruleElement.values[0] + " not in _baseVocabulary");
							}								
						} else {
							alert("processRules: value or values not present in ruleElement");
						}
                        break;
                    }
                    case "token" : {
						ruleElements.push(ruleElement);
                        break;
                    }
                }
            }
			rule.pattern = ruleElements;
			rule.output = outputPattern(ruleElements);
        }
    } catch ( e ) {
        alert("processRules " + e);
    }
}

function preProcessRules () {
	try {
		for (var i = 0; i < _rules.length; i++) {
			var rule = _rules[i];
			if ("schema" in rule) {
				var schema = rule.schema;
				var pattern = [];
				var j = 0;
				while (j < schema.length) {
					var currentChar = schema[j];
					j++;
					switch (currentChar) {
						case " " :
							break;
						case "$" :
							if (j == schema.length) {
								alert("preProcessRules: end of string after " + currentChar);
							} else {
								var afterChar = schema[j];
								j++;
								if (afterChar == "R") {
									var ruleElement = {
										type  : "token",
										kind  : "role"
									}
									pattern.push(ruleElement);
								} else if (afterChar == "D") {
									var ruleElement = {
										type  : "token",
										kind  : "document"
									}
									pattern.push(ruleElement);
								} else if (afterChar == "W") {
									var ruleElement = {
										type  : "token",
										kind  : "word"
									}
									pattern.push(ruleElement);
								} else {
									alert("preProcessRules: wrong char after $ " + afterChar);
								}
							}
							break;
						case "!" :
							var afterString = "";
							while (j < schema.length && schema[j] != " ") {
								var afterChar = schema[j];
								j++;
								afterString += afterChar;
							}
							var ruleElement =  {
								type   : "word",
								values : _wordGroups[afterString].words
							}
							pattern.push(ruleElement);
							break;
						default  :
							var afterString = currentChar;
							while (j < schema.length && schema[j] != " ") {
								var afterChar = schema[j];
								j++;
								afterString += afterChar;
							}
							var ruleElement =  {
								type  : "word",
								value : afterString
							}
							pattern.push(ruleElement);
							break;
					}
				}
				rule.pattern = pattern;
			}
		}
	} catch ( e ) {
        alert("preProcessRules " + e);
    }
}	 

function cloneVoice (voice) {
	try {
		var newVoice = {
			id		: voice.id,
			mode	: voice.mode,
			pieces	: voice.pieces,
			syntax	: voice.syntax,
			type	: voice.type
		}
		return newVoice;
    } catch ( e ) {
        alert("cloneVoice " + e);
    }
}

_wordGroups = {
    articles            : {
							words  : ["il", "Il", "la", "La", "lo", "Lo", "l'", "L'", "i", "I", "gli", "Gli", "le", "Le"],
							syntax : "article"
						  },
    indetArticles       : {
							words  : ["un", "Un", "uno", "Uno", "un'", "Un'", "una", "Una"],
							syntax : "article"
						  },
    prepositionOf       : {
							words  : ["di", "Di", "del", "Del", "dello", "Dello", "della", "Della", 
						 	          "dell'", "Dell'", "dei", "Dei", "degli", "Degli", "delle", "Delle"],
							syntax : "prep"
						  },
    prepositionTo       : {
							words  : ["a", "A", "ad", "Ad", "al", "Al", "alla", "Alla", "allo", "Allo", 
							          "all'", "All'", "ai", "Ai", "agli", "Agli", "alle", "Alle"],
							syntax : "prep"
						  },
    prepositionFrom     : {
							words  : ["da", "Da", "dal", "Dal", "dallo", "Dallo", "dalla", "Dalla", 
							          "dall'", "Dall'", "dai", "Dai", "dagli", "Dagli", "dalle", "Dalle"],
							syntax : "prep"
						  },
    prepositionIn       : {
							words  : ["in", "In", "nel", "Nel", "nello", "Nello", "nella", "Nella",
							          "nei", "Nei", "negli", "Negli", "nelle", "Nelle"],
							syntax : "prep"
						  },
    prepositionWith     : {
							words  : ["con", "Con", "col", "Col", "colla", "Colla", "coll'", "Coll'",
							          "coi", "Coi", "cogli", "Cogli", "colle", "Colle"],
							syntax : "prep"
						  },
    prepositionOn       : {
							words  : ["su", "Su", "sul", "Sul", "sullo", "Sullo", "sull'", "Sull'", 
							          "sulla", "Sulla", "sui", "Sui", "sugli", "Sugli", "sulle", "Sulle"],
							syntax : "prep"
						  },
    prepositionFor      : {
							words  : ["per", "Per"],
							syntax : "prep"
						  },
    prepositionBetween  : {
							words  : ["fra", "Fra", "tra", "Tra"],
							syntax : "prep"
						  },
    conjunctions        : {
							words  : ["e"],
							syntax : "conjunction"
						  },
    nouns 			    : {
							words  : ["documento", "ruolo", "base"],
							syntax : "noun"
						  },
    adjectives		    : {
							words  : ["pubblico", "giuridico"],
							syntax : "adjective"
						  },
    isAreVerbs          : {
							words  : ["è", "sono"],
							syntax : "verb"
						  },
    readingVerbs        : {
							words  : ["sottoscrive", "sottoscrivono", "pubblica", "pubblicano", "timbra", "timbrano", 
							          "firma", "firmano", "registra", "registrano", "legge", "leggono", "studia", "studiano"],
							syntax : "verb"
						  },
    creationVerbs       : {
							words  : ["compila", "compilano", "redige", "redigono", "scrive", "scrivono", "produce", "producono", 
						              "sviluppa", "sviluppano", "progetta", "progettano", "realizza", "realizzano", 
						              "definisce", "definiscono", "struttura", "strutturano"],
							syntax : "verb"
						  },
	creationVerbs1      : {
							words  : ["traduce", "traducono", "trasforma", "trasformano"],
							syntax : "verb"
						  },
	creationVerbs2      : {
							words  : ["conserva", "conservano", "archivia", "archiviano"],
							syntax : "verb"
						  },
    updatingVerbs       : {
							words  : ["cambia", "cambiano", "modifica", "modificano", "aggiorna", "aggiornano", 
						              "revisiona", "revisionano", "corregge", "correggono", "trascrive", "trascrivono"],
							syntax : "verb"
						  },
    updatingVerbsSub    : {
							words  : ["cambia", "cambiano", "modifica", "modificano", "aggiorna", "aggiornano", 
						              "revisiona", "revisionano", "corregge", "correggono"],
							syntax : "verb"
						  },
    conditionVerbs      : {
							words  : ["verifica", "verificano", "analizza", "analizzano", "valuta", "valutano", 
							          "esamina", "esaminano", "controlla", "controllano"],
							syntax : "verb"
						  },
    comparisonVerbs     : {
							words  : ["confronta", "confrontano", "compara", "comparano"],
							syntax : "verb"
						  },
    flowOutVerbs        : {
							words  : ["invia", "inviano", "consegna" , "consegnano", "notifica", "notificano",
							          "manda", "mandano", "comunica", "comunicano", "trasmette", "trasmettono"],
							syntax : "verb"
						  },
    flowInVerbs         : {
							words  : ["riceve", "ricevono"],
							syntax : "verb"
						  },
    infinitiveVerbs     : {
							words  : ["accettare", "approvare"],
							syntax : "verb"
						  },
    infinitiveVerbsP    : {
							words  : ["approvarlo", "approvarla", "approvarli", "approvarle", 
							          "accettarlo", "accettarla", "accettarli", "accettarle"],
							syntax : "verb" 
						  },
    managementVerbs    : {
							words  : ["nomina", "nominano", "incarica", "incaricano"],
							syntax : "verb"
						  },
    gerunds             : {
							words  : ["usando", "secondo", "analizzando", "esaminando", "scrutinando"],
							syntax : "gerund"
						  },
    gerundsP			: {
							words  : ["basandosi"],
							syntax : "gerund"
						  },
    participles         : {
							words  : ["formato"],
							syntax : "participle"
						  }
}

_rules = [
 {
     type    :	"role",
	 subType :  "collective",
	 name	 :  "rule1",
	 schema  :  "!articles $W !isAreVerbs un ruolo formato da $R $R $R $R $R",
     model   :  {
                     id : 0,
					 components : [1, 2, 3, 4, 5]
                }
 },
 {
     type    :	"role",
	 subType :  "collective",
	 name	 :  "rule2",
	 schema  :  "!articles $W !isAreVerbs un ruolo formato da $R $R $R $R",
     model   :  {
                     id : 0,
					 components :[1, 2, 3, 4]
                }
 },
 {
     type    :	"role",
	 subType :  "collective",
	 name	 :  "rule3",
	 schema  :  "!articles $W !isAreVerbs un ruolo formato da $R $R $R",
     model   :  {
                     id : 0,
					 components :[1, 2, 3]
                }
 },
 {
     type    :	"role",
	 subType :  "collective",
	 name	 :  "rule4",
	 schema  :  "!articles $W !isAreVerbs un ruolo formato da $R $R",
     model   :  {
                     id : 0,
					 components :[1, 2]
                }
 },
 {
     type    :	"role",
	 subType :  "collective",
	 name	 :  "rule5",
	 schema  :  "!articles $W !isAreVerbs un ruolo formato da $R",
     model   :  {
                     id : 0,
					 components :[1]
                }
 },
 {
     type    :	"role",
	 subType :  "juridical",
	 name	 :  "rule6",
	 schema  :  "!articles $W !isAreVerbs un ruolo giuridico",
     model   :  {
                     id : 0
                }
 },
 {
     type    :	"role",
	 subType :  "individual",
	 name	 :  "rule7",
	 schema  :  "!articles $W !isAreVerbs un ruolo",
     model   :  {
                     id : 0
                }
 },
 {
     type    :	"document",
	 subType :  "public",
	 name	 :  "rule8",
	 schema  :  "!articles $W !isAreVerbs un documento pubblico",
     model   :  {
                     id : 0
                }
 },
 {
     type    :	"document",
	 subType :  "private",
	 name	 :  "rule9",
	 schema  :  "!articles $W !isAreVerbs un documento !prepositionOf $R",
     model   :  {
                     id : 0,
					 owner : 1
                }
 },
 {
     type    :	"document",
	 subType :  "generic",
	 name	 :  "rule10",
	 schema  :  "!articles $W !isAreVerbs un documento",
     model   :  {
                     id : 0
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule11",
	 schema  :  "$R !readingVerbs $D",
     model   :  {
                     role     : 0,
                     inList   : [1],
                     outList  : []
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule12",
	 schema  :  "$R !creationVerbs $D !gerunds $D $D",
     model   :  {
                     role     : 0,
                     inList   : [2, 3],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule13",
	 schema  :  "$R !creationVerbs $D !gerunds $D",
     model   :  {
                     role     : 0,
                     inList   : [2],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule14",
	 schema  :  "$R !creationVerbs $D in base !prepositionTo $D !prepositionTo $D",
     model   :  {
                     role     : 0,
                     inList   : [2, 3],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule15",
	 schema  :  "$R !creationVerbs $D in base !prepositionTo $D",
     model   :  {
                     role     : 0,
                     inList   : [2],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule16",
	 schema  :  "$R !creationVerbs $D basandosi !prepositionOn $D $D",
     model   :  {
                     role     : 0,
                     inList   : [2, 3],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule17",
	 schema  :  "$R !creationVerbs $D basandosi !prepositionOn $D",
     model   :  {
                     role     : 0,
                     inList   : [2],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule18",
	 schema  :  "$R !creationVerbs $D",
     model   :  {
                     role     : 0,
                     inList   : [],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule18a",
	 schema  :  "$R !creationVerbs1 $D !prepositionIn $D",
     model   :  {
                     role     : 0,
                     inList   : [1],
                     outList  : [2]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule18b",
	 schema  :  "$R !creationVerbs1 !prepositionIn $D $D",
     model   :  {
                     role     : 0,
                     inList   : [2],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule18c",
	 schema  :  "$R !creationVerbs2 $D",
     model   :  {
                     role     : 0,
                     inList   : [1],
                     outList  : []
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule19",
	 schema  :  "$R !updatingVerbs $D !gerunds $D $D",
     model   :  {
                     role     : 0,
                     inList   : [2, 3],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule20",
	 schema  :  "$R !updatingVerbs $D !gerunds $D",
     model   :  {
                     role     : 0,
                     inList   : [2],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule21",
	 schema  :  "$R !updatingVerbs $D in base !prepositionTo $D $D",
     model   :  {
                     role     : 0,
                     inList   : [2, 3],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule22",
	 schema  :  "$R !updatingVerbs $D in base !prepositionTo $D",
     model   :  {
                     role     : 0,
                     inList   : [2],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule23",
	 schema  :  "$R !updatingVerbs $D basandosi !prepositionOn $D $D",
     model   :  {
                     role     : 0,
                     inList   : [2, 3],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule24",
	 schema  :  "$R !updatingVerbs $D basandosi !prepositionOn $D",
     model   :  {
                     role     : 0,
                     inList   : [2],
                     outList  : [1]
                }
 },
 {
     type    :	"activity",
	 name	 :  "rule25",
	 schema  :  "$R !updatingVerbsSub $D",
     model   :  {
                     role     : 0,
                     inList   : [1],
                     outList  : [1]
                }
 },
 {
     type    :	"decision",
	 name	 :  "rule26",
	 schema  :  "$R !conditionVerbs $D $D !prepositionFor !infinitiveVerbs $D",
     model   :  {
                     role     : 0,
                     inList   : [1, 2],
                     outList  : [],
                     condList : [3]
                }
 },
 {
     type    :	"decision",
	 name	 :  "rule27",
	 schema  :  "$R !conditionVerbs $D !prepositionFor !infinitiveVerbs $D",
     model   :  {
                     role     : 0,
                     inList   : [1],
                     outList  : [],
                     condList : [2]
                }
 },
 {
     type    :	"decision",
	 name	 :  "rule28",
	 schema  :  "$R !conditionVerbs $D !prepositionFor !infinitiveVerbsP",
     model   :  {
                     role     : 0,
                     inList   : [1],
                     outList  : [],
                     condList : [1]
                }
 },
 {
     type    :	"decision",
	 name	 :  "rule29",
	 schema  :  "$R !comparisonVerbs $D !prepositionWith $D !prepositionFor !infinitiveVerbsP",
     model   :  {
                     role     : 0,
                     inList   : [1, 2],
                     outList  : [],
                     condList : [1]
                }
 },
 {
     type    :	"decision",
	 name	 :  "rule30",
	 schema  :  "$R !comparisonVerbs $D !prepositionWith $D !prepositionFor !infinitiveVerbs $D",
     model   :  {
                     role     : 0,
                     inList   : [1, 2],
                     outList  : [],
                     condList : [3]
                }
 },
 {
     type    :	"flow",
	 name	 :  "rule31",
	 schema  :  "$R !flowOutVerbs $D !prepositionTo $R !prepositionTo $R !prepositionTo $R",
     model   :  {
                  aDocument : 1,
                  sender    : 0,
				  receivers : [2, 3, 4]
                }
 },
 {
     type    :	"flow",
	 name	 :  "rule31a",
	 schema  :  "$R !flowOutVerbs $D !prepositionTo $R !prepositionTo $R",
     model   :  {
                  aDocument : 1,
                  sender    : 0,
				  receivers : [2, 3]
                }
 },
 {
     type    :	"flow",
	 name	 :  "rule32",
	 schema  :  "$R !flowOutVerbs $D !prepositionTo $R",
     model   :  {
                  aDocument : 1,
                  sender    : 0,
                  receiver  : 2
                }
 },
 {
	 type    :  "flow",
	 name	 :  "rule33",
	 schema  :  "$R !flowInVerbs $D !prepositionFrom $R",
     model   :  {
                  aDocument : 1,
                  sender    : 2,
                  receiver  : 0
                }
 },
 {
	 type    :  "flow",
	 name	 :  "rule34",
	 schema  :  "$R $R ricevono $D !prepositionFrom $R",
     model   :  {
                  aDocument : 2,
                  sender    : 3,
                  receivers : [0, 1]
                }
 },
 {
	 type    :  "genericActivity", // this rule must be labelled in another way. Model must be changed
	 name	 :  "rule35",
	 schema  :  "$R !managementVerbs $R",
     model   :  {
                  role : 0,
                }
 },
 {
	 type    :  "genericActivity",
	 name	 :  "rule36",
	 schema  :  "$R",
     model   :  {
                  role  : 0
                }
 }
]
