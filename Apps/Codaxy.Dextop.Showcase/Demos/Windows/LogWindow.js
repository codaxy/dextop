Ext.ns('Showcase.demos');

Ext.define('Showcase.demos.LogWindow', {
	extend: 'Dextop.Window',

	title: 'Log',
	width: 800,
	height: 400,
	layout: 'fit',

	initComponent: function () {

		this.doLog();

		Ext.apply(this, {
			items: Ext.create('Dextop.logger.Panel'),
			buttons: [{
				text: 'Log',
				handler: this.doLog
			}, {
				text: 'Close',
				handler: this.close,
				scope: this
			}]
		});

		this.callParent(arguments);

		
	},

	doLog: function() {
		Dextop.Logger.error('This is an error example');
		Dextop.Logger.warning('This is a warning example');
		Dextop.Logger.info('This is an info example');
		Dextop.Logger.debug('This is a debug example');
		Dextop.Logger.trace('This is a trace example');
	}
});
