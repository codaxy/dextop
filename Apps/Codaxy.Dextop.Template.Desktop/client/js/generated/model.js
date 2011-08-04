Ext.define('Desktop.window.GridWindow.model.Model',
{
	extend: 'Ext.data.Model',
	fields: [{
		name: 'Id',
		type: 'int',
		useNull: true
	}, {
		name: 'FirstName',
		type: 'string',
		useNull: true
	}, {
		name: 'LastName',
		type: 'string',
		useNull: true
	}, {
		name: 'CompanyName',
		type: 'string',
		useNull: true
	}],
	idProperty: 'Id'
});
