var nodeModelText;
var nodeModelTitle;
var node_div_title;
var node_titolo_validatore;
// DOM nodes

var nodeTraces;
var nodeTraceSequences
var nodeTracesErrors;
var nodeCurrentTraceNumber;
var nodeTracesNumber;
//var nodeSelectTraceButton;
var nodePreviousTraceButton;
var nodeNextTraceButton;
var nodeSelectWrongTraces;


function initNodesGUI () {
	try {
		node_titolo_validatore = document.getElementById('titolo_validatore')
		node_div_title = document.getElementById('errors_div');
		nodeModelText = document.getElementById('model_text');
		nodeModelTitle = document.getElementById('model_title');
		nodeTraces = document.getElementById("traces");
		nodeTraceSequences = document.getElementById("traceSequences");
		nodeTracesErrors = document.getElementById("tracesErrors");
		nodeCurrentTraceNumber = document.getElementById("currentTraceNumber");
		nodeTracesNumber = document.getElementById("tracesNumber");
		//nodeSelectTraceButton = document.getElementById("selectTraceButton");
		//nodeSelectTraceButton.onclick = handlerCurrentTraceButton;
		nodePreviousTraceButton = document.getElementById("previousTraceButton");
		nodePreviousTraceButton.onclick = handlerPreviousTraceButton;
		nodeNextTraceButton = document.getElementById("nextTraceButton");
		nodeNextTraceButton.onclick = handlerNextTraceButton;
		nodeSelectWrongTraces = document.getElementById("selectWrongTraces");

	} catch ( e ) {
		alert("initNodesGUI " + e);
	}
}


function removeChildren (node) {
	try {
		while (node.childNodes.length > 0) {
			node.removeChild(node.firstChild);
		}
	} catch ( e ) {
		alert("removeChildren " + e);
	}
}
