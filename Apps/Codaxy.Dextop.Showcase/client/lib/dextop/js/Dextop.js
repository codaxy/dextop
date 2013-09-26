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

	virtualAppPath: '',


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

	api: function (type, config) {
	    if (!type)
	        return null;

	    if (typeof type == 'string') {
	        var typeName = Ext.ClassManager.getNameByAlias('api.' + type) || type;
	        return Ext.create(typeName, config);
	    }

	    if (type.createStore)
	        return type; //already initialized

	    if (!type.type)
	        throw 'Cannot instantate api object as no type alias is specified!';

	    return Dextop.api(type.type, type);
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
	    if (typeof msg === 'string')
	        msg = {
	            msg: msg
	        };

	    var alertDefaults = {
	        info: {
	            title: Dextop.infoText,
	            icon: Ext.MessageBox.INFO,
	            buttons: Ext.MessageBox.OK
	        },
	        warning: {
	            title: Dextop.warningText,
	            icon: Ext.MessageBox.WARNING,
	            buttons: Ext.MessageBox.OK
	        },
	        error: {
	            title: Dextop.errorText,
	            icon: Ext.MessageBox.ERROR,
	            buttons: Ext.MessageBox.OK
	        }
	    };

	    Ext.applyIf(msg, alertDefaults[msg.type || 'info']);

	    msg.msg = msg.msg || msg.message || msg.exception || msg.text;

	    Ext.MessageBox.show(msg);
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

	notify: function (msg) {

	    if (typeof msg === 'string')
	        msg = {
	            type: 'info',
	            msg: msg
	        };

	    var defaults = {
	        info: {
	            title: Dextop.infoText
	        },
	        warning: {
	            title: Dextop.warningText
	        },
	        error: {
	            title: Dextop.errorText
	        }
	    };

	    Ext.applyIf(msg, defaults[msg.type]);

	    msg.msg = msg.message = msg.msg || msg.message || msg.exception || msg.text;

	    if (typeof Dextop.Logger[msg.type] === 'function') {
	        Dextop.Logger[msg.type](msg.msg);
	    }

	    if (msg.sound) {
	        if (msg.sound === true)
	            Dextop.playSound(msg.type);
	        else
	            Dextop.playSound(msg.sound);
	    }

	    if (msg.alert)
	        Dextop.alert(msg);
	    else
	        Dextop.displayPopupNotification(msg);
	},

	displayPopupNotification: function (notification) {
	    var msg = '<div class="msg ' + notification.type + '"><h3>' + notification.title + '</h3><p>' + notification.message + '</p></div>';
	    if (!this.msgCt) {
	        this.msgCt = Ext.core.DomHelper.insertFirst(document.body, { id: 'msg-div' }, true);
	    }
	    var m = Ext.core.DomHelper.append(this.msgCt, msg, true);
	    m.hide();
	    m.slideIn('t').ghost("t", { delay: 4000, remove: true });
	},

    //virtual
	playSound: function (sound) {

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

	    if (!Dextop.virtualAppPath) {
	        Ext.each(Ext.DomQuery.select('link'), function (link) {
	            var href = Ext.fly(link).getAttribute('href');
	            var index = href.indexOf('client/lib/dextop/');
	            if (index > 0) {
	                Dextop.virtualAppPath = href.substring(0, index);
	                return false;
	            }
	        });
	    }

	    if (!path)
	        return path;
	    if (path.indexOf(Dextop.virtualAppPath) == 0)
	        return path;
	    if (path.charAt(0) == '/')
	        return Dextop.virtualAppPath + path.substring(1);
	    return Dextop.virtualAppPath + path;
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
	},

	getStore: function (storeId, options) {
	    var store = Ext.getStore(storeId);
	    if (options && options.autoLoad && !store.isLoading() && store.getCount() == 0)
	        store.load();
	    return store;
	}
});