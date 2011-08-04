Ext.ns('Showcase');

Ext.define('Showcase.demos.LongOperationWindow', {
	extend: 'Dextop.Window',
	width: 300,
	height: 100,

	title: 'Long Operation Progress',

	initComponent: function () {

		this.progressBar = Ext.create('Ext.ProgressBar', {});

		Ext.apply(this, {
			bodyStyle: 'padding: 5px',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: this.progressBar,			
			buttons: [{				
				scope: this,
				text: 'Start',
				handler: function () {
					this.remote.StartOperation({
						type: 'alert',
						scope: this,
						prepare: function () { this.setLoading(true); },
						cleanup: function () { this.setLoading(false); }
					});
				}
			}, {
				scope: this,
				text: 'Cancel',
				handler: function () {
					this.remote.CancelCurrentOperation({
						type: 'alert',
						scope: this,
						prepare: function () { this.setLoading(true); },
						cleanup: function () { this.setLoading(false); }
					});
				}
			}]
		});

		this.callParent(arguments);
	},

	onServerMessage: function (data) {
		this.progressBar.updateProgress(data.progress, data.message);
	}
});
