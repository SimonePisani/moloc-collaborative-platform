var _inputFile;
var _fileLoaded;
var _fileAnalyzed;

var _localWords;
var _localMessages;
var _baseVocabulary;
var _articles;
var _isLiteral;
var _areLiteral;
var _aLiteral;
var _roleLiteral;
var _documentLiteral;
var _wordGroups;
var _rules;

var _phase;
var _sourceText;
var _title;
var _rawText;
var _cleanedText;
var _chuncks;
var _sentences;
var _vocabulary
var _phrases;
var _glossary;
var _glossaryErrors;
var _coordinationExpression;
var _coordinationExpressionErrors;
var _roles;
var _documents;
var _flows;
var _activities;
var _decisions;
var _genericActivities;
var _residuals;
var _workspaces;
var _traces;
var _tracesErrors;
var _tooManyTraces;
var _currentTraceNumber;
var _box;

function initGlobals () {
	try {
		_inputFile = null;
        _fileLoaded = false;
        _fileAnalyzed = false;	
	} catch ( e ) {
		alert("initGlobals " + e);
	}
}		