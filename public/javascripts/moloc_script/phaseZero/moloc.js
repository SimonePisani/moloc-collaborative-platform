// Vincenzo Ambriola
// Dipartimento di Informatica
// Università di Pisa
//
// moloc version 5.0
//
// May 21th, 2020
//
//  moloc.html					    110
//  moloc.css						 81
//
//  phaseZero/constants.js			 38
//  phaseZero/globals.js			 52
//  phaseZero/gui.js				136
//  phaseZero/handlers.js			209
//  phaseZero/local.js				 99
//  phaseZero/moloc.js				115
//  phaseZero/rules.js				699
//  phaseZero/vocabulary.js			 97
//
//  phaseOne/coordExpCreation.js	741
//  phaseOne/modelCreation.js		485
//  phaseOne/rulesApplication.js	163
//  phaseOne/textProcessing.js		630
//
//  phaseTwo/coordExpr.js			266
//  phaseTwo/traces.js				698
//  phaseTwo/workspace.js			162
//
//  phaseThree/errors.js			 20
//  phaseThree/model.js				129
//  phaseThree/output.js			200
//  phaseThree/show.js				380
//
//  phaseFour/visual2D.js			835
//
//  							  6.371 locs
//-------------------------------------------------------
//
//-------------------------------------------------------
// TO DO list
// check rules correctness
// add state automata in UI

function analyze() {
  try {
		_phase = "PhaseZero: initial values";

    initNodesGUI();

		// phaseZero/local.js
    initLocal();

    // phaseZero/vocabulary.js
    createBaseVocabulary();
    processVocabulary();

    // phaseZero/rules.js
    processRules();

    // phaseZero/globals.js
    initGlobals();
    _phase = "phaseOne: text processing";

    // phaseOne/textProcessing.js
    processText();

    _phase = "phaseOne: rules application & model creation";

    // phaseOne/modelCreation.js
    createModel();
    // phaseOne/coordExpCreation.js
    createCoordinationExpression();

    _phase = "phaseTwo: model checking";

    // phaseTwo/workspace.js
    createWorkspaces();
    // phaseTwo/traces.js
    createTraces();
    // phaseTwo/coordExpr.js
    checkCoordinationExpression();

    _phase = "PhaseTree: user interface";

    // phaseThree/model.js
    //showModel();
    // phaseThree/show.js
    show();

    _phase = "PhaseFour: 2D visualization";

    // phaseFour/visual2D.js
    visualize();

  } catch (e) {
    alert("analyze: " + _phase + ". " + e);
  }
}



window.onload = analyze;
