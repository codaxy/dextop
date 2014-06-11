Ext.ns('Showcase');

Ext.require([
    'Ext.data.Store',        
	'Showcase.DemoViewport'
]);

Ext.define('Showcase.model.Demo', {
	extend: 'Ext.data.Model',
    fields: [
    	{ name: 'id' },
        { name: 'title' },
        { name: 'description' },
        { name: 'topic' },
        { name: 'level' },
        { name: 'category' },
        { name: 'clientLauncher' },
		{ name: 'sourceUrlBase' }
    ],
    idProperty: 'id',
	
	statics: {
		transformLevel: function(v) { 
			switch (v) {
				case 'Beginner':
					return 0;
				case 'Medium':
					return 1;
				case 'Advanced':
					return 2;
				default:
					return 100; 
			}
	    }		
	}
});

Ext.define('Showcase.model.Guide', {
	extend: 'Ext.data.Model',
    fields: ['id', 'text', 'url'],
    idProperty: 'id'	
});


Ext.define('Showcase.demos.Launcher', {
	constructor: function(config) {
		Ext.apply(this, config);
		this.callParent(arguments);
	}
});

Ext.define('Showcase.Session', {

	extend: 'Dextop.Session',

	autoLaunch: true,
	autoShowSource: true,

	initSession: function () {
		this.callParent(arguments);

		var demoStore = this.demoStore = Ext.create('Ext.data.JsonStore', {
			model: 'Showcase.model.Demo',
			sorters: [{
				property: 'level',
				direction: 'ASC',
				transform: Showcase.model.Demo.transformLevel
			}],
			data: Showcase.Demos,
			sortOnLoad: true,
			sortOnFilter: true
		});

		var guideStore = this.guideStore = Ext.create('Ext.data.TreeStore', {
			model: 'Showcase.model.Guide',
			proxy: {
				type: 'memory',
				data: Showcase.Guides
			},
			root: {
				id: 'articles',
				expanded: true
			}
		});

		this.viewport = Ext.create('Showcase.DemoViewport', {
			demoStore: demoStore,
			guideStore: guideStore,			
			renderTo: Ext.getBody()
		});

		Ext.History.init();

		Ext.History.on('change', function (token) {
			this.processUrlToken(token);
		}, this);

		this.processUrlToken(Ext.History.getHash());
	},
	
	processUrlToken: function(token) {
		if (!token || token == this.currentToken)
			return;		
		if (token.substring(0, 6) == 'guide:') {
			this.selectGuideById(token.substring(6));			
		} else
			this.selectDemoById(token);				
	},
	
	addUrlToken: function(token) {
		this.currentToken = token;
		Ext.History.add(token);		
	},

	selectDemoById: function (id) {
		var rec = this.demoStore.getById(id);		
		if (rec)
			this.selectDemo(rec);
	},
	
	selectGuideById: function(id) {
		var rec = this.guideStore.getNodeById(id);
		if (rec)
			this.selectGuide(rec);		
	},

	selectDemo: function (demo) {
		this.demo = demo;
		this.viewport.showDemoInfo(demo.get('sourceUrlBase'), demo.get('cacheBuster'));
		this.addUrlToken(demo.get('id'));
		if (this.autoLaunch)
			this.launchSelectedDemo();

		if (this.autoShowSource)
			this.viewport.expandSourcePanel();
	},
	
	selectGuide: function(guide) {		
		this.viewport.showGuide(guide.raw.url);
		this.addUrlToken('guide:'+guide.get('id'));		
		this.viewport.expandGuides();
	},

	launchSelectedDemo: function () {
		if (this.demo)
			this.launchDemo(this.demo.get('id'), this.demo.get('clientLauncher'));
	},

	launchDemo: function (id, client) {
		var remoteId;
		if (client) {
			var launcher = Ext.create('Showcase.demos.Launcher.' + id, {});
			launcher.launch();
		} else
			this.remote.CreateDemoWindow(id, remoteId, {
				type: 'alert',
				success: function (result) {
					var win = Dextop.create(result);
					win.show();
				}
			});
	}
});