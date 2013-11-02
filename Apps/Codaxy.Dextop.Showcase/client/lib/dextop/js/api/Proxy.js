Ext.define('Dextop.api.Proxy', {

    extend: 'Ext.data.ServerProxy',

    requires: ['Ext.data.ServerProxy', 'Dextop.remoting.Remotable'],

    defaultWriterType: 'array',
    defaultReaderType: 'array',

    alias: 'proxy.api',

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

        if (!config.api)
            throw Error('Could not create api based data proxy as api is not specified.');

        this.api = Dextop.api(config.api);
        delete config.api;

        this.callParent(arguments);
    },

    applyEncoding: function (v) {
		return v;
	},

	doRequest: function (operation, callback, scope) {
	    var args = [];

	    args.push(this.createCallback(operation, callback, scope));
	    args.push(this);
	    args.push(operation.action);

	    var data = [];

		switch (operation.action) {
			case 'read':
				var params = this.getParams(operation);
				params.Params = Ext.apply(operation.params || {}, this.extraParams);
				data.push(params);				
				break;
			case 'create':
			case 'update':
			case 'destroy':
				if (!this.writer)
					throw 'Proxy writer is not configured.';
				var ma = [];
				for (var i = 0; i < operation.records.length; i++)
				    ma[i] = this.writer.getRecordData(operation.records[i]);
				data.push(ma);
				break;
			default:
				throw 'Uknown action ' + operation.action + '.';
	    }

		
		args.push(data);
		
		this.api.invokeRemoteMethod.apply(this.api, args);
	},

	createCallback: function (operation, callback, scope) {
		return Ext.apply({
			handler: function (r) {
				this.processResponse(r && r.success, operation, null, r, callback, scope)
			}
		}, this.remoteCallbackOptions);
	},

	extractResponseData: function (response) {
		if (Ext.isString(response.result.data))
			response.result.data = Ext.decode(response.result.data);
		return response.result;
	}
})
