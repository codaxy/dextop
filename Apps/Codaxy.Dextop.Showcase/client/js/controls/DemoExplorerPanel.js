Ext.ns('Showcase');

Ext.require([
	'Showcase.DemoDataView',
    'Ext.multisort.SortButton',
	'Ext.ux.BoxReorderer'	
]);

Ext.define('Showcase.DemoExplorerPanel', {
	extend: 'Ext.Panel',

	store: null,
	session: null,
	viewport: null,

	//title: 'Demo Explorer',

	layout: 'border',

	initComponent: function () {
		var dataview = Ext.create('Showcase.DemoDataView', {
			store: this.store,
			session: this.session,
			region: 'center',
			layout: 'fit',
			border: false,
			style: 'background: white'
		});

		Ext.apply(this, {			
			items: dataview,

			tbar: Ext.create('Ext.toolbar.Toolbar', {
				plugins: Ext.create('Ext.ux.BoxReorderer', {
					listeners: {
						scope: this,
						drop: function () {
							this.store.sort(this.viewport.getSorters());
						}
					}
				}),
				defaults: {
					listeners: {
						scope: this,
						changeDirection: function () {
							this.store.sort(this.viewport.getSorters());
						}
					}
				},
				items: [{
					xtype: 'sortbutton',
					text: 'Level',
					dataIndex: 'level'
				}, {
					xtype: 'sortbutton',
					text: 'Topic',
					dataIndex: 'topic'
				}, {
					xtype: 'sortbutton',
					text: 'Category',
					dataIndex: 'category'
				}, {
					xtype: 'sortbutton',
					text: 'Title',
					dataIndex: 'title'
				}]
			})
		});

		this.callParent(arguments);
	}
});
