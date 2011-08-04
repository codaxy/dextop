Ext.define('Ext.ux.KeyMapPlugin', {
	init: function (cmp) {
		cmp.mon(cmp, 'render', function (p) {
			if (this._keyMap || !this.keyMap)
				return;
			this._keyMap = this.el.addKeyMap(this.keyMap);
		}, cmp);
	}
});