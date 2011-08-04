Ext.define('Desktop.window.GridWindow', {
    extend: 'Dextop.Window',
    width: 500,
    height: 300,

    title: 'Grid Window',
	iconCls: 'icon-grid',

    initComponent: function () {

        var grid = Ext.create('Dextop.ux.SwissArmyGrid', {
            remote: this.remote,
            paging: true,
            border: false,
            editing: 'row',
            tbar: ['add', 'edit', 'remove'],
            storeOptions: {
                pageSize: 10,
                autoLoad: true,
                autoSync: true
            }
        });

        Ext.apply(this, {
            layout: 'fit',
            items: grid
        });

        this.callParent(arguments);
    }
});