Ext.define('Desktop.WindowModule', {
	extend: 'Ext.ux.desktop.Module',

	init: function () {
		this.windowType = this.windowType || this.id;
		Ext.applyIf(this.launcher, {
			handler: this.createWindow,
			scope: this
		});
	},

	createWindow: function () {
		Dextop.getSession().remote.CreateWindow(this.windowType, this.windowArgs, {
			type: 'alert',
			success: function (result) {
				var window = Dextop.create(result);
				Dextop.getSession().addDesktopWindow(window);
				window.show();
			}
		});
	}
});