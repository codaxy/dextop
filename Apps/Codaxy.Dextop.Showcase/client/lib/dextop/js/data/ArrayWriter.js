/**
 * @author Marko Stijak
 * @class Ext.data.Writer
 * @extends Object
 * 
 * Class for encoding record data into an array...
 * 
 * @constructor
 * @param {Object} config Optional config object
 */
Ext.define('Ext.data.Writer', {
	alias: 'writer.array',

	constructor: function (config) {
		Ext.apply(this, config);
	},

	/**
	* Formats the data for each record before sending it to the server. This
	* method should be overridden to format the data in a way that differs from the default.
	* @param {Object} record The record that we are writing to the server.
	* @return {Object} An object literal of name/value keys to be written to the server.
	* By default this method returns the data property on the record.
	*/
	getRecordData: function (record) {
		var fields = record.fields,
            data = [];

		for (var i = 0; i < fields.getCount(); i++) {
			var v = record.get(fields.getAt(i).name);
			data[i] = Ext.isDefined(v) ? v : null;
		}

		return data;
	}
});
