Ext.ns('Showcase');

Ext.define('Showcase.DemoFilterPanel', {
	extend: 'Ext.Panel',
	
	//title: 'Demos',
	
	store: null,	
	viewport: null,
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	currentFilter: {},
	cbGroups: {},
		
	createCbGroup: function(group) {
		var cbs =[];
		
		cbs.push(Ext.create('Ext.form.Checkbox', {
			boxLabel: 'All',
			checked: true,
			scope: this,
			listeners: {
				'change': this.selectAll,
				scope: this
			},
			// custom:
			group: group
		}));
		
		for (var selector in this.currentFilter[group])
			cbs.push(Ext.create('Ext.form.Checkbox', {
				xtype: 'checkbox',
				boxLabel: selector,
				checked: this.currentFilter[group][selector],
				scope: this,
				listeners: {
					'change': this.selectFeature,
					scope: this
				},
				// custom:
				group: group,
				selector: selector
			}));
		
		return cbs;
	},
	
	initializeCurrentFilter: function(config) {
		for (var group in config) {
			this.currentFilter[group] = {}; 	
			for (var i = 0; i < config[group].length; i++) {
				var selector = config[group][i];
				this.currentFilter[group][selector] = true;
			}
		}
	},
	
	selectAll: function(cb, value) {
		var cbGroup = this.cbGroups[cb.group];
		for (var i = 1; i < cbGroup.length; i++) { // Skip 'All'
			cbGroup[i].suspendEvents(false); // Don't trigger the onvaluechange event
			cbGroup[i].setValue(value);
			cbGroup[i].resumeEvents();
			this.currentFilter[cb.group][cbGroup[i].selector] = value; // ...but filter the store by hand
		}  
		this.filterStore(); 
	},
	
	selectFeature: function(cb, value) {
		if (!value) {
			var cbAll = this.cbGroups[cb.group][0];
			cbAll.suspendEvents(false);
			cbAll.setValue(false);
			cbAll.resumeEvents();
		}
			
		this.currentFilter[cb.group][cb.selector] = value;
		this.filterStore();		
	},
	
	filterStore: function() {
		var search = this.getComponent('searchBox').getValue().toLowerCase();
		this.store.filterBy(function(record, id) {
			var cf = this.currentFilter;
			var match = true;
			var title = record.get('title');
			if (search && title && title.toLowerCase().indexOf(search)==-1)
				return false;
			for (var group in cf) {
				var selector = record.get(group);
				if (!selector) continue; // e.g. demo does not belong to any topic
				match &= cf[group][selector];
			}
			return match;
		}, this);
	},
	
	initComponent: function() 
	{
		this.initializeCurrentFilter({
			'topic': Showcase.Topics,
			'category': Showcase.Categories,
			'level': Showcase.Levels
		});
		
		this.cbGroups = {
			'topic':  this.createCbGroup('topic'),
			'level':  this.createCbGroup('level'),
			'category':  this.createCbGroup('category')
		};
		
		Ext.apply(this, {
			defaults: {
				margin: '2 2 2 2'
			},
			items: [{
				xtype: 'fieldset',
				title: 'Click Options',
				items: [{
					xtype: 'checkbox',
					boxLabel: 'Auto Launch',
					checked: true,					
					listeners: {
						scope: this,
						'change': function (check, checked) {
							Dextop.getSession().autoLaunch = checked;
						}
					}						
				}, {
					xtype: 'checkbox',
					boxLabel: 'Show Source',
					checked: true,						
					listeners: {
						scope: this,
						'change': function (check, checked) {
						    Dextop.getSession().autoShowSource = checked;
						}
					}							
				}]
			}, {
				xtype: 'container',
				layout: 'hbox',
				items: [{
					xtype: 'button',
					text: 'Launch',
					iconCls: 'launch',
					margin: '0 1 0 0',
					flex: 1,
					scope: this,
					handler: function () {
					    Dextop.getSession().launchSelectedDemo();
					}
				}, {
					iconCls: 'code',
					xtype: 'button',
					text: 'Source',
					margin: '0 0 0 1',					
					flex: 1,
					scope: this,
					handler: function () {
						this.viewport.expandSourcePanel();
					}
				}]
			}, {
				xtype: 'textfield',
				fieldLabel: 'Search',
				labelAlign: 'top',
				emptyText: 'Type demo name here',
				anchor: '0',
				itemId: 'searchBox',
				listeners: {
					scope: this,
					'change': function () {
						this.filterStore();
					}
				}	
			}, {
				xtype: 'fieldset',
				title: 'Topic Filter',
				items: this.cbGroups['topic']
			}, {
				xtype: 'fieldset',
				title: 'Level Filter',
				items: this.cbGroups['level']
			}, {
				xtype: 'fieldset',
				title: 'Category Filter',
				items: this.cbGroups['category']
			}]
		});
		
		this.callParent(arguments);
	} 
});
