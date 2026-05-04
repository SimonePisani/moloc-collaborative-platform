function initLocal () {
    try {
        var itWords = {};
        var enWords = {};
        _localWords = {};
        _localWords["it"] = itWords;
        _localWords["en"] = enWords;
        
        itWords["is"]          = "è";
        itWords["are"]         = "sono";
        itWords["a"]           = "un";
		itWords["role"]        = "ruolo";
        itWords["word"]        = "parola";
        itWords["document"]    = "documento";
        itWords["public"]      = "pubblico";
		itWords["juridical"]   = "giuridico";
        itWords["generic"]     = "generico";
        itWords["noun"]        = "nome";
        itWords["article"]     = "articolo";
        itWords["verb"]        = "verbo presente";
        itWords["prep"]        = "preposizione";
        itWords["comma"]       = "virgola";
        itWords["dot"]         = "punto";
        itWords["colon"]       = "punto e virgola"
        itWords["semicolon"]   = "due punti";
        itWords["infVerb"]     = "verbo infinito";
        itWords["gerund"]      = "verbo gerundio";
		itWords["apostrophe"]  = "apostrofo";
		itWords["unknown"]     = "non definito";
		itWords["conjunction"] = "congiunzione";
		itWords["participle"]  = "participio";
		itWords["adjective"]   = "aggettivo";
		itWords["adverb"]      = "avverbio";
		
        var itMessages = {};
        var enMessages = {};
		_localMessages = {};
		_localMessages["it"] = itMessages;
		_localMessages["en"] = enMessages;
		itMessages["cannot use"]      	= "non può usare";
		itMessages["cannot send"]     	= "non può inviare";
		itMessages["cannot perform"] 	= "non può svolgere";
		itMessages["One error found"] 	= "Un errore rilevato";
		itMessages["errors found"]    	= "errori rilevati";
		itMessages["One trace"]       	= "Una traccia";
		itMessages["traces"]          	= "tracce";
		itMessages["in"]              	= "in";
		itMessages["Illegal role name"] = "Nome di ruolo non ammesso";
		itMessages["Juridical role"] 	= "Ruolo giuridico";
		itMessages["and ends with"] 	= "e termina con";
		itMessages["choice"] 			= "scelta";
		itMessages["parallel"] 			= "parallelo";
		itMessages["loop"] 				= "ciclo";
		itMessages["Missing decision"] 	= "Decisione mancante";
		itMessages["Syntax error"] 		= "Errore di sintassi";
		itMessages["Missing title"] 	= "Titolo mancante";
		itMessages["Decision not allowed"] 	= "Decisione non ammessa";
		itMessages["Illegal document name"] 	= "Nome di documento non ammesso";
		itMessages["Iteration begins with"] 	= "Iterazione inizia con";
		itMessages["errors found in traces"] 	= "errori rilevati nelle tracce";
		itMessages["One error found in traces"] = "Un errore rilevato nelle tracce";
		itMessages["Duplicated role definition"] 		= "Doppia definizione del ruolo";
		itMessages["Duplicated document definition"] 	= "Doppia definizione del documento";
		itMessages["Illegal collective role component"] = "Ruolo non ammesso come componente di ruolo collettivo";
		itMessages["Too many traces. Some are missing."] = "Troppe tracce. Alcune non sono state generate.";
	
		_isLiteral = _localWords[UI_LAN]["is"];
		_areLiteral = _localWords[UI_LAN]["are"];
		_aLiteral = _localWords[UI_LAN]["a"];
		_roleLiteral = _localWords[UI_LAN]["role"];
		_documentLiteral = _localWords[UI_LAN]["document"];
    } catch ( e ) {
        alert("initLocal " + e);
    }   
}

function localizeWord (word) {
    try {
		var localWord = _localWords[UI_LAN][word];
		if (localWord == undefined) {
			alert("localizeWord: " + word + " not in local");
		}
        return localWord;
    } catch ( e ) {
        alert("localizeWord " + e);
    }
}

function localizeMessage (message) {
    try {
		var localMessage = _localMessages[UI_LAN][message];
		if (localMessage == undefined) {
			alert("localizeMessage: " + message + " not in local");
		}
        return localMessage;
    } catch ( e ) {
        alert("localizeMessage " + e);
    }
}