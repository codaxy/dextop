Ext.define('Ext.ux.grid.plugin.ActionManager',{	
	 
	constructor: function(config) {		
		
		this.actions = [];
		this.keyActions = [];
		
		config = config || {};
		
		Ext.applyIf(config, {
			bindContextMenu: true,
			clearSelection: true
		});		
		
		if (config.actions) {
			this.add(config.actions);
			delete config.actions;
		}
		
		Ext.apply(this, config);
	},
		
	init: function(grid) {
		this.grid = grid;		
		grid.mon(grid.getSelectionModel(), 'selectionchange', this.onSelectionChanged, this);
		grid.mon(grid.store, 'load', this.onSelectionChanged, this);
		if (this.bindContextMenu) {
			grid.mon(grid, 'containercontextmenu', this.onContextMenu, this);
			grid.mon(grid, 'itemcontextmenu', this.onCellContextMenu, this);				
		}
		this.initKeyMap();		
	},
	
	initKeyMap: function() {
		
		if (!this.keyActions.length || this.keyMap)
			return;		
		
		if (!this.grid.rendered)
		{
			this.grid.on('render', this.initKeyMap, this);
			return;
		}
		
		this.keyMap = this.grid.el.addKeyMap(this.keyActions);
		delete this.keyActions;				
	},
	
	onSelectionChanged: function() {
		var count = this.grid.getSelectionModel().getCount();
		for (var i = 0; i<this.actions.length; i++) {
			var action = this.actions[i];
			if (action.setDisabled && action.initialConfig) {				
				if (action.initialConfig.enableOnMulti)
					action.setDisabled(count==0);
				else if (action.initialConfig.enableOnSingle)
					if (count!=1)
						action.setDisabled(true);
					else if (typeof action.initialConfig.enableOnSingle === 'function')
						action.setDisabled(!action.initialConfig.enableOnSingle(this.grid.getSelectionModel().getSelection()[0]));
					else
						action.setDisabled(false);					
			}
		}
	},
	
	add: function(action) {
		if (!action)
			return action;
			
		if (Ext.isArray(action)) {
			var res = [];
			for(var i = 0; i<action.length; i++)
				res.push(this.add(action[i]));
			return res;
		}
		
		if (action.setDisabled)
			this.actions.push(action);
		else if (typeof action === 'string')
			this.actions.push(action);
		else 
			this.actions.push(action = new Ext.Action(action));
			
		if (action.initialConfig && action.initialConfig.key) {			
			var ka = {
				key: action.initialConfig.key,
				shift: action.initialConfig.shift,
				ctrl: action.initialConfig.ctrl,
				alt: action.initialConfig.alt,
				handler: function() { 
					if (action.isDisabled()) 
						return; 
					action.execute(); 
				}
			};
			if (this.keyMap)
				this.keyMap.addBinding(ka);
			else 
				this.keyActions.push(ka);
		}
		
		return action;
	},
	
	onCellContextMenu: function(view, record, item, row, e) {		
		this.grid.getSelectionModel().select(row);
		this.showContextMenu(e, false);
		e.stopEvent();		
	},
	
	onContextMenu: function(view, e) {		
		Ext.defer(this.showContextMenu, 10, this, [e, this.clearSelection]);		
		e.stopEvent();
	},
	
	showContextMenu: function(e, deselect) {
		if (!this.contextMenu)
			this.contextMenu = new Ext.menu.Menu(Ext.apply({				
				items: this.getContextMenuActions()			
			}, this.contextMenuConfig));
		if (this.contextMenu.hidden) {	
			if (deselect)
				this.grid.getSelectionModel().clearSelections();		
			var xy = e.getXY();		
			this.contextMenu.showAt(xy);
		}
	},
	
	getActions: function() { return this.actions; },
	
	getContextMenuActions: function() { 
		var res = [];
		for (var i = 0; i<this.actions.length; i++) {
			if (this.actions[i] === '->')
				res.push('-');
			else
				res.push(this.actions[i]);
		}
		return res; 
	}	
	
});
