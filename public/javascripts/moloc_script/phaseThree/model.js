function showModel () {
	try {
		showModelActivities(_activities);
		showModelActivities(_decisions);
		showModelActivities(_genericActivities);
		showModelFlows(_flows);
	} catch ( e ) {
		alert("showModel " + e);
	}
}

function showModelActivities (activities) {
	try {
		var output = ""
		for (var id in activities) {
			var activity = activities[id];
			output += outputModelActivity(activity) + "\n";
		}
		nodeSystemLog.value += output;
	} catch ( e ) {
		alert("showModelActivities " + e);
	}
}

function outputModelActivity (activity) {
	try {
		var s = "";
		var activityId = activity.id;
		s += activityId + " ";
		var role = activity.role;
		var roleName = role.name;
		s += "[" + roleName + "] : ";
		var uniqueInput = {};
		var input = activity.input;
		for (var i = 0; i < input.length; i++) {
			var inputDoc = input[i];
			var inputDocId = inputDoc.id;
			var inputDocName = inputDoc.name;
			uniqueInput[inputDocId] = inputDocName;
		}
		var inputc = activity.inputc;
		for (var i = 0; i < inputc.length; i++) {
			var inputcDoc = input[i];
			var inputcDocId = inputcDoc.id;
			var inputcDocName = inputcDoc.name;
			uniqueInput[inputcDocId] = inputcDocName;
		}
		var uniqueInputSize = 0;
		for (var inputId in uniqueInput) {
			uniqueInputSize++;
		}
		s += "{";
		var i = 0;
		for (var inputId in uniqueInput) {
			var inputName = uniqueInput[inputId];
			if (i < uniqueInputSize - 1) {
				s += inputName + ", ";
			} else {
				s += inputName;
			}
			i++;
		}
		s += "} -> ";
		var output = activity.output;
		s += "{";
		for (var i = 0; i < output.length; i++) {
			var outputDoc = output[i];
			var outputDocName = outputDoc.name;
			if (i < output.length - 1) {
				s += outputDocName + ", ";
			} else {
				s += outputDocName;
			}
		}
		s += "}";
		return s;
	} catch ( e ) {
		alert("outputModelActivity " + e);
	}
}

function showModelFlows (flows) {
	try {
		var output = ""
		for (var id in flows) {
			var flow = flows[id];
			output += outputModelFlow(flow) + "\n";
		}
		nodeSystemLog.value += output;
	} catch ( e ) {
		alert("showModelFlows " + e);
	}
}

function outputModelFlow (flow) {
	try {
		var s = "";
		var flowId = flow.id;
		s += flowId + " ";
		var doc = flow.doc;
		var docName = doc.name;
		s += "[" + docName + "] : "
		var sender = flow.sender;
		var senderName = sender.name;
		s += "{" + senderName + "} -> ";
		if ("receiver" in flow) {
			var receiver = flow.receiver;
			var receiverName = receiver.name;
			s += "{" + receiverName + "}";
		}
		if ("receivers" in flow) {
			var receivers = flow.receivers;
			s += "{";
			for (var i = 0; i < receivers.length; i++) {
				var receiver = receivers[i];
				var receiverName = receiver.name;
				if (i < receivers.length - 1) {
					s += receiverName + ", ";
				} else {
					s += receiverName;
				}
			}
			s += "}";
		}
		return s;
	} catch ( e ) {
		alert("outputModelFlow " + e);
	}
}
