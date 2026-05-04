function show() {
  try {
    showRoles();
    showDocuments();
    showActivities();
    showGenericActivities();
    showDecisions();
    showFlows();
    showResiduals();
    showCoordinationExpression();
    showWorkspaces();
    showTraces();
    showRules();
    showErrors();
  } catch (e) {
    alert("show " + e);
  }
}

function showRawText() {
  try {
    nodeRawText.value = _rawText;
  } catch (e) {
    alert("showRawText " + e);
  }
}

function showTitle() {
  try {
    var newTitle;
    if (_title.length > 0) {
      newTitle = upperCaseFirstChar(_title);
    } else {
      newTitle = localizeMessage("Missing title");
    }
    var textNode = document.createTextNode(newTitle);
    nodeTitle.appendChild(textNode);
  } catch (e) {
    alert("showTitle " + e);
  }
}

function showRoles() {
  try {
    for (var id in _roles) {
      var role = _roles[id];
      var roleText = outputRole(role);
      var nodeLi = document.createElement("li");
      var nodeText = document.createTextNode(roleText);
      var nodeSpan = document.createElement("span");
      if (!role.participates) {
        nodeSpan.setAttribute("class", "textRed");
      }
      nodeSpan.appendChild(nodeText);
      nodeLi.appendChild(nodeSpan);
      nodeRoles.appendChild(nodeLi);
    }
  } catch (e) {
    alert("showRoles " + e);
  }
}

function showDocuments() {
  try {
    for (var id in _documents) {
      var doc = _documents[id];
      var documentText = outputDocument(doc);
      var nodeLi = document.createElement("li");
      var nodeText = document.createTextNode(documentText);
      var nodeSpan = document.createElement("span");
      if (!doc.participates) {
        nodeSpan.setAttribute("class", "textRed");
      }
      nodeSpan.appendChild(nodeText);
      nodeLi.appendChild(nodeSpan);
      nodeDocuments.appendChild(nodeLi);
    }
  } catch (e) {
    alert("showDocuments " + e);
  }
}

function showActivities() {
  try {
    nodeSystemLog.value="";
    for (var id in _activities) {
      var activity = _activities[id];
      var phrase = activity.phrase;
      var nodeLi = document.createElement("li");
      showPhrase(phrase, nodeLi);
      var nodeText = document.createTextNode("(" + id + ")");
      nodeLi.appendChild(nodeText);
      nodeActivities.appendChild(nodeLi);
    }
  } catch (e) {
    alert("showActivities " + e);
  }
}

function showGenericActivities() {
  try {
    for (var id in _genericActivities) {
      var activity = _genericActivities[id];
      var phrase = activity.phrase;
      var nodeLi = document.createElement("li");
      showPhrase(phrase, nodeLi);
      var nodeText = document.createTextNode("(" + id + ")");
      nodeLi.appendChild(nodeText);
      nodeGenericActivities.appendChild(nodeLi);
    }
  } catch (e) {
    alert("showGenericActivities " + e);
  }
}

function showDecisions() {
  try {
    for (var id in _decisions) {
      var decision = _decisions[id];
      var phrase = decision.phrase;
      var nodeLi = document.createElement("li");
      showPhrase(phrase, nodeLi);
      var nodeText = document.createTextNode("(" + id + ")");
      nodeLi.appendChild(nodeText);
      nodeDecisions.appendChild(nodeLi);
    }
  } catch (e) {
    alert("showDecisions " + e);
  }
}

function showFlows() {
  try {
    for (var id in _flows) {
      var flow = _flows[id];
      var phrase = flow.phrase;
      var nodeLi = document.createElement("li");
      showPhrase(phrase, nodeLi);
      var nodeText = document.createTextNode("(" + id + ")");
      nodeLi.appendChild(nodeText);
      nodeFlows.appendChild(nodeLi);
    }
  } catch (e) {
    alert("showFlows " + e);
  }
}

function showResiduals() {
  try {
    for (var id in _residuals) {
      var residual = _residuals[id];
      var phrase = residual.phrase;
      var nodeLi = document.createElement("li");
      showPhrase(phrase, nodeLi);
      var nodeText = document.createTextNode("(" + id + ")");
      nodeLi.appendChild(nodeText);
      nodeResiduals.appendChild(nodeLi);
    }
  } catch (e) {
    alert("showResiduals " + e);
  }
}

function showPhrase(phrase, node) {
  try {
    for (var i = 0; i < phrase.length; i++) {
      var word = phrase[i];
      var syntax = word.syntax;
      var spanFatherNode = document.createElement("span");
      if ((i < phrase.length - 1) && phrase[i + 1].syntax == "comma") {
        spanFatherNode.innerHTML = outputPieces(word.pieces);
      } else {
        if (word.id[word.id.length - 1] == "'") {
          spanFatherNode.innerHTML = outputPieces(word.pieces);
        } else {
          spanFatherNode.innerHTML = outputPieces(word.pieces) + "&nbsp;";
        }
      }

      if (syntax != "unknown") {
        var spanSonNode = document.createElement("span");
        var textSonNode;
        if (word.kind != "none") {
          textSonNode = document.createTextNode(localizeWord(syntax) + ": " + localizeWord(word.kind));
        } else {
          textSonNode = document.createTextNode(localizeWord(syntax));
        }
        spanSonNode.appendChild(textSonNode);
        spanFatherNode.appendChild(spanSonNode);
        if (word.fired) {
          spanFatherNode.setAttribute("class", "tooltiptxt");
          spanSonNode.setAttribute("class", "tooltiptext");
        } else {
          spanFatherNode.setAttribute("class", "tooltipBlue");
          spanSonNode.setAttribute("class", "tooltiptextBlue");
        }
      } else {
        spanFatherNode.setAttribute("class", "textRed");
      }

      node.appendChild(spanFatherNode);
    }
  } catch (e) {
    alert("showPhrase " + e);
  }
}

function showCoordinationExpression() {
  try {
    if (_coordinationExpression.error) {
      nodeSystemLog.value += _coordinationExpression.code + "\n";
      nodeSystemLog.value += _coordinationExpression.structure;

    } else {
      nodeSystemLog.value += _coordinationExpression.structure;
    }

    var exp = _coordinationExpression.exp;
    var coordExpText = outputCoordExp(exp);
    var nodeText = document.createTextNode(coordExpText);
    nodeCoordExp.appendChild(nodeText);
  } catch (e) {
    alert("showCoordinationExpression " + e);
  }
}

function showWorkspaces() {
  try {
    for (var roleId in _workspaces) {
      var role = _roles[roleId];
      var workspace = _workspaces[roleId];
      if (!isAssociativeArrayEmpty(workspace)) {
        var nodeLi1 = document.createElement("li");
        var nodeText1 = document.createTextNode(outputRole(role));
        nodeLi1.appendChild(nodeText1);
        var nodeUl = document.createElement("ul");
        nodeLi1.appendChild(nodeUl);
        for (var docId in workspace) {
          var doc = _documents[docId];
          var nodeLi2 = document.createElement("li");
          var nodeText2 = document.createTextNode(outputDocument(doc));
          nodeLi2.appendChild(nodeText2);
          nodeUl.appendChild(nodeLi2);
        }
        nodeWorkspaces.appendChild(nodeLi1);
      }
    }
  } catch (e) {
    alert("showWorkspaces " + e);
  }
}

function isAssociativeArrayEmpty(a) {
  var l = 0;
  for (var e in a) {
    l++;
  }
  return l == 0;
}

function showWorkspacesTrace(workspaces, participants, roles, documents, node) {
  try {
    for (var roleId in workspaces) {
      var role = roles[roleId];
      var workspace = workspaces[roleId];
      if (participants[roleId]) {
        var nodeLi1 = document.createElement("li");
        var nodeText1 = document.createTextNode(outputRole(role));
        nodeLi1.appendChild(nodeText1);
        var nodeUl = document.createElement("ul");
        nodeLi1.appendChild(nodeUl);
        for (var docId in workspace) {
          var doc = documents[docId];
          var nodeLi2 = document.createElement("li");
          var nodeText2 = document.createTextNode(outputDocument(doc));
          nodeLi2.appendChild(nodeText2);
          nodeUl.appendChild(nodeLi2);
        }
        node.appendChild(nodeLi1);
      }
    }
  } catch (e) {
    alert("showWorkspacesTrace " + e);
  }
}

function showErrors() {
  try {
    var errors = [];
    for (var i = 0; i < _glossaryErrors.length; i++) {
      var glossaryError = _glossaryErrors[i];
      errors.push(glossaryError);
    }
    for (var i = 0; i < _coordinationExpressionErrors.length; i++) {
      var coordinationExpressionError = _coordinationExpressionErrors[i];
      errors.push(coordinationExpressionError);
    }
    for (var i = 0; i < _tracesErrors.length; i++) {
      var tracesError = _tracesErrors[i];
      errors.push(tracesError);
    }
    if (errors.length>0) {
      node_div_title.classList.remove('div_title');
      node_div_title.classList.add('div_title_error');
      removeChildren(node_titolo_validatore);
      var nodeText = document.createTextNode('Validatore - Sono presenti errori');
      node_titolo_validatore.appendChild(nodeText);
      node_titolo_validatore.classList.add('text-danger');

    }
    for (var i = 0; i < errors.length; i++) {
      var error = errors[i];
      var nodeText = document.createTextNode(error.message);
      var nodeLi = document.createElement("li");
      nodeLi.appendChild(nodeText);
      nodeErrors.appendChild(nodeLi);
    }
  } catch (e) {
    alert("showErrors " + e);
  }
}

function showTraces() {
  try {
    removeChildren(nodeTracesErrors);
    nodeSelectWrongTraces.checked = false;
    _currentTraceNumber = 1;
    removeChildren(nodeCurrentTraceNumber);
    var nodeTextCurrentTraceNumber = document.createTextNode(_currentTraceNumber);
    nodeCurrentTraceNumber.appendChild(nodeTextCurrentTraceNumber);
    removeChildren(nodeTracesNumber);
    var nodeTextTracesNumber = document.createTextNode(_traces.length);
    nodeTracesNumber.appendChild(nodeTextTracesNumber);
    showTrace(_traces[_currentTraceNumber - 1]);
  } catch (e) {
    alert("showTraces " + e);
  }
}

function showTrace(trace) {
  try {
    removeChildren(nodeTraces);
    removeChildren(nodeTraceSequences);
    var traceText = outputTrace(trace);
    var nodeText1 = document.createTextNode(traceText);
    nodeTraceSequences.appendChild(nodeText1);

    var nodeOl1 = document.createElement("ol");
    for (var i = 0; i < trace.errors.length; i++) {
      var nodeLi = document.createElement("li");
      var error = trace.errors[i];
      var nodeText = document.createTextNode(error.message);
      nodeLi.appendChild(nodeText);
      nodeOl1.appendChild(nodeLi);
    }
    for (var i = 0; i < trace.causalErrors.length; i++) {
      var error = trace.causalErrors[i];
      var nodeLi = document.createElement("li");
      var nodeText = document.createTextNode(error.message);
      nodeLi.appendChild(nodeText);
      nodeOl1.appendChild(nodeLi);
    }
    if ((trace.errors.length>0 || trace.causalErrors.length>0) && (trace.errors!== 'undefined' || trace.causalErrors!== 'undefined')) {
      var nodeP = document.createElement("p");
      nodeP.classList.add("text-center");
      var nodeB = document.createElement("b");
      var nodeText2 = document.createTextNode('Errori nella traccia');

      nodeB.appendChild(nodeText2);
      nodeP.appendChild(nodeB);
      nodeTraces.appendChild(nodeP);
    }

    nodeTraces.appendChild(nodeOl1);

    if ((trace.errors.length>0 || trace.causalErrors.length>0) && (trace.errors!== 'undefined' || trace.causalErrors!== 'undefined')) {
      var nodeHr = document.createElement("hr");
      nodeHr.classList.add("col-11");
      nodeHr.classList.add("border");
      nodeHr.classList.add("border-dark");
      nodeTraces.appendChild(nodeHr);
    }


    var nodeOl2 = document.createElement("ol");
    nodeTraces.appendChild(nodeOl2);
    showWorkspacesTrace(trace.workspaces, trace.participants, _roles, _documents, nodeOl2);
  } catch (e) {
    alert("showTrace " + e);
  }
}

function showRules() {
  try {
		var nodeOl = document.createElement("ol");
    for (var i = 0; i < _rules.length; i++) {
      var rule = _rules[i];
      var nodeLi = document.createElement("li");
      var nodeText = document.createTextNode(rule.output);
      nodeLi.appendChild(nodeText);
      nodeOl.appendChild(nodeLi);
			nodeRules.appendChild(nodeOl);
    }
  } catch (e) {
    alert("showRules " + e)
  }
}
