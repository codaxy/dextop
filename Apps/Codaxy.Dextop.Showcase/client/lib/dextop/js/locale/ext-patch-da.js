Ext.onReady(function () {

	Dextop.localize('Ext.view.View', {
		emptyText: ''
	});

	if (Ext.Date)
		Ext.apply(Ext.Date, {
			defaultFormat: 'd/m/Y'
		});

	Dextop.localize('Ext.form.field.Date', {
		format: 'd/m/Y',
		altFormats: "d/m/Y|j/n/Y|j/n/y|j/m/y|d/n/y|j/m/Y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|j|Y-n-j|j-n|j/n"
	});

	Dextop.localize('Ext.form.field.Number', {
	    decimalSeparator: ',',
	    thousandSeparator: '.'
	});

	Dextop.localize('Ext.form.field.Time', {
		format: 'H:i'
	});
});