function createTraces () {
	try {
		computeTraces();
		checkTraces();		
		checkCausality();
		listTracesErrors();
	} catch ( e ) {
		alert("computeTraces " + e);
	}
}		

// Tracce
// traces is an array of trace [t1, t2, ...]
// trace is a list of activity
// {
//    activity : activity,
//	  next     : trace
// }
//

function computeTraces () {
	try {
		var exp = _coordinationExpression.exp;
		_tooManyTraces = false;
		_traces = computeTracesRec(exp);
	} catch ( e ) {
		alert("computeTraces " + e);
	}
}
		
function computeTracesRec (exp) {
	try {
		switch (exp.type) {
			case "skip"  : {
                var skipDef = {
                    type      : "activity",
					id        : "skip",
					action    : null,
					role      : null,
					input     : [],
					output    : [],
					condition : null,
					inputc    : []                    
                }
				var activityDef = {
					type      : "activity",
                    args      : [skipDef]
				}
				var trace = {
					activity : activityDef,
					trace    : null
				}
				var traces = [trace];
				return traces;
			}
			case "simple" : {
				var trace = {
					activity : exp,
					trace    : null
				}
				var traces = [trace];
				return traces;
			}
			case "repeat"   : {
				var splittedTrace = splitRepeat(exp.args[0]);
				if (splittedTrace) {
					var headExp = splittedTrace[0];
					var choiceExp = splittedTrace[1];
					if (choiceExp.type != "choice") {
						return computeTracesRec(exp.args[0]);
					}
					var traces0 = computeTracesRec(choiceExp.args[0]);
					var traces1 = computeTracesRec(choiceExp.args[1]);
					var traces2 = computeTracesRec(choiceExp.args[2]);
					var traces01 = crossTraces(traces0, traces1);
					var traces02 = crossTraces(traces0, traces2);
					if (headExp) {
						var tracesHead = computeTracesRec(headExp);
						var tracesHead_01 = crossTraces(tracesHead, traces01);
						var tracesHead_02 = crossTraces(tracesHead, traces02);
						var tracesHead_02_Head_01 = crossTraces(tracesHead_02, tracesHead_01);
						return joinTraces(tracesHead_01, tracesHead_02_Head_01);
					} else {						
						var traces01_02 = crossTraces(traces01, traces02);
						return joinTraces(traces01, traces01_02);
					}
				} else {
					return computeTracesRec(exp.args[0]);
				}
			}
			case "sequence" : {
				var traces0 = computeTracesRec(exp.args[0]);
				var traces1 = computeTracesRec(exp.args[1]);
                return crossTraces(traces0, traces1);
			}
			case "choice" : {
				var traces0 = computeTracesRec(exp.args[0]);
				var traces1 = computeTracesRec(exp.args[1]);
				var traces2 = computeTracesRec(exp.args[2]);
				var traces01 = crossTraces(traces0, traces1);
				var traces02 = crossTraces(traces0, traces2);
				return joinTraces(traces01, traces02);
			}
			case "parallel" : {
				var traces1 = computeTracesRec(exp.args[0]);
				var traces2 = computeTracesRec(exp.args[1]);
				return interleaveTracesTraces(traces1, traces2);
			}
		}
	} catch ( e ) {
		alert("computeTracesRec " + e);
	}
}

function splitRepeat (exp) {
	try {
		var type = exp.type;
		switch (exp.type) {
			case "skip" :
			case "simple" :
			case "repeat" :
			case "parallel" : {
				return null;
			}
			case "choice" : {
				var splittedExp = [
					null,
					exp
				]
				return splittedExp;
			}
			case "sequence" : {
				if (exp.args[1].type == "choice") {
					var splittedExp = [
						exp.args[0],
						exp.args[1]
					]
					return splittedExp;
				} else {
					var clonedExp = cloneExp(exp);
					var beforeHeadExp = clonedExp;
					var headExp = clonedExp.args[1];
					while (headExp.type == "sequence" && headExp.args[1] == "sequence") {
						headExp = headExp.args[1];
					}
					beforeHeadExp.args[1] = headExp.args[0];
					var splittedExp = [
						clonedExp,
						headExp.args[1]
					]
					return splittedExp;
				}
			}
		}
	} catch ( e ) {
		alert("splitRepeat " + e);
	}
}

function crossTraces (traces1, traces2) {
	try {
		var traces = [];
		for (var i = 0; i < traces1.length; i++) {
			var trace1 = traces1[i];
			if (trace1 == null) {
				var traces2Copy = copyTraces(traces2);
				for (var j = 0; j < traces2Copy.length; j++) {
					var trace2Copy = traces2Copy[j];
					traces.push(trace2Copy);
				}
			} else {
				var traces2Copy = copyTraces(traces2);
				for (var j = 0; j < traces2Copy.length; j++) {
					var trace2Copy = traces2Copy[j];				
					var trace1Copy = copyTrace(trace1);
					var lastElement = trace1Copy;
					while (lastElement.next != null) {
						lastElement = lastElement.next;
					}
					lastElement.next = trace2Copy;
					traces.push(trace1Copy);
				}
			}
		}
		return traces;
	} catch ( e ) {
		alert("crossTraces " + e);
	}
}

function copyTraces (traces) {
	try {
		var newTraces = [];
		for (var i =0; i < traces.length; i++) {
			var trace = traces[i];
			newTraces.push(copyTrace(trace));
		}
		return newTraces;
	} catch ( e ) {
		alert("copyTraces " + e);
	}
}

function copyTrace (trace) {
	try {
		if (trace == null) {
			return null;
		} else return {
			activity : trace.activity,
			next     : copyTrace(trace.next)
		}
	} catch ( e ) {
		alert("copyTrace " + e);
	}
}

function joinTraces (traces1, traces2) {
	try {
		var traces = [];
		for (var i = 0; i < traces1.length; i++) {
			var trace = traces1[i];
			traces.push(trace);
		}
		for (var i = 0; i < traces2.length; i++) {
			var trace = traces2[i];
			traces.push(trace);
		}
		return traces;
	} catch ( e ) {
		alert("joinTraces " + e);
	}
}

function interleaveTracesTraces (traces1, traces2) {
	try {
		var newTraces = [];
		for (var i = 0; i < traces1.length; i++) {
			var trace = traces1[i];
			appendTraces(newTraces, interleaveTraceTraces(trace, traces2));
		}
		return newTraces;
	} catch ( e ) {
		alert("interleaveTracesTraces " + e);
	}
}

function interleaveTraceTraces (trace1, traces2) {
	try {
		var newTraces = [];
		for (var i = 0; i < traces2.length; i++) {
			var trace = traces2[i];
			appendTraces(newTraces, interleaveTraceTrace(trace1, trace));
		}
		return newTraces;
	} catch ( e ) {
		alert("interleaveTraceTraces " + e);
	}
}

function appendTraces (traces1, traces2) {
	try {
		for (var i = 0; i < traces2.length; i++) {
			var trace = traces2[i];
			traces1.push(trace);
		}
	} catch ( e ) {
		alert("appendTraces " + e);
	}
}

function traceLength (trace) {
	try {
		var length = 0;
		while(trace != null) {
			length++;
			trace = trace.next;
		}
		return length;
	} catch ( e ) {
		alert("traceLength " + e);
	}
}
	
function interleaveTraceTrace (trace1, trace2) {
	try {
		if (traceLength(trace1) > MAX_TRACE_LENGTH || traceLength(traces2) > MAX_TRACE_LENGTH) {
			_tooManyTraces = true; 
			return [null];
		}
		if (trace1 == null && trace2 == null) {
			return [null];
		}
		if (trace1 != null && trace2 == null) {
			return [trace1];
		}
		if (trace1 == null && trace2 != null) {
			return [trace2];
		}
		if (trace1 != null && trace2 != null) {
			var traces1 = interleaveTraceTrace(trace1.next, trace2);
			addActivity(traces1, trace1.activity);
			var traces2 = interleaveTraceTrace(trace1, trace2.next);
			addActivity(traces2, trace2.activity);
			return joinTraces(traces1, traces2);
		}
	} catch ( e ) {
		alert("interleaveTraceTrace " + e);
	}
}

function addActivity (traces, activity) {
	try {
		for (var i = 0; i < traces.length; i++) {
			var trace = traces[i];
			var newTrace = {
				activity : activity,
				next     : trace
			}
			traces[i] = newTrace;
		}
	} catch ( e ) {
		alert("addActivity " + e);
	}
}

function checkTraces () {
	try {		
		for (var i = 0; i < _traces.length; i++) {
			var trace = _traces[i];
			checkTrace(trace);
		}
	} catch ( e ) {
		alert("checkTraces " + e);
	}
}

function checkTrace (trace) {
	try {
		var workspaces = {};
		for (var roleId in _roles) {
			workspaces[roleId] = {};
		}
		var participants = {};
		for (var roleId in _roles) {
			participants[roleId] = false;
		}
		
		addPublicDocuments(workspaces);
		addPrivateDocuments(workspaces);
		
		var headOfTrace = trace;
		headOfTrace.errors = [];
		while (trace != null) {
			var activity = trace.activity.args[0];
			if ((activity.type == "activity" && activity.id != "skip") || 
			     activity.type == "decision" || 
				 activity.type == "genericActivity") {
				var role = activity.role;
				var roleId = role.id;
				participants[roleId] = true;
				var errors = [];
				if (role.subType == "juridical") {
					var message = upperCaseFirstChar(role.name + " " + 
													localizeMessage("cannot perform") + " " + 
													activity.id);
					var error = {
						role     : role,
						type     : activity.type,
						activity : activity,
						message  : message
					}
					headOfTrace.errors.push(error);
					addSemanticError(activity, JURIDICAL_LOCK, roleId, null, error);
				}
				var b1 = checkInputDocs(role, activity.input, workspaces, errors);
				var b2 = checkInputDocs(role, activity.inputc, workspaces, errors)
				if (b1 && b2) {
					for (var i = 0; i < activity.output.length; i++) {
						var doc = activity.output[i];
						var workspace = workspaces[roleId];
						workspace[doc.id] = true;
					}
					if (role.subType == "collective") {
						var components = role.components;
						for (var i = 0; i < components.length; i++) {
							var component = components[i];
							var componentId = component.id;
							for (var j = 0; j < activity.output.length; j++) {
								var doc = activity.output[j];
								var workspace = workspaces[componentId];
								workspace[doc.id] = true;
							}	
						}
					}
				} else {
					for (var i = 0; i < errors.length; i++) {
						var error = errors[i];
						error.type = activity.type;
						error.activity = activity;
						var message = upperCaseFirstChar(error.role.name + " " + 
														 localizeMessage("cannot use") + " " + 
														 error.doc.name + " " + 
														 localizeMessage("in") + " " + 
														 error.activity.id);
						error.message = message;
						headOfTrace.errors.push(error);
						addSemanticError(activity, LACK_DOCUMENT, error.role.id, error.doc.id, error);
					}
				}
			}
			if (activity.type == "flow") {
				var errors = [];
				participants[activity.sender.id] = true;
				if ("receiver" in activity) {
					var receiver = activity.receiver;
					var receiverId = receiver.id;
					participants[receiverId] = true;
					if (receiver.subType == "collective") {
						var components = receiver.components;
						for (var i = 0; i < components.length; i++) {
							var component = components[i];
							var componentId = component.id;
							participants[componentId] = true;
						}
					}
				}
				if ("receivers" in activity) {
					var receivers = activity.receivers;
					for (var i = 0; i < receivers.length; i++) {
						var receiver = receivers[i];
						var receiverId = receiver.id;
						participants[receiverId] = true;
						if (receiver.subType == "collective") {
							var components = receiver.components;
							for (var j = 0; j < components.length; j++) {
								var component = components[j];
								var componentId = component.id;
								participants[componentId] = true;
							}
						}	
					}
				}
				if (checkInputDocs(activity.sender, [activity.doc], workspaces, errors)) {
					if ("receiver" in activity) {
						var receiver = activity.receiver;
						var receiverId = receiver.id;
						workspaces[receiverId][activity.doc.id] = true;
						if (receiver.subType == "collective") {
							var components = receiver.components;
							for (var i = 0; i < components.length; i++) {
								var component = components[i];
								var componentId = component.id;
								workspaces[componentId][activity.doc.id] = true;
							}
						}
					}
					if ("receivers" in activity) {
						var receivers = activity.receivers;
						for (var i = 0; i < receivers.length; i++) {
							var receiver = receivers[i];
							var receiverId = receiver.id;
							workspaces[receiverId][activity.doc.id] = true;
							if (receiver.subType == "collective") {
							var components = receiver.components;
								for (var j = 0; j < components.length; j++) {
									var component = components[j];
									var componentId = component.id;
									workspaces[componentId][activity.doc.id] = true;
								}
							}
						}
					}
				} else {
					for (var i = 0; i < errors.length; i++) {
						var error = errors[i];
						error.type = "flow";
						error.flow = activity;
						var message = upperCaseFirstChar(error.role.name + " " + 
														 localizeMessage("cannot send") + " " + 
														 error.doc.name + " " + 
														 localizeMessage("in") + " " + 
														 error.flow.id);
						error.message = message;
						headOfTrace.errors.push(error);
						addSemanticError(activity, LACK_DOCUMENT, error.role.id, error.doc.id, error);
					}
				}
			}
			trace = trace.next;
		}
		headOfTrace.workspaces = workspaces;
		headOfTrace.participants = participants;
	} catch ( e ) {
		alert("checkTrace " + e);
	}
}

function listTracesErrors () {
	try {
		_tracesErrors = [];
		if (_tooManyTraces) {
			var message = localizeMessage("Too many traces. Some are missing.") + ". ";
			var error = {
				message : message
			}
			_tracesErrors.push(error);
		}
		for (var activityId in _activities) {
			var activity = _activities[activityId];
			var errors = activity.errors;
			for (var errorId in errors) {
				var error = errors[errorId];
				_tracesErrors.push(error);
			}
		}
		for (var decisionId in _decisions) {
			var decision = _decisions[decisionId];
			var errors = decision.errors;
			for (var errorId in errors) {
				var error = errors[errorId];
				_tracesErrors.push(error);
			}
		}
		for (var flowId in _flows) {
			var flow = _flows[flowId];
			var errors = flow.errors;
			for (var errorId in errors) {
				var error = errors[errorId];
				_tracesErrors.push(error);
			}
		}
		for (var genericActivityId in _genericActivities) {
			var genericActivity = _genericActivities[genericActivityId];
			var errors = genericActivity.errors;
			for (var errorId in errors) {
				var error = errors[errorId];
				_tracesErrors.push(error);
			}
		}
		for (var residualId in _residuals) {
			var residual = _residuals[residualId];
			var errors = residual.errors;
			for (var errorId in errors) {
				var error = errors[errorId];
				_tracesErrors.push(error);
			}
		}
	} catch ( e ) {
		alert("listTracesErrors " + e);
	}
}

function checkInputDocs (role, docs, workspaces, errors) {
	try {
		if (docs.length == 0) {
			return true;
		}
		var workspace = workspaces[role.id];
		var i = 0;
		while (i < docs.length && docs[i].id in workspace) {
			i++;
		}
		if (i < docs.length) {
			var error = {
				role : role,
				doc  : docs[i]
			}
			errors.push(error);
			return false;
		} else {
			return true;
		}
	} catch ( e ) { 
		alert("checkInputDocs " + e);
	}
}

function checkCausality () {
	try {
		for (var i = 0; i < _traces.length; i++) {
			var trace = _traces[i];
			checkSingleCausality(trace);
		}
	} catch ( e ) {
		alert("checkCausality " + e);
	}
}

function checkSingleCausality (trace) {
	try {
		var activeRoles = {};
		var activeRolesEmpty = true;
		for (var roleId in _roles) {
			activeRoles[roleId] = false;
		}
		var headOfTrace = trace;
		headOfTrace.causalErrors = [];
		while (trace != null) {
			var activity = trace.activity.args[0];
			if (activity.type == "activity" || 
			    activity.type == "decision" ||
				activity.type == "genericActivity") {
				var role = activity.role;
				if (role) {
					var roleId = role.id;
					if (activeRolesEmpty) {
						activeRoles[roleId] = true;
						activeRolesEmpty = false;
					}
					if (role.subType == "collective") {
						var components = role.components;
						for (var i = 0; i < components.length; i++) {
							var component = components[i];
							var componentId = component.id;
							activeRoles[componentId] = true;
						}
					}
					if (!activeRoles[roleId]) {
						var error = {
							type     : activity.type,
							activity : activity,
							role     : roleId
						}
						var message = upperCaseFirstChar(role.name + " " + 
														localizeMessage("cannot perform") + " " + 
														activity.id);
						error.message = message;
						headOfTrace.causalErrors.push(error);
						addSemanticError(activity, MISSING_REASON, roleId, null, error);						
						activeRoles[roleId] = true;
					}
				} else {
					// skip
				}
			}
			if (activity.type == "flow") {
				var sender = activity.sender;
				var senderId = sender.id;
				if (activeRolesEmpty) {
					activeRoles[senderId] = true;
					activeRolesEmpty = false;
				}
				if (sender.subType == "collective") {
					var components = sender.components;
					for (var i = 0; i < components.length; i++) {
						var component = components[i];
						var componentId = component.id;
						activeRoles[componentId] = true;
					}
				}
				if (!activeRoles[senderId]) {
					var error = {
						type     : activity.type,
						activity : activity,
						role     : senderId
					}
					var message = upperCaseFirstChar(sender.name + " " + 
													 localizeMessage("cannot perform") + " " + 
													 activity.id);
					error.message = message;
					headOfTrace.causalErrors.push(error);
					addSemanticError(activity, MISSING_REASON, senderId, null, error);					
					activeRoles[senderId] = true;
				}
				if ("receiver" in activity) {
					var receiver = activity.receiver;
					activeRoles[receiver.id] = true;
					if (receiver.subType == "collective") {
						var components = receiver.components;
						for (var i = 0; i < components.length; i++) {
							var component = components[i];
							var componentId = component.id;
							activeRoles[componentId] = true;
						}
					}
				}
				if ("receivers" in activity) {
					var receivers = activity.receivers;
					for (var i = 0; i < receivers.length; i++) {
						var receiver = receivers[i];
						activeRoles[receiver.id] = true;
						if (receiver.subType == "collective") {
							var components = receiver.components;
							for (var j = 0; j < components.length; j++) {
								var component = components[j];
								var componentId = component.id;
								activeRoles[componentId] = true;
							}
						}
					}
				}
			}
			trace = trace.next;
		}
	} catch ( e ) {
		alert("checkSingleCausality " + e);
	}
}