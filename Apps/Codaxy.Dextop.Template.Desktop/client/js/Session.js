Ext.define('Desktop.Session', {
	extend: 'Dextop.Session',

	initSession: function () {
		this.callParent(arguments);
		this.initDesktop();
	},

	initDesktop: function () {
		this.app = Ext.create('Desktop.App', {
			session: this
		});
	},

	addDesktopWindow: function (win) {
		this.app.getDesktop().addWindow(win);
	}
});