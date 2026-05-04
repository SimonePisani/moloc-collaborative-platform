function handlerCurrentTraceButton () {
	try {
		removeChildren(nodeCurrentTraceNumber);
		var nodeTextCurrentTraceNumber = document.createTextNode(_currentTraceNumber);
		nodeCurrentTraceNumber.appendChild(nodeTextCurrentTraceNumber);
		showTrace(_traces[_currentTraceNumber - 1]);
	} catch ( e ) {
		alert ("handlerCurrentTraceButton " + e);
	}
}

function handlerPreviousTraceButton () {
	try {
		var selectedWrongTraces = nodeSelectWrongTraces.checked;
		if (!selectedWrongTraces) {
			_currentTraceNumber--;
			if (_currentTraceNumber == 0) {
				_currentTraceNumber = _traces.length;
			}
		} else if (_traces.errorsNumber >  0) {
			var initialCurrentTraceNumber = _currentTraceNumber;
			var i = 0;
			while (i < _traces.length) {
				_currentTraceNumber--;
				if (_currentTraceNumber == 0) {
					_currentTraceNumber = _traces.length;
				}
				var currentTrace = _traces[_currentTraceNumber - 1];
				if (currentTrace.errors.length > 0 || currentTrace.causalErrors.length > 0) {
					break;
				}
				i++;
			}
		}
		removeChildren(nodeCurrentTraceNumber);
		var nodeTextCurrentTraceNumber = document.createTextNode(_currentTraceNumber);
		nodeCurrentTraceNumber.appendChild(nodeTextCurrentTraceNumber);
		showTrace(_traces[_currentTraceNumber - 1]);
	} catch ( e ) {
		alert ("handlerPreviousTraceButton " + e);
	}
}

function handlerNextTraceButton () {
	try {
		var selectedWrongTraces = nodeSelectWrongTraces.checked;
		if (!selectedWrongTraces) {
			_currentTraceNumber++;
			if (_currentTraceNumber > _traces.length) {
				_currentTraceNumber = 1;
			}
		} else if (_traces.errorsNumber >  0) {
			var initialCurrentTraceNumber = _currentTraceNumber;
			var i = 0;
			while (i < _traces.length) {
				_currentTraceNumber++;
				if (_currentTraceNumber > _traces.length) {
					_currentTraceNumber = 1;
				}
				var currentTrace = _traces[_currentTraceNumber - 1];
				if (currentTrace.errors.length > 0 || currentTrace.causalErrors.length > 0) {
					break;
				}
				i++;
			}
		}
		removeChildren(nodeCurrentTraceNumber);
		var nodeTextCurrentTraceNumber = document.createTextNode(_currentTraceNumber);
		nodeCurrentTraceNumber.appendChild(nodeTextCurrentTraceNumber);
		showTrace(_traces[_currentTraceNumber - 1]);
	} catch ( e ) {
		alert ("handlerNextTraceButton " + e);
	}
}
