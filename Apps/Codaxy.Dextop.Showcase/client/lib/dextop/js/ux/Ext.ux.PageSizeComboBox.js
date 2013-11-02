Ext.define('Ext.ux.PageSizeComboBox', {
	extend: 'Ext.form.ComboBox', 
	alias: ['widget.pagesizecombo'],

    allText: 'All',
	
	constructor: function(config) {		
		
		if (!config.store) 
			throw 'PageSizeComboBox: target store not set.';			
						
		config.targetStore = config.store;
		config.value = config.targetStore.pageSize;

		var storeData = [];
		var pageSizes = config.pageSizes || [5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100];
		
		for (var i = 0; i < pageSizes.length; i++) {
		    if (pageSizes[i] > 0)
		        storeData.push([pageSizes[i], pageSizes[i]]);
		    else
		        storeData.push([pageSizes[i], this.allText]);
		}
		
		config.store = Ext.create('Ext.data.ArrayStore', {
			fields: ['id', 'text'],
			data: storeData
		});		
		
		Ext.apply(config, {
			valueField: 'id',
			displayField: 'text',
			disableKeyFilter: true,
			editable: false,
			queryMode: 'local',
			width: 50,
			listeners: {
				scope: this,
				'select': function(combo, rec) {
				    var pageSize = rec[0].get('id');
				    if (pageSize < 1)
				        pageSize = 10000000;

					var index = (this.targetStore.currentPage - 1) * this.targetStore.pageSize;
					this.targetStore.pageSize = pageSize || 5;
					var page = Math.floor((index / pageSize) + 1);
					if (!page || page<1)
						page = 1;
					this.targetStore.loadPage(page);
				}
			}
		});
		
		this.callParent(arguments);
	}
});
