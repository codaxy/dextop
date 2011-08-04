Ext.define('Desktop.window.GridWindow.columns.Model', {
	extend: 'Dextop.ItemFactory',
	getDictionary: function(){
		var dict = {};
		dict["FirstName"] = {
			text: this.FirstNameText,
			flex: 1,
			dataIndex: 'FirstName',
			type: 'string'
		};
		dict["LastName"] = {
			text: this.LastNameText,
			flex: 1,
			dataIndex: 'LastName',
			type: 'string'
		};
		dict["CompanyName"] = {
			text: this.CompanyNameText,
			flex: 1,
			dataIndex: 'CompanyName',
			type: 'string'
		};
		return dict;

	},
	buildItems: function(dict){
		return [dict['FirstName'], dict['LastName'], dict['CompanyName']];
	},
	FirstNameText: 'FirstName',
	LastNameText: 'LastName',
	CompanyNameText: 'CompanyName'
});
