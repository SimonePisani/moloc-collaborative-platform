function addSemanticError (activity, errorCode, roleId, docId, error) {
	try {
		var semanticErrors = activity.errors;
		var errorKey = errorCode;
		switch (errorCode) {
			case JURIDICAL_LOCK :
				errorKey += "$" + roleId;
				break;
			case LACK_DOCUMENT :
			case MISSING_REASON :
				errorKey += "$" + roleId + "$" + docId;
				break;
		}
		if (!(errorKey in semanticErrors)) {
			semanticErrors[errorKey] = error;
		}
	} catch ( e ) {
		alert("addSemanticError " + e);
	}
}