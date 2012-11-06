Ext.ns('Dextop.data');

Ext.define('Dextop.data.Proxy', {

	extend: 'Ext.data.ServerProxy',

	mixins: {
		remotable: 'Dextop.remoting.Remotable'
	},

	requires: ['Ext.data.ServerProxy', 'Dextop.remoting.Remotable'],

	defaultWriterType: 'array',
	defaultReaderType: 'array',

	//callback options for remote method invocation
	remoteCallbackOptions: undefined,

	constructor: function (config) {

	    config = config || {};    
        
	    if (!config.reader || typeof config.reader === 'string')
	        config.reader = {
	            type: config.reader,
	            root: 'data',
	            totalProperty: 'total'
	        };

		if (config.remote) {
			this.initRemote(config.remote);
			delete config.remote;
		}

		this.callParent(arguments);
	},

	applyEncoding: function (v) {
		return v;
	},

	doRequest: function (operation, callback, scope) {
		var args = [];

		switch (operation.action) {
			case 'read':
				var params = this.getParams(operation);
				params.Params = Ext.apply(operation.params || {}, this.extraParams);
				args.push(params);
				break;
			case 'create':
			case 'update':
			case 'destroy':
				if (!this.writer)
					throw 'Proxy writer is not configured.';
				var data = [];
				for (var i = 0; i < operation.records.length; i++)
					data[i] = this.writer.getRecordData(operation.records[i]);
				args.push(Ext.encode(data));
				break;
			default:
				throw 'Uknown action ' + operation.action + '.';
		}
		args.push(this.createCallback(operation, callback, scope));
		args.push(this);
		this[operation.action + 'Record'].apply(this, args);
	},

	createCallback: function (operation, callback, scope) {
		return Ext.apply({
			handler: function (r) {
				this.processResponse(r.success, operation, null, r, callback, scope)
			}
		}, this.remoteCallbackOptions);
	},

	extractResponseData: function (response) {
		if (Ext.isString(response.result.data))
			response.result.data = Ext.decode(response.result.data);
		return response.result;
	},

	//private
	readRecord: function () {
		this.remote.Load.apply(this.remote, arguments);
	},

	//private
	createRecord: function () {
		this.remote.Create.apply(this.remote, arguments);
	},

	//private
	updateRecord: function () {
		this.remote.Update.apply(this.remote, arguments);
	},

	//private
	destroyRecord: function () {
		this.remote.Destroy.apply(this.remote, arguments);
	},

	onDestroy: function () {
		this.destroyRemote();
		this.callParent(arguments);
	}
})
