Ext.ns('Showcase');

Ext.define('Showcase.demos.TreeWindow', {
    extend: 'Dextop.Window',
    width: 500,
    height: 300,

    title: 'Tree Window',
    requires: 'Ext.tree.*',

    initComponent: function () {

        var url = this.remote.getAjaxUrl();

        var store = new Ext.data.TreeStore({
            proxy: {
                type: 'ajax',
                url: url
            },
            root: {
                text: 'root',
                id: '',
                expanded: true
            }
        });


        var tree = new Ext.tree.TreePanel({
            store: store
        });

        Ext.apply(this, {
            layout: 'fit',
            items: tree
        });

        this.callParent(arguments);

    }
});
