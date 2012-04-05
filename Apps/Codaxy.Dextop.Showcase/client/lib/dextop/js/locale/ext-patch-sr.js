Ext.onReady(function () {

	Dextop.localize('Ext.view.View', {
		emptyText: ''
	});

	if (Ext.Date)
		Ext.apply(Ext.Date, {
			defaultFormat: 'd.m.Y'
		});

	Dextop.localize('Ext.form.field.Number', {
		decimalSeparator: ','
	});
});