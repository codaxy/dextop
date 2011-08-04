Ext.ns('Dextop');

/* ItemFactory is used to easily override/complete server generated js. 
 */

Ext.define('Dextop.ItemFactory', {
	
	overrides: undefined,
	
	override: function(data) {		
		this.overrides = Dextop.applyRecursive(this.overrides || {}, data);	
	},
	
	//virtual
	getDictionary: function(options) {
		return undefined;
	},
	
	getItems: function(options) {
		options = options || {};
		var copy = Ext.merge({}, this.getDictionary(options), this.overrides, options.apply);		
		return this.buildItems(copy);
	},
	
	//abstract
	buildItems: function(dict) {
		throw 'Dextop.ItemFactory.buildItems method is abstract and therefore should be overriden.';
	}	
});
