function createModel () {
	try {
		createRoles();
		createDocuments();
		createFlows();
		createActivities();
		createDecisions();
		createGenericActivities();
		createResiduals();
	} catch ( e ) {
		alert("createModel " + e);
	}
}
function createRoles () {
	try {
		_glossary = [];
		_glossaryErrors = [];
		_roles = {};
		for (var i = 0; i < _phrases.length; i++) {
			var chunk = _phrases[i];
			if (chunk.type == "phrase" && !chunk.triggered) {
				var phrase = chunk.value;
				var match = matchRules(phrase, "role");
				if (match) {
					chunk.triggered = true;
					chunk.ruleClass = "role";
					createRole(match);
				}
			}
		}		
	} catch ( e ) {
		alert("createRoles " + e);
	}
}

function createRole (match) {
	try {
		var matchTable = match.matchTable;
		var roleId = matchTable[0].id; 
		var voice = findInGlossary(roleId);
		if (voice) {
			var voiceName = voice.name;
			var message = localizeMessage("Duplicated role definition") + " " + upperCaseFirstChar(voiceName);
			var error = {
				message : message
			}
			_glossaryErrors.push(error);
			return;
		}
		if (roleId == _documentLiteral || roleId == _roleLiteral) {
			var message = localizeMessage("Illegal role name") + ": " + upperCaseFirstChar(roleId);
			var error = {
				message : message
			}
			_glossaryErrors.push(error);
			return;
		}		
		var rolePieces = matchTable[0].pieces
		var model = match.rule.model;
		var subType = match.rule.subType;
		var name = outputSentence(rolePieces);
		var voice = {
			id      : roleId,
			kind    : "role",
			type    : "role",
			subType : subType,
			name    : name,
			participates : false,
			used    : false
		}
		if (subType == "collective") {
			var components = model.components;
			voice.components = [];
			for (var i = 0; i < components.length; i++) {
				var wordComponent = matchTable[components[i]];
				var roleId = wordComponent.id;
				var component = findInGlossary(roleId);
				var componentSubType = component.subType;
				if (componentSubType == "collective" || 
				    componentSubType == "juridical") {
					var componentName = component.name;
					var message = localizeMessage("Illegal collective role component") + ": " + upperCaseFirstChar(componentName);
					var error = {
						message : message
					}
					_glossaryErrors.push(error);
					return;
				}
				voice.components.push(component);
			}
		}
		_glossary.push(voice);
		_roles[voice.id] = voice;
	} catch ( e ) {
		alert("createRole " + e);	
	}
}

function createDocuments () {
	try {
		_documents = {};
		for (var i = 0; i < _phrases.length; i++) {
			var chunk = _phrases[i];
			if (chunk.type == "phrase" && !chunk.triggered) {
				var phrase = chunk.value;
				var match = matchRules(phrase, "document");
				if (match) {
					chunk.triggered = true;
					chunk.ruleClass = "document";
					createDocument(match);
				} 
			}
		}		
	} catch ( e ) {
		alert("createDocuments " + e);
	}
}

function createDocument (match) {
	try {
		var matchTable = match.matchTable;
		var docId = matchTable[0].id;
		var voice = findInGlossary (docId);
		if (voice) {
			var voiceName = voice.name;
			var message = localizeMessage("Duplicated document definition") + " " + upperCaseFirstChar(voiceName);
			var error = {
				message : message
			}
			_glossaryErrors.push(error);
			return;
		}
		if (docId == _documentLiteral || docId == _roleLiteral) {
			var message = localizeMessage("Illegal document name") + ": " + upperCaseFirstChar(docId);
			var error = {
				message : message
			}
			_glossaryErrors.push(error);
			return;
		}
		var docPieces = matchTable[0].pieces;
		var model = match.rule.model;
		var subType = match.rule.subType;
		var name = outputSentence(docPieces);
		var voice = {
			id      : docId,
			kind    : "document",
			type    : "document",
			subType : subType,
			name    : name,
			participates : false,
			used    : false
		}
		if (subType == "private") {
			var wordOwner = matchTable[model.owner];
			var roleId = wordOwner.id;
			var owner = findInGlossary(roleId);
			voice.owners = [owner];
		}
		_glossary.push(voice);
		_documents[docId] = voice;					
	} catch ( e ) {
		alert("createDocument " + e);	}
}

function createFlows () {
	try {
		var number = 0;
		_flows = {};
		for (var i = 0; i < _phrases.length; i++) {
			var chunk = _phrases[i];
			if (chunk.type == "phrase" && !chunk.triggered) {
				var phrase = chunk.value;
				var match = matchRules(phrase, "flow");
				if (match) {
					chunk.triggered = true;
					chunk.ruleClass = "flow";
                    var id = "F" + number;
                    chunk.ruleCode = id;
                    var flowDef = createFlow(match, id);
					_flows[id] = flowDef;
					number++;
				}
			}
		}
	} catch ( e ) {
		alert("createFlows " + e);
	}
}

function createFlow (match, id) {
	try {
		var phrase = match.phrase;
		var model = match.rule.model;
		var matchTable = match.matchTable;
        var aDocument = matchTable[model.aDocument];
        var sender = matchTable[model.sender];
		if ("receiver" in model) {
			var receiver = matchTable[model.receiver];
			var flowDef = {
				type     : "flow",
				id       : id,
				phrase	 : phrase,			
				sender   : sender,
				receiver : receiver,  
				doc      : aDocument,
				errors   : {}
			}
			sender.participates = true;
			propagateParticipation(sender);
			receiver.participates = true;
			propagateParticipation(receiver);
			aDocument.participates = true;
			return flowDef;
		}
		if ("receivers" in model) {
			var receivers = [];
			for (var i = 0; i < model.receivers.length; i++) {
				receivers[i] = matchTable[model.receivers[i]];
			}
			var flowDef = {
				type      : "flow",
				id        : id,
				phrase	  : phrase,			
				sender    : sender,
				receivers : receivers,  
				doc       : aDocument,
				errors   : {}
			}
			sender.participates = true;
			propagateParticipation(sender);
			for (var i = 0; i < receivers.length; i++) {
				var receiver = receivers[i];
				receiver.participates = true;
				propagateParticipation(receiver);
			}
			aDocument.participates = true;
			return flowDef;
		}
	} catch ( e ) {
		alert("createFlow " + e);	}
}

function propagateParticipation (role) {
	try {
		if (role.subType == "collective") {
			var components = role.components;
			for (var i = 0; i < components.length; i++) {
				var component = components[i];
				component.participates = true;
			}
		}
	} catch ( e ) {
		alert("propagateParticipation " + e);	}
}
		
function createActivities () {
	try {
		var number = 0;
		_activities = {};
		for (var i = 0; i < _phrases.length; i++) {
			var chunk = _phrases[i];
			if (chunk.type == "phrase" && !chunk.triggered) {
				var phrase = chunk.value;
				var match = matchRules(phrase, "activity");
				if (match) {
					chunk.triggered = true;
					chunk.ruleClass = "activity";
                    var id = "A" + number;
                    chunk.ruleCode = id;
                    var activityDef = createActivity(match, id);
					_activities[id] = activityDef;
					number++;
				}
			}
		}
	} catch ( e ) {
		alert("createActivities " + e);
	}
}

function createActivity (match, id) {
	try {
		var phrase = match.phrase;
		var model = match.rule.model;
		var matchTable = match.matchTable;
        var role = matchTable[model.role];
        var inputs = [];
		for (var j = 0; j < model.inList.length; j++) {
			var aIn = model.inList[j];
            var aDocument = matchTable[aIn];
            inputs.push(aDocument);
			aDocument.participates = true;
		}
        var outputs = [];
		for (var j = 0; j < model.outList.length; j++) {
			var aOut = model.outList[j];
            var aDocument = matchTable[aOut];
            outputs.push(aDocument);
			aDocument.participates = true;
		}
        var activityDef = {
            type      : "activity",
            id        : id,
            phrase    : phrase,
            role      : role,
            input     : inputs,
            output    : outputs,
            inputc    : [],
			errors    : {}
        }
		role.participates = true;
		propagateParticipation(role);
        return activityDef;
	} catch ( e ) {
		alert("createActivity " + e);	}
}

function createDecisions () {
	try {
		var number = 0;
		_decisions = {};
		for (var i = 0; i < _phrases.length; i++) {
			var chunk = _phrases[i];
			if (chunk.type == "phrase" && !chunk.triggered) {
				var phrase = chunk.value;
				var match = matchRules(phrase, "decision");
				if (match) {
					chunk.triggered = true;
					chunk.ruleClass = "decision";
                    var id = "AD" + number;
                    chunk.ruleCode = id;
                    var decisionDef = createDecision(match, id);
					_decisions[id] = decisionDef;
					number++;
				}
			}
		}
	} catch ( e ) {
		alert("createDecisions " + e);
	}
}

function createDecision (match, id) {
	try {
		var model = match.rule.model;
		var matchTable = match.matchTable;
		var phrase = match.phrase;
		var role = matchTable[model.role];
        var inputs = [];
		for (var j = 0; j < model.inList.length; j++) {
			var aIn = model.inList[j];
            var aDocument = matchTable[aIn];
            inputs.push(aDocument);
			aDocument.participates = true;
		}
        var outputs = [];
		for (var j = 0; j < model.outList.length; j++) {
			var aOut = model.outList[j];
			var aDocument = matchTable[aOut];
            outputs.push(aDocument);
			aDocument.participates = true;
		}
        var inputcs = [];
		for (var j = 0; j < model.condList.length; j++) {
			var aCond = model.condList[j];
			var aDocument = matchTable[aCond];
            inputcs.push(aDocument);
			aDocument.participates = true;
		}
        var decisionDef = {
            type      : "decision",
            id        : id,
            phrase	  : phrase,
            role      : role,
            input     : inputs,
            output    : outputs,
            inputc    : inputcs,
			errors    : {}
        }
		role.participates = true;
		propagateParticipation(role);
        return decisionDef;
	} catch ( e ) {
		alert("createDecision " + e);	
	}
}

function createGenericActivities () {
	try {
		_genericActivities = {};
		var number = 0;
		for (var i = 0; i < _phrases.length; i++) {
			var chunk = _phrases[i];
			if (chunk.type == "phrase" && !chunk.triggered) {
				var phrase = chunk.value;
				var match = matchRules(phrase, "genericActivity");
				if (match) {
					chunk.triggered = true;
					chunk.ruleClass = "genericActivity";
                    var id = "AG" + number;
                    chunk.ruleCode = id;
                    var genericActivityDef = createGenericActivity(match, id);
					_genericActivities[id] = genericActivityDef;
					number++;
				}
			}
		}
	} catch ( e ) {
		alert("createGenericActivities " + e);
	}
}

function createGenericActivity (match, id) {
	try {
		var phrase = match.phrase;
		var model = match.rule.model;
		var matchTable = match.matchTable;
        var role = matchTable[model.role];
        var genericActivityDef = {
            type      : "genericActivity",
            id        : id,
            phrase    : phrase,
            action    : null,
            role      : role,
            input     : [],
            output    : [],
            inputc    : [],
			errors    : {}
        }
		role.participates = true;
		propagateParticipation(role);
        return genericActivityDef;
	} catch ( e ) {
		alert("createGenericActivity " + e);	}
}


function createResiduals () {
	try {
		_residuals = {};
		var number = 0;
		for (var i = 0; i < _phrases.length; i++) {
			var chunk = _phrases[i];
			if (chunk.type == "phrase" && !chunk.triggered) {
				var phrase = chunk.value;
				var match = {
						phrase     : phrase,
						score      : 0,
						fired      : false,
						rule       : null,
						coverTable : [],
						matchTable : []
				}
				chunk.ruleClass = "residual"
				var id = "R" + number;
				chunk.ruleCode = id;
				var residualDef = createResidual(match, id);
				_residuals[id] = residualDef;
				number++;
			}
		}
	} catch ( e ) {
		alert("createResiduals " + e);
	}
}

function createResidual (match, id) {
	try {
		var phrase = match.phrase;
        var residualDef = {
            type      : "residual",
            id        : id,
            phrase    : phrase,
            action    : null,
            role      : null,
            input     : [],
            output    : [],
            inputc    : [],
			errors    : {}
        }
        return residualDef;
	} catch ( e ) {
		alert("createResidual " + e);	}
}