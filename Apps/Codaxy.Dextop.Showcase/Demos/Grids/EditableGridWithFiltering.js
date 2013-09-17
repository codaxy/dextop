Ext.define('Showcase.demos.EditableGridWithFiltering', {
    extend: 'Dextop.Window',
    width: 800,
    height: 450,
    title: 'Editable Grid with filtering and sorting',

    initComponent: function () {
        var idOfUpdatingRecord = -1;
        var nameFilterValue = null;
        var store = this.remote.createStore('model', {
            id: 'store',
            autoLoad: true,
            autoSync: true,
            remoteSort: true,
            remoteFilter: true,
        });
        var columns = this.remote.createGridColumns('model');
        //numerical validation
        var numTest = /^[0-9]+$/i;
        Ext.apply(Ext.form.field.VTypes, {
            num: function (val, field) { return numTest.test(val); },
            numText: 'Age is a number.',
            numMask: /[\d\s:amp]/i
        });
        var grid = Ext.create('Ext.grid.GridPanel', {
            title: 'People',
            border: true,
            store: store,
            columns: columns,
            region: 'center',
            layout: 'fit',
            tbar: [{
                text: 'Add',
                iconCls: 'add',
                scope: this,
                handler: function () {
                    idOfUpdatingRecord = -1;//adding
                    Ext.getCmp('dextopform').expand();
                }
            }, {
                text: 'Remove',
                iconCls: 'remove',
                scope: this,
                handler: function () {
                    var s = grid.getSelectionModel().getSelection();
                    for (var i = 0; i < s.length; i++)
                        store.remove(s[i]);
                    Ext.getCmp('dextopform').getForm().reset();
                    Ext.getCmp('dextopform').collapse();
                }
            }],

            bbar: [{
                id: 'label',
                xtype: 'label',
                text: 'Filter : ',
                padding: '0 5 0 10',
            }, {
                id: 'nameField',
                xtype: 'textfield',
                hideLabel: true,
                emptyText: '(Name)',
                allowBlank: true,
                width: 120,
                listeners: {
                    change: function (a, newValue, oldValue, eOpts) {
                        var fleg = false;
                        if (nameFilterValue === null) fleg = true;
                        nameFilterValue = newValue;
                        if (fleg)
                            //time buffer implementation
                            setTimeout(function () {
                                if (store.filters.length > 0)
                                    store.clearFilter(true);
                                store.filter('name', nameFilterValue);
                                console.log('data sent : ' + nameFilterValue);
                                nameFilterValue = null;
                                return;
                            }, 200);
                    }
                }
            }, {
                id: 'ageField',
                xtype: 'textfield',
                hideLabel: true,
                emptyText: '(Age)',
                allowBlank: true,
                padding: '0 10 0 10',
                width: 45,
                vtype: 'num',
                listeners: {
                    change: function (a, newValue, oldValue, eOpts) {
                        store.filter('age', newValue);
                        store.clearFilter(true);
                    }
                }
            }, {
                xtype: 'button',
                text: 'X',
                padding: '0 10 0 10',
                width: 50,
                handler: function () {
                    var ageField = Ext.getCmp('ageField');
                    var nameField = Ext.getCmp('nameField');
                    ageField.setValue('');
                    nameField.setValue('');
                }
            }],

            listeners: {
                itemclick: function (a, record, item, index, e, eOpts) {
                    var form = Ext.getCmp('dextopform').getForm();
                    idOfUpdatingRecord = record.get('id');
                    form.loadRecord(record);
                    Ext.getCmp('dextopform').expand();
                }
            },
        });

        Ext.apply(this, {
            layout: {
                type: 'border',
                align: 'left',
            },
            items: [grid,
                {
                    xtype: 'dextopform',
                    id: 'dextopform',
                    bodyStyle: 'padding: 15px',
                    title: 'Details',
                    width: 300,
                    border: true,
                    region: 'east',
                    collapsible: true,
                    collapsed: true,
                    model: this.getNestedTypeName('.form.Person'),
                    remote: this.remote,
                    data: this.data,
                    buttons: [{
                        text: 'Save',
                        scope: this,
                        handler: function () {
                            var form = Ext.getCmp('dextopform');
                            if (!form.getForm().isValid()) return;
                            if (idOfUpdatingRecord === -1) {//adding
                                store.add(form.getForm().getFieldValues());
                            }
                            else {//editing
                                var record = store.getById(idOfUpdatingRecord);
                                //console.log('record : ' + record.raw);
                                //console.log('form data : ' + JSON.stringify(form.getForm().getFieldValues()));
                                var fieldValues = form.getForm().getFieldValues();
                                record.set('name', fieldValues.name);
                                record.set('age', fieldValues.age);
                                record.set('height', fieldValues.height);
                                record.set('gender', fieldValues.gender);
                                record.set('basketball', fieldValues.basketball);
                                record.set('football', fieldValues.football);
                                record.set('volleyball', fieldValues.volleyball);
                                idOfUpdatingRecord = -1;
                            }
                            form.getForm().reset();
                            form.collapse();
                        }
                    }, {
                        text: 'Close',
                        scope: this,
                        handler: function () {
                            var form = Ext.getCmp('dextopform');
                            form.getForm().reset();
                            form.collapse();
                        }
                    }]

                }],
        });

        this.callParent(arguments);
    }
});