Ext.ns('Showcase');

Ext.define('Showcase.demos.PlaySoundWindow', {
	extend: 'Dextop.Window',
	width: 200,
	height: 100,

	title: 'Play Sound',

	initComponent: function () {
		
		Ext.apply(this, {
			bodyStyle: 'padding: 5px',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			defaults: {
				xtype: 'button',
				margins: '3 3 3 3',
				flex: 1,
				scope: this,
			},
			items: [{				
				text: 'Play',				
				handler: function () {
					this.play();
				}
			}]
		});		

		this.callParent(arguments);
	},

	play: function () {
		
		var soundManager = window.soundManager;		
		if (!window.soundManager)
			Dextop.errorAlert('Sound manager not loaded/initialized.');
		
		window.soundManager.play('s', this.soundUrl);		
	}
});
