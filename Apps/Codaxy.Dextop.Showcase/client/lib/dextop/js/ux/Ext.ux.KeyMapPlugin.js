Ext.define('Ext.ux.KeyMapPlugin', {
	init: function (cmp) {
		cmp.mon(cmp, 'render', function (p) {
			if (Ext.versions.extjs.version < '4.1.0') {
				var keys = this.keyMap || this.keys;
				if (this._keyMap || !keys)
					return;
				this._keyMap = this.el.addKeyMap(keys);
			} else {
				if (this.keys)
					this.getKeyMap();
			}
		}, cmp);

	}
});