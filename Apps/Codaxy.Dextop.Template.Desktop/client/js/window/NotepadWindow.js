Ext.define('Desktop.window.NotepadWindow', {
	extend: 'Dextop.Window',
	width: 800,
	height: 600,

	title: 'Notepad',
	iconCls: 'notepad',
	border: true,

	initComponent: function () {

		Ext.apply(this, {
			layout: 'fit',
			bodyStyle: 'padding: 5px',
			tbar: [{
				text: 'Save',
				iconCls: 'save',
				scope: this,
				handler: function () {
					var editor = this.down('htmleditor');
					var content = editor.getValue();
					this.remote.UploadContent(content, {
						type: 'alert',
						success: function (result) {
							Dextop.notify(result);
						}
					});
				}
			}],
			items: [{
				border: false,
				xtype: 'htmleditor'
			}]
		});

		this.callParent(arguments);
	}
});