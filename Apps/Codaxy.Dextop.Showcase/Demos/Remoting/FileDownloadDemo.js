Ext.define('Showcase.demos.FileDownloadDemoWindow', {
	extend: 'Dextop.Window',
	width: 200,
	height: 200,
	title: 'File Download Demo',

	initComponent: function () {
		Ext.apply(this, {
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				xtype: 'button',
				margins: '3 3 3 3',
				flex: 1,
				scope: this
			},
			bodyStyle: 'padding: 5px',
			items: [{
				text: 'Download',
				handler: function () {
					Dextop.downloadAttachment(this.remote.getAjaxUrl());
				}
			}, {
				text: '1 minute download',
				handler: function () {
					Dextop.downloadAttachment(this.remote.getAjaxUrl({ long: 1 }));
				}
			}, {
				text: 'Download Zip file',
				handler: function () {
					Dextop.downloadAttachment(Dextop.absolutePath('Demos/Remoting/FileDownloadDemo.zip'));
				}
			}]

		});
		this.callParent(arguments);
	}
});