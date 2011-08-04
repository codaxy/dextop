Ext.define('Desktop.Session.remoting.Proxy', {
	extend: 'Dextop.Session.remoting.Proxy',
	CreateWindow: function(windowType, windowArgs, callback, scope) { this.invokeRemoteMethod(callback, scope, 'CreateWindow', [windowType, windowArgs]);}
});

Ext.define('Desktop.window.GridWindow.remoting.Proxy', {
	extend: 'Dextop.Window.remoting.Proxy'
});

Ext.define('Desktop.window.NotepadWindow.remoting.Proxy', {
	extend: 'Dextop.Window.remoting.Proxy',
	UploadContent: function(content, callback, scope) { this.invokeRemoteMethod(callback, scope, 'UploadContent', [content]);}
});

