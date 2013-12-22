Ext.ns("Dextop.remoting");


/* Move this somewhere more appropriate */
Ext.define('Dextop.LookupModel', {
	extend: 'Ext.data.Model',
	fields: ['id', 'text'],
	idProperty: 'id'
});


Ext.define("Dextop.remoting.Proxy", {

	statics: {
		ajaxUrlBase: undefined,

		handlerTypes: {
			// default
			'alert': {
				failure: function (result) {
					if (!result)
						Dextop.alert({
							type: 'error',
							msg: 'Communication error ocurred.'
						});
					else
						Dextop.alert({
							type: result.type || 'error',
							msg: result.exception
						});
				}
			},

			'notify': {
				failure: function (result) {
					if (!result)
						Dextop.notify({
							type: 'error',
							msg: 'Communication error ocurred.'
						});
					else
						Dextop.notify({
							type: result.type || 'error',
							msg: result.exception
						});
				}
			},

			'none': {
				failure: Ext.emptyFn
			}
		},

		createHandler: function (callback, scope) {

			if (!callback)
				return {};

			if (typeof callback === 'function')
				return {
					scope: scope,
					callback: callback
				};

			if (typeof callback !== 'object')
				throw "Invalid callback specified.";

			if (!callback.type)
				callback.type = 'alert';

			var handler = Dextop.remoting.Proxy.handlerTypes[callback.type];
			if (!handler)
				throw "Remote method callback type '" + callback.type + "' not found.";
			Ext.applyIf(callback, handler);
			delete callback.type;

			scope = callback.scope || scope;

			if (callback.setLoading) {
				callback.setLoadingTarget = callback.setLoadingTarget || scope;
				callback.setMask = function () { callback.setLoadingTarget.setLoading(callback.setLoading); };
				callback.removeMask = function () { callback.setLoadingTarget.setLoading(false); };
			}

			return Ext.applyIf(callback, {
				callback: function (response) {

					if (callback.removeMask)
						callback.removeMask();

					if (callback.cleanup)
						callback.cleanup.call(scope);

					if (callback.handler)
						callback.handler.call(scope, response);

					if (!response) {
						if (callback.aborted)
							callback.aborted.call(scope);
						if (callback.failure)
							callback.failure.call(scope);
					} else {
						if (response.success && callback.success)
							callback.success.call(scope, response.result);
						else if (!response.success) {
							if (response.result && response.result.type == 'session')
								Dextop.getSession().handleSessionTermination();
							else if (callback.failure)
								callback.failure.call(scope, response.result);
						}
					}
				},
				scope: scope
			});
		}
	},

	remoteId: undefined,

	constructor: function (config) {
		if (!config || !config.remoteId)
			throw new 'Invalid Dextop.remoting.Proxy config specified!';

		this.remoteId = config.remoteId;
		this.components = config.components;
	},

	invokeRemoteMethod: function (callback, scope, method, args) {

		var handler = Dextop.remoting.Proxy.createHandler(callback, scope);

		if (handler.prepare)
			handler.prepare.call(handler.scope);

		if (handler.setMask)
			handler.setMask();

		Remote.invoke(this.remoteId, method, this.encodeArguments(args), handler.callback, handler.scope);
	},

	submitForm: function (callback, scope, method, form, args) {

		var handler = Dextop.remoting.Proxy.createHandler(callback, scope);

		if (handler.prepare)
			handler.prepare.call(handler.scope);

		if (handler.setMask)
			handler.setMask();

		var injectedForm = false;
		var formEl = form;
		var fieldValues = undefined;

		if (form && form.$className === "Ext.form.Basic") {
			var submitAction = Ext.create('Ext.form.action.Submit', {
				form: form
			});
			if(Ext.versions.extjs.version < "4.2.0")
              			formEl = submitAction.buildForm();
            		else
                		formEl = submitAction.buildForm().formEl;
			fieldValues = form.getFieldValues();
			injectedForm = true;
		}

		Remote.submitForm(formEl, {
			callback: handler.callback,
			scope: handler.scope,
			params: {
				_rcpId: this.remoteId,
				_rcpMethod: method,
				_rcpArguments: this.encodeArguments(args),
				_rcpFieldValues: Ext.encode(fieldValues)
			}
		});

		if (injectedForm)
			Ext.removeNode(formEl);

	},

	Dispose: function (callback, scope) {
		this.invokeRemoteMethod(callback, scope, 'Dispose', []);
	},

	Instantiate: function (type, config, callback, scope) {
		this.invokeRemoteMethod(callback, scope, 'Instantiate', [type, config]);
	},

	getSubRemoteId: function (subRemoteName) { return this.remoteId + '.' + subRemoteName; },

	encodeArguments: function (a) {
		/* Ext.encode([undefined, 1]) => '[1]' - wrong
		* Ext.encode([null, 1]) => '[null, 1]' - ok
		* If first argument in method call is undefined, second argument will fill it's place
		*/
		for (var i = 0; i < a.length; i++)
			if (!Ext.isDefined(a[i]))
				a[i] = null;
			else if (a[i] !== null)
				if (a[i].$className === "Ext.form.Basic")
					a[i] = Ext.encode(a[i].getFieldValues());
				else if (typeof a[i] === 'object')
					a[i] = Ext.encode(a[i]);
		return Ext.encode(a);
	},

	getAjaxUrl: function (options) {
		var url = Dextop.remoting.Proxy.ajaxUrlBase + '&remoteId=' + this.remoteId;
		if (options)
			url += '&' + Ext.urlEncode(options);
		return url;
	},

	getComponentConfig: function (name) {
		var config = this.findComponentConfig(name);
		if (!config)
			throw "Component '" + name + "' not defined.";
		return config;
	},

	findComponentConfig: function (name) {
		if (!this.components)
			return undefined;
		return this.components[name];
	},

	createProxy: function (name) {
		var config = this.getComponentConfig(name + 'Proxy');
		return Dextop.create(config);
	},

	createStore: function (name, options) {
		var config = this.findComponentConfig(name + 'Proxy');
		if (config) {
			var proxyConfig = Ext.apply(Ext.clone(config), options ? options.proxyOptions : undefined);
			var proxy = Dextop.create(proxyConfig);
			return Ext.create('Ext.data.Store', Ext.apply({
				model: config.model,
				proxy: proxy
			}, options));
		}
		config = this.findComponentConfig(name + 'LookupData');
		if (config) {
			return Ext.create('Ext.data.ArrayStore', Ext.apply({
				model: 'Dextop.LookupModel',
				proxy: {
					type: 'memory',
					reader: {
						type: 'array',
						idProperty: 'id'
					}
				},
				data: config
			}, options));
		}
		config = this.findComponentConfig(name + 'SharedLookupData');
		if (config) {
			var session = Dextop.getSession();
			session.setSharedLookupData(config);
			var data = session.getSharedLookupData(config.name);
			return Ext.create('Ext.data.ArrayStore', Ext.apply({
				model: 'Dextop.LookupModel',
				proxy: {
					type: 'memory',
					reader: {
						type: 'array',
						idProperty: 'id'
					}
				},
				data: data
			}, options));
		}
		throw "Could not create store '" + name + "'. Component configuration is not defined.";
	},

	createLiveStore: function (name, options) {
		var config = this.getComponentConfig(name + 'LiveStore');
		return Dextop.create(Ext.apply({
		   autoDestroy: true
		}, config, options));
	},

	createGridColumns: function (name, options) {
		var model = this.findComponentConfig(name + 'GridHeaders');
		if (!model) {
			var config = this.findComponentConfig(name + 'Proxy') || this.findComponentConfig(name + 'LiveStore');
			if (config)
				model = config.model;
		}
		if (!model)
			throw "Could not create headers '" + name + "'. Component configuration is not defined.";
		options = options || {};
		options.remote = this;
		return Dextop.data.GridColumnsFactory.create(this.replaceLast(model, '.model.', '.columns.'), options);
	},

	replaceLast: function (str, search, replacement) {
		var charpos = str.lastIndexOf(search);
		if (charpos < 0) return str;
		return str.substring(0, charpos) + replacement + str.substring(charpos + search.length);
	}
});
