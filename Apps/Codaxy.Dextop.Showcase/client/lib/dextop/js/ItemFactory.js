/* 
ItemFactory is used to easily access and override server generated JS code. 
*/

Ext.define('Dextop.ItemFactory', {

	itemOverrides: {},

	//used as static method to override items, as nested classes are usually not visible
	overrideItems: function (data) {
		Dextop.applyRecursive(this.itemOverrides, data);
	},

	//virtual
	getDictionary: function (options) {
		return undefined;
	},

	getItems: function (options) {
		options = options || {};
		var copy = Ext.merge(this.getDictionary(options), this.itemOverrides, options.apply);
		return this.buildItems(copy);
	},

	//abstract
	buildItems: function (dict) {
		throw 'Dextop.ItemFactory.buildItems method is abstract and therefore it should be overriden.';
	}
});
