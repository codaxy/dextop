Ext.ns('Dextop');

Ext.apply(Dextop, {

	errorText: 'Error',
	warningText: 'Warning',
	confirmText: 'Confirmation',
	infoText: 'Information',

	saveText: 'Save',
	cancelText: 'Cancel',
	editText: 'Edit',
	addText: 'Add',
	removeText: 'Remove',
	reloadText: 'Reload',

	/* Shorthand for Ext.create(config.alias, config).
	* config.alias is deleted before call is made
	*/
	create: function (config, apply) {
		if (!config || !config.alias)
			throw 'Cannot instantate Dextop object as no type alias is specified!';
		if (apply)
			Ext.apply(config, apply);
		var alias = config.alias;
		delete config.alias;
		return Ext.create(alias, config);
	},

	applyRecursive: function (o, c, defaults) {
		if (defaults)
			Dextop.applyRecursive(o, defaults);

		if (o && c && typeof c == 'object') {
			for (var p in c) {
				o[p] = Ext.isObject(o[p]) && Ext.isObject(c[p]) ? Dextop.applyRecursive(o[p], c[p]) : c[p];
			}
		}
		return o;
	},

	createGridColumns: function (name, options) {
		return Dextop.data.GridColumnsFactory.create(name, options);
	},

	alert: function (msg) {
		Dextop.getSession().alert(msg);
	},

	infoAlert: function (msg) {
		if (typeof msg === 'string')
			msg = {
				msg: msg
			};
		msg.type = 'info';
		Dextop.alert(msg);
	},

	warningAlert: function (msg) {
		if (typeof msg === 'string')
			msg = {
				msg: msg
			};
		msg.type = 'warning';
		Dextop.alert(msg);
	},

	errorAlert: function (msg) {
		if (typeof msg === 'string')
			msg = {
				msg: msg
			};
		msg.type = 'error';
		Dextop.alert(msg);
	},

	getSession: function () {
		return Dextop.Session.getInstance();
	},

	notify: function (n) {
		Dextop.getSession().notify(n);
	},

	//Confirmations

	/**
	* Standard (non-blocking) Ext confirmation dialog, with preset title, buttons and icon
	* Usage example:
	<pre><code>
	Dextop.confirm({
	msg: 'Do you want to delete this file?',
	scope: this,
	fn: function(btn){
	if (btn == 'yes'){
	// delete file
	}
	}
	});
	</code></pre>
	*
	* @param {Object/Function} config Configuration parameters (@see Ext.MessageBox)
	*/
	confirm: function (config) {
		config = Ext.applyIf({
			title: this.confirmText,
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION
		}, config);
		Ext.Msg.show(config);
	},

	warningConfirm: function (config) {
		config = Ext.applyIf({
			title: this.warningText,
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.WARNING
		}, config);
		Ext.Msg.show(config);
	},

	/**
	* Confirmation dialog that waits for user input and returns the choice. For now, 
	* it is implemented as a wrapper aroung JavaScript comfirm()
	* 
	* @param {Object/String} config Configuration parameters (@see Ext.MessageBox)
	* @returns {Boolean} User's choice
	*/
	blockingConfirm: function (config) {
		return confirm(config.msg || config);
	},

	absolutePath: function (path) {
		return Dextop.getSession().getAbsolutePath(path);
	},

	downloadAttachment: function (url) {
		//window.open(url); 

		var iframeEl = Ext.core.DomHelper.append(Ext.getBody(), {
			tag: 'iframe',
			src: url,
			style: 'display:none',
			width: 0,
			height: 0,
			frameborder: 0
		});

		var destroyFrameTask = new Ext.util.DelayedTask(function () {
			Ext.removeNode(iframeEl);
		});

		// give download task 5 minutes to start
		// after download starts it is safe to remove the iframe		
		destroyFrameTask.delay(5 * 60 * 1000);

	},

	localize: function (className, localizationData) {
		var c = Ext.ClassManager.get(className);
		if (c && c.prototype)
			Ext.apply(c.prototype, localizationData);
	}	
});