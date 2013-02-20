Ext.ns('Showcase');

Ext.define('Showcase.demos.GridWithCollapsibleFormEditor', {
    extend: 'Dextop.Window',
    width: 700,
    minWidth: 700,
    height: 400,
    minHeight: 400,    
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
        this.createStore();

        Ext.apply(this, {
            layout: 'fit',
            items: this.createRootPanel()
        });

        this.callParent(arguments);
    },    

    actions: function (action) {
        var grid = Ext.getCmp('grid');
        var form = Ext.getCmp('editForm').getForm();
        var button = Ext.getCmp('saveOrUpdateButton');
        var regionEast = Ext.getCmp('regionEast');
        var selectedRecord = grid.getSelectionModel().getSelection()[0];        

        switch (action) {
            case 'add':
                this.resetForm();
                regionEast.expand();
                break;
            case 'remove':
                regionEast.collapse();
                this.store.remove(selectedRecord);
                this.resetForm();                
                break;
            case 'read':                
                button.setText('Update');                
                form.loadRecord(selectedRecord);
                regionEast.expand();
                break;
            case 'save':
                regionEast.collapse();
                form.updateRecord();
                if (button.text == 'Save') {
                    var index = this.store.getCount();
                    this.store.insert(index, form.getRecord());
                }
                this.resetForm();                
                break;
            case 'cancel':
                regionEast.collapse();
                this.resetForm();                
                break;
        }
    },

    createForm: function () {
        var window = this;        

        var formFields = Ext.create('Showcase.demos.GridWithCollapsibleFormEditor.form.GridModel').getItems({
            remote: this.remote            
        });

        var editForm = Ext.create('Ext.form.Panel', {
            id: 'editForm',
            border: false,
            layout: 'anchor',
            bodyPadding: 10,
            items: formFields,
            buttonAlign: 'center',
            buttons: window.createFormButtons()
        });

        editForm.getForm().reset();
        editForm.getForm().loadRecord(Ext.create(this.store.model, {}));

        return editForm;
    },

    createFormButtons: function () {
        var window = this;

        var formButtons = [{
            text: 'Save',
            id: 'saveOrUpdateButton',
            formBind: true,
            scope: this,
            handler: function () {
                window.actions('save');
            }
        }, {
            text: 'Cancel',
            formBind: true,
            scope: this,
            handler: function () {
                window.actions('cancel');
            }
        }];

        return formButtons;
    },

    createGrid: function () {
        var window = this;
        var store = this.store;

        var columns = this.remote.createGridColumns('model', {
            remote: this.remote
        });

        var grid = Ext.create('Ext.grid.GridPanel', {
            id: 'grid',
            store: store,
            columns: columns,
            border: true,
            tbar: window.createGridTopBar(),
            bbar: window.createGridBottomBar(),
            listeners: {
                select: function () {
                    window.actions('read');
                }
            }
        });

        return grid;
    },

    createGridBottomBar: function () {
        var store = this.store;

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
                        keyup: {
                            fn: function (field) {                                
                                store.clearFilter(true);
                                store.filter([{
                                    property: 'name',
                                    value: field.getValue()
                                }]);
                            },
                            buffer: 200
                        }
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
                            store.clearFilter(true);
                            store.filter([{
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
                        store.clearFilter();
                    }
                }
            ]
        });

        return bottomBar;
    },

    createGridTopBar: function () {
        var window = this;

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
                        window.actions('add');
                    }
                },
                { xtype: 'tbspacer', width: 5 },
                {
                    xtype: 'button',
                    iconCls: 'remove',
                    text: 'Remove',
                    scope: this,
                    handler: function () {
                        window.actions('remove');
                    }
                }
            ]
        });

        return topBar;
    },

    createRootPanel: function () {
        var window = this;

        var rootPanel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            id: 'rootPanel',
            items: [
                {
                    title: 'Details',
                    region: 'east',
                    layout: 'fit',
                    id: 'regionEast',
                    margins: '5 5 5 0',
                    width: 250,
                    minWidth: 250,
                    split: true,
                    collapsed: true,
                    collapsible: true,
                    items: window.createForm()
                },
                {
                    title: 'People',
                    region: 'center',
                    minWidth: 350,
                    id: 'regionCenter',
                    xtype: 'panel',
                    layout: 'fit',
                    margins: '5 5 5 5',
                    items: window.createGrid()
                }]
        });

        return rootPanel;
    },

    createStore: function () {
        this.store = this.remote.createStore('model', {
            autoLoad: true,
            autoSync: true,
            remoteFilter: true,
            remoteSort: true
        });
    },

    resetForm: function () {
        var grid = Ext.getCmp('grid');
        var form = Ext.getCmp('editForm').getForm();
        var button = Ext.getCmp('saveOrUpdateButton');

        grid.getSelectionModel().clearSelections();
        form.reset();
        form.loadRecord(Ext.create(this.store.model, {}));
        button.setText('Save');
    }
});
