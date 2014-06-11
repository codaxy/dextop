Ext.ns('Showcase');

Ext.define('Showcase.DemoDetails', {
	extend: 'Ext.Panel',

	layout: 'fit',

	initComponent: function () {

		if (this.title)
			Ext.apply(this, {
				tools: [{
					type: 'maximize',
					tooltip: 'Open in new Tab',
					scope: this,
					handler: function (event, toolEl, panel) {
						window.open(this.url);
					}
				}]
			});

		Ext.apply(this, {
			iframeTpl: new Ext.Template('<iframe width="100%" height="100%" frameborder="0" src="{url}" />'),
			collapseFirst: false
		});

		this.callParent(arguments);
	},

	showDemoInfo: function (sourceUrl) {
		this.url = sourceUrl;
		this.update(this.iframeTpl.apply({ url: Dextop.absolutePath(sourceUrl) }));
	}
});