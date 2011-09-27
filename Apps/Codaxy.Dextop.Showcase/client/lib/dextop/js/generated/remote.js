Ext.define('Dextop.RemotableConfig.remoting.Proxy', {
	extend: 'Dextop.remoting.Proxy'
});

Ext.define('Dextop.data.Proxy.remoting.Proxy', {
	extend: 'Dextop.remoting.Proxy',
	Load: function(optionsJSON, callback, scope) { this.invokeRemoteMethod(callback, scope, 'Load', [optionsJSON]);},
	Create: function(json, callback, scope) { this.invokeRemoteMethod(callback, scope, 'Create', [json]);},
	Update: function(json, callback, scope) { this.invokeRemoteMethod(callback, scope, 'Update', [json]);},
	Destroy: function(json, callback, scope) { this.invokeRemoteMethod(callback, scope, 'Destroy', [json]);}
});

Ext.define('Dextop.data.LiveStore.remoting.Proxy', {
	extend: 'Dextop.remoting.Proxy',
	Subscribe: function(callback, scope) { this.invokeRemoteMethod(callback, scope, 'Subscribe', []);}
});

Ext.define('Dextop.RemotableBase.remoting.Proxy', {
	extend: 'Dextop.remoting.Proxy'
});

Ext.define('Dextop.Window.remoting.Proxy', {
	extend: 'Dextop.RemotableBase.remoting.Proxy'
});

Ext.define('Dextop.Window`1.remoting.Proxy', {
	extend: 'Dextop.Window.remoting.Proxy'
});

Ext.define('Dextop.Session.remoting.Proxy', {
	extend: 'Dextop.remoting.Proxy',
	ExtendSession: function(callback, scope) { this.invokeRemoteMethod(callback, scope, 'ExtendSession', []);},
	RegisterLookupDataVersion: function(lookupName, version, callback, scope) { this.invokeRemoteMethod(callback, scope, 'RegisterLookupDataVersion', [lookupName, version]);}
});

Ext.define('Dextop.Panel.remoting.Proxy', {
	extend: 'Dextop.RemotableBase.remoting.Proxy'
});

