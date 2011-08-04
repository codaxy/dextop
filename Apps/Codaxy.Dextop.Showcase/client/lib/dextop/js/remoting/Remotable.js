Ext.ns("Dextop.remoting");

Ext.define("Dextop.remoting.Remotable", {
	
	statics: {
		remotes: {},
		
		registerRemote: function(remote) {
			this.remotes[remote.remoteId] = remote;	
		},
		
		unregisterRemote: function(remote) {
			this.remotes[remote.remoteId] = undefined;
		},
		
		findRemote: function(remoteId) {
			return this.remotes[remoteId]; 
		},
		
		dispatchServerMessages: function(sm) {			
			for (var i = 0; i<sm.length; i++) {
				var remote = this.findRemote(sm[i].remoteId);
				if (remote && remote.processServerMessage)
					remote.processServerMessage(sm[i].message);
			}
		} 
	},

    initRemote: function (config) {
        if (!config)
            throw 'Remote config not set.';
        if (!config.remoteId)
        	throw 'Remote config has no remoteId set';
        if (!config.alias)
        	config.alias = this.getNestedTypeName('.remoting.Proxy');
        this.remote = Dextop.create(config);
        if (this.onServerMessage)
        	this.remote.processServerMessage = Ext.bind(this.onServerMessage, this);
        Dextop.remoting.Remotable.registerRemote(this.remote);        
    },
    
    destroyRemote: function() {
    	if (this.remote) {
    		if (this.remote.processServerMessage)
    			delete this.remote.processServerMessage;
    		Dextop.remoting.Remotable.unregisterRemote(this.remote);
    		delete this.remote;
    	}
    },
    
    getNestedTypeName: function(typeName) {
    	return this['$className'] + typeName;    	
    }
        
});