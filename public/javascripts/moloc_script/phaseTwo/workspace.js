function createWorkspaces () {
    try {
        _workspaces = {};
		for (var roleId in _roles) {
			_workspaces[roleId] = {};
        }
		
		addPublicDocuments(_workspaces);
		addPrivateDocuments(_workspaces);
		
		for (var flowId in _flows) {
			var flow = _flows[flowId];
			var docId = flow.doc.id;
			if ("receiver" in flow) {
				var receiver = flow.receiver;
				var receiverId = receiver.id;
				var workspace = _workspaces[receiverId];
				workspace[docId] = true;
				_roles[receiverId].used = true;
				if (receiver.subType == "collective") {
					var components = receiver.components;
					for (var i = 0; i < components.length; i++) {
						var component = components[i];
						var componentId = component.id;
						var workspace = _workspaces[componentId];
						workspace[docId] = true;
						_roles[componentId].used = true;			
					}
				}
			}
			if ("receivers" in flow) {
				var receivers = flow.receivers;
				for (var i = 0; i < receivers.length; i++) {
					var receiver = receivers[i];
					var receiverId = receiver.id;
					var workspace = _workspaces[receiverId];
					workspace[docId] = true;
					_roles[receiverId].used = true;
					if (receiver.subType == "collective") {
						var components = receiver.components;
						for (var i = 0; i < components.length; i++) {
							var component = components[i];
							var componentId = component.id;
							var workspace = _workspaces[componentId];
							workspace[docId] = true;
							_roles[componentId].used = true;			
						}
					}
				}
			}
		}
		
		for (var actId in _activities) {
			var activity = _activities[actId];
			var role = activity.role;
            var roleId = role.id;
			_roles[roleId].used = true;
			var workspace = _workspaces[roleId];
            var docs = activity.output;
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
				var docId = doc.id;
                workspace[docId] = true;
				_documents[docId].used = true;
            }
			if (role.subType == "collective") {
				var components = role.components;
				for (var i = 0; i < components.length; i++) {
					var component = components[i];
					var componentId = component.id;
					_roles[componentId].used = true;
					var workspace = _workspaces[componentId];
					for (var j = 0; j < docs.length; j++) {
						var doc = docs[j];
						var docId = doc.id;
						workspace[docId] = true;
						_documents[docId].used = true;
					}	
				}
			}
        }

		for (var actId in _decisions) {
			var activity = _decisions[actId];
			var role = activity.role;
            var roleId = role.id;
			_roles[roleId].used = true;
			var workspace = _workspaces[roleId];
            var docs = activity.output;
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
				var docId = doc.id;
                workspace[docId] = true;
				_documents[docId].used = true;
            }
			if (role.subType == "collective") {
				var components = role.components;
				for (var i = 0; i < components.length; i++) {
					var component = components[i];
					var componentId = component.id;
					_roles[componentId].used = true;
					var workspace = _workspaces[componentId];
					for (var j = 0; j < docs.length; j++) {
						var doc = docs[j];
						var docId = doc.id;
						workspace[docId] = true;
						_documents[docId].used = true;
					}	
				}
			}
        }		
    } catch ( e ) {
        alert("createWorkspaces " + e);
    }
}

function addPublicDocuments (workspaces) {
	try {
		for (var docId in _documents) {
			var doc = _documents[docId];
			if (doc.subType == "public") {
				for (var roleId in workspaces) {
					var workspace = workspaces[roleId];
					workspace[docId] = true;
					_roles[roleId].used = true;
					_documents[docId].used = true;					
				}
			}
		}
    } catch ( e ) {
        alert("addPublicDocuments " + e);
    }		
}

function addPrivateDocuments (workspaces) {
	try {
		for (var docId in _documents) {
			var doc = _documents[docId];
			if (doc.subType == "private") {
				// only one owner at the moment
				var role = doc.owners[0];
				var roleId = role.id;
				_documents[docId].used = true;
				var workspace = workspaces[roleId];
				workspace[docId] = true;
				_roles[roleId].used = true;
				if (role.subType == "collective") {
					var components = role.components;
					for (var i = 0; i < components.length; i++) {
						var component = components[i];
						var componentId = component.id;
						var workspace = workspaces[componentId];
						workspace[docId] = true;
						_roles[componentId].used = true;		
					}
				}
			}
		}
    } catch ( e ) {
        alert("addPrivateDocuments " + e);
    }		
}