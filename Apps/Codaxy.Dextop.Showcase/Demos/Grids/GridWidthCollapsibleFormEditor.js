Ext.ns('Showcase');

Ext.define('Showcase.demos.GridWidthCollapsibleFormEditor', {
    extend: 'Dextop.Window',
    width: 700,
    height: 400,
    maximizable: true,
    minimizable: true,
    listeners: {
        "minimize": function( window, opts ) {
            window.collapse();
            window.setWidth( 150 );
            window.alignTo( Ext.getBody(), 'bl-bl')
        }                 
    },
    tools: [
        {  
            type: 'restore',
            handler: function( evt,toolEl,owner,tool ) {
                var window = owner.up( 'window' );
                window.setWidth( 700 );   
                window.expand('',false);
                window.center(); 
            }                                
        }                            
    ],

    title: 'Grid + Collapsible Form Editor',
    store: undefined,    

    initComponent: function () {                               
        this.store = this.remote.createStore('model', {
            autoLoad: true,
            autoSync: true,
            remoteFilter: true,
            remoteSort: true
        });
        var remotable = this.remote;
        var filterStore = this.store;
        var window = this;
        var columns = this.remote.createGridColumns('model', {
            remote: this.remote,
            checkEditor: false
        });

        var rowEditor = new Ext.grid.plugin.RowEditing({
            clicksToEdit: 1,
            listeners: {
                beforeedit: function (editor, e, eOpts) {
                    Ext.getCmp('regionEast').removeAll();
                    Ext.getCmp('regionEast').add(window.createEditForm(e.record, false));
                    Ext.getCmp('regionEast').expand();                    
                    return false;
                }
            }
        });        

        var topBar = Ext.create('Ext.toolbar.Toolbar', {
            id: 'topBar',
            enableOverflow: true,
            items: [
                {
                    xtype: 'button',
                    iconCls: 'add',
                    text: 'Add',
                    scope: this,
                    handler: function () {                        
                        var rec = Ext.create(this.store.model, {});                        
                        Ext.getCmp('regionEast').removeAll();
                        Ext.getCmp('regionEast').add(window.createEditForm(rec, true));
                        Ext.getCmp('regionEast').expand();
                    }
                },
                { xtype: 'tbspacer', width: 5 },
                {
                    xtype: 'button',
                    iconCls: 'remove',
                    text: 'Remove',
                    scope: this,
                    handler: function () {
                        var s = grid.getSelectionModel().getSelection();
                        for (var i = 0; i < s.length; i++) {
                            this.store.remove(s[i]);
                        }                        
                        var rec = Ext.create(this.store.model, {});
                        Ext.getCmp('regionEast').removeAll();
                        Ext.getCmp('regionEast').add(window.createEditForm(rec, true));
                        Ext.getCmp('regionEast').collapse();
                    }
                }
            ]
        });

        var bottomBar = Ext.create('Ext.toolbar.Toolbar', {
            id: 'bottomBar',
            enableOverflow: true,
            items: [
                'Filters:',
                { xtype: 'tbspacer', width: 5 },
                {
                    xtype: 'textfield',                    
                    enableKeyEvents: true,
                    id: 'filterName',
                    emptyText: '(Name)',
                    listeners: {
                        keyup: function (field) {                            
                            filterStore.clearFilter(true);
                            filterStore.filter([{
                                property: 'name',
                                value: field.getValue()
                            }]);
                        },
                        delay: 200 //time delay
                    }
                },
                { xtype: 'tbspacer', width: 5 },
                {
                    xtype: 'numberfield',
                    hideTrigger: true,
                    enableKeyEvents: true,
                    id: 'filterAge',                    
                    emptyText: '(Age)',
                    width: 40,
                    listeners: {                        
                        keyup: function (field) {                                                                                    
                            filterStore.clearFilter(true);
                            filterStore.filter([{
                                property: 'age',
                                value: field.getValue()
                            }]);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: 'X',
                    tooltip: 'Clear all filters',
                    handler: function () {
                        Ext.getCmp('filterName').reset();
                        Ext.getCmp('filterAge').reset();
                        filterStore.clearFilter();                        
                    }
                }
            ]
        });

        var grid = Ext.create('Ext.grid.GridPanel', {
            id: 'grid',
            store: this.store,
            columns: columns,
            plugins: [rowEditor],
            border: true,
            tbar: topBar,
            bbar: bottomBar
        });

        var rootPanel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            id: 'rootPanel',
            items: [
                {
                    title: 'Details',
                    region: 'east',
                    id: 'regionEast',
                    margins: '5 5 5 0',
                    width: 300,
                    split: true,
                    collapsed: true,
                    collapsible: true,                    
                },
                {
                    title: 'People',
                    region: 'center',
                    id: 'regionCenter',
                    xtype: 'panel',
                    layout: 'fit',
                    margins: '5 5 5 5',
                    items: grid
                }]
        });

        var rec = Ext.create(this.store.model, {});
        Ext.getCmp('regionEast').removeAll();
        Ext.getCmp('regionEast').add(window.createEditForm(rec, true));

        Ext.apply(this, {
            layout: 'fit',
            items: rootPanel
        });

        this.callParent(arguments);
    },    

    createEditForm: function (record, insert) {
        var window = this;
        var formFields = Ext.create('Showcase.demos.GridWidthCollapsibleFormEditor.form.GridModel').getItems({
            remote: this.remote,
            data: record.data
        });

        var formButtons = [{
            text: 'Save',
            formBind: true,
            scope: this,
            handler: function () {
                Ext.getCmp('editForm').getForm().updateRecord(record);
                if (insert) {
                    var index = this.store.getCount();
                    this.store.insert(index, record);
                }                                
                var rec = Ext.create(this.store.model, {});
                Ext.getCmp('regionEast').removeAll();
                Ext.getCmp('regionEast').add(window.createEditForm(rec, true));
                Ext.getCmp('regionEast').collapse();
            }
        }, {
            text: 'Cancel',
            formBind: true,
            scope: this,
            handler: function () {
                var rec = Ext.create(this.store.model, {});
                Ext.getCmp('regionEast').removeAll();
                Ext.getCmp('regionEast').add(window.createEditForm(rec, true));
                Ext.getCmp('regionEast').collapse();
            }
        }];

        var editForm = Ext.create('Ext.form.Panel', {
            id: 'editForm',
            border: false,
            bodyPadding: 10,
            autoScroll: true,
            items: formFields,
            buttonAlign: 'center',
            buttons: formButtons
        });

        return editForm;
    },
});
