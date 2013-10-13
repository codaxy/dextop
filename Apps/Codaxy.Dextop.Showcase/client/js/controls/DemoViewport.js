Ext.ns('Showcase');

//Ext.require([
//    'Showcase.DemoExplorerPanel',
//    'Showcase.DemoDetails',
//	'Showcase.DemoFilterPanel',
//	//'Showcase.GuidesTreePanel'
//]);

Ext.define('Showcase.DemoViewport', {
	extend: 'Ext.Viewport',

	session: null,
	demoStore: null,
	guideStore: null,
	baseCls: 'viewport',	

	initComponent: function () {
		var explorer = Ext.create('Showcase.DemoExplorerPanel', {
			region: 'center',
			store: this.demoStore,
			session: this.session,
			viewport: this,
			flex: 2
		});

		var details = Ext.create('Showcase.DemoDetails', {
			region: 'west',
			title: 'Overview',
			split: true,
			collapsible: true,
			session: this.session,
			flex: 0.7,
			tbar: [{
				iconCls: 'back',
				text: 'Back to Demos',
				scope: this,
				handler: function () {
					this.expandDemos();
				}
			}, '-', {
				iconCls: 'launch',
				text: 'Launch',
				scope: this,
				handler: function () {
					this.session.launchSelectedDemo();
				}
			}]
		});

		var js = Ext.create('Showcase.DemoDetails', {
			region: 'east',
			title: 'Ext JS (client)',
			flex: 1,
			split: true,
			collapsible: true
		});

		var cs = Ext.create('Showcase.DemoDetails', {
			region: 'center',
			title: 'C# (server)',
			flex: 1
		});

		var about = Ext.create('Showcase.DemoDetails', {});
		about.showDemoInfo(this.session.aboutPageUrl);

		var filter = Ext.create('Showcase.DemoFilterPanel', {
			region: 'west',
			store: this.demoStore,
			session: this.session,
			viewport: this,
			//collapsible: true,
			margin: '0 2 0 0',
			width: 155
		});

		var guideDetails = Ext.create('Showcase.DemoDetails', {
			region: 'center',
			flex: 1
		});

		var guidesTree = Ext.create('Showcase.GuidesTreePanel', { 
			session: this.session,
			region: 'west',
			split: true,
			store: this.guideStore,		
			width: 300,
			detailsPanel: guideDetails
		});

		Ext.apply(this, {
			details: details,
			cs: cs,
			js: js,
			guideDetails: guideDetails,
			layout: 'border',
			items: {
				region: 'center',
				layout: 'accordion',
				itemId: 'accordion',
				items: [{
					title: 'Demos',
					itemId: 'demos',
					iconCls: 'launch',
					layout: 'border',
					bodyStyle: 'padding: 5px',
					items: [explorer, filter]
				}, {
					title: 'Summary & Code',
					itemId: 'source',
					iconCls: 'code',
					bodyStyle: 'padding: 5px',
					layout: 'border',
					items: [details, cs, js]
				}, {
					title: 'Guides',
					itemId: 'guides',
					iconCls: 'article',
					layout: 'border',
					bodyStyle: 'padding: 5px',
					items: [guidesTree, guideDetails]

				}, {
					title: 'About',
					iconCls: 'about',
					layout: 'fit',
					items: about
				}]
			}			
		});

		this.callParent(arguments);
	},

	showDemoInfo: function (sourceUrlBase, cacheBuster) {
		this.details.showDemoInfo(sourceUrlBase + ".html?cb=" + cacheBuster);
		this.js.showDemoInfo(sourceUrlBase + ".js.html?cb=" + cacheBuster);
		this.cs.showDemoInfo(sourceUrlBase + ".cs.html?cb=" + cacheBuster);
	},
	
	showGuide: function(url) {
		this.guideDetails.showDemoInfo(url)		
	},

	getSorters: function () {
		var me = this;
		var buttons = this.query('toolbar button');
		var sorters = [];
		Ext.Array.each(buttons, function (button) {
		    if (button.sortData) {
		        sorters.push(Ext.apply({
		            transform: me.getSorterTransform(button.sortData.property)
		        }, button.sortData));
		    }
		});
		return sorters;
	},

	getSorterTransform: function (field) {
		switch (field) {
			case 'level': return Showcase.model.Demo.transformLevel;
			default: return undefined;
		}
	},

	expandSourcePanel: function () {
		this.getComponent('accordion').getComponent('source').expand();
	},

	expandDemos: function () {
		this.getComponent('accordion').getComponent('demos').expand();
	},
	
	expandGuides: function () {
		this.getComponent('accordion').getComponent('guides').expand();
	}
});
