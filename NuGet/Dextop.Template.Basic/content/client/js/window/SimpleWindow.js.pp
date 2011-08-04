Ext.define('$rootnamespace$.window.SimpleWindow', {
    extend: 'Dextop.Window',
    width: 400,
    height: 350,

    title: 'Simple Window',

    initComponent: function () {

        Ext.apply(this, {
            layout: 'fit',
			html: 'You made it.'
        });

        this.callParent(arguments);
    }
});