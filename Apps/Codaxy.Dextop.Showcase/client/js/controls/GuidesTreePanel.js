Ext.define('Showcase.GuidesTreePanel', {
	extend: 'Ext.tree.Panel',
	rootVisible: false,
	detailsPanel: null,
	bodyCls: 'guides-tree',

	initComponent: function () {

		Ext.apply(this, {
			listeners: {
				scope: this,
				'itemclick': function (view, record, item) {					
					this.session.selectGuide(record);
				}
			}
		});

		this.callParent();
	}
});
