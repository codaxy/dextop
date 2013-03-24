Ext.ns('Showcase');

Ext.require([
	'Showcase.DemoDataView',
    //'Ext.multisort.SortButton',
	'Ext.ux.BoxReorderer'	
]);

Ext.define('Showcase.DemoExplorerPanel', {
	extend: 'Ext.Panel',

	store: null,
	session: null,
	viewport: null,

	//title: 'Demo Explorer',

	layout: 'border',

	createSorterButtonConfig: function(config) {
	    config = config || {};
	    Ext.applyIf(config, {
	        listeners: {
                scope: this,
	            click: function(button, e) {
	                this.changeSortDirection(button, true);
	            }
	        },
	        iconCls: 'direction-' + config.sortData.direction.toLowerCase(),
	        reorderable: true,
	        xtype: 'button'
	    });
	    return config;
	},

	changeSortDirection: function(button, changeDirection) {
	    var sortData = button.sortData,
            iconCls  = button.iconCls;
        
	    if (sortData) {
	        if (changeDirection !== false) {
	            button.sortData.direction = Ext.String.toggle(button.sortData.direction, "ASC", "DESC");
	            button.setIconCls(Ext.String.toggle(iconCls, "direction-asc", "direction-desc"));
	        }
	        
	        this.doSort();
	    }
	},

	doSort: function() {
	    this.dataview.store.sort(this.viewport.getSorters());
	},

	initComponent: function () {
		var dataview = this.dataview = Ext.create('Showcase.DemoDataView', {
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
			                this.doSort();
			            }
			        }
			    }),			    
			    items: [this.createSorterButtonConfig({
			        xtype: 'button',
			        text: 'Level',
			        sortData: {
			            property: 'level',
			            direction: 'ASC'
			        }
			    }), this.createSorterButtonConfig({
			        xtype: 'button',
			        text: 'Topic',
			        sortData: {
			            property: 'topic',
			            direction: 'ASC'
			        }
			    }), this.createSorterButtonConfig({
			        xtype: 'button',
			        text: 'Category',
			        sortData: {
			            property: 'category',
			            direction: 'ASC'
			        }
			    }), this.createSorterButtonConfig({
			        xtype: 'button',
			        text: 'Title',
			        sortData: {
			            property: 'title',
			            direction: 'ASC'
			        }
			    })]
			})
		});

		this.callParent(arguments);
	}
});
