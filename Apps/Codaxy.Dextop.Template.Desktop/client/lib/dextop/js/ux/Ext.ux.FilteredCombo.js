Ext.define('Ext.ux.FilteredCombo', {
	extend: 'Ext.form.field.ComboBox',
	alias: 'widget.filteredcombo',

	queryCaching: false,

	getParams: function (queryString) {
		var params = this.callParent(arguments);
		if (Ext.isArray(this.formParams)) {
			var form = this.up('form');
			if (form) {
				var bf = form.getForm();
				for (var i = 0; i < this.formParams.length; i++) {
					var field = bf.findField(this.formParams[i]);
					if (field)
						params[this.formParams[i]] = field.getValue();
				}
			}
		}
		return params;
	}
});