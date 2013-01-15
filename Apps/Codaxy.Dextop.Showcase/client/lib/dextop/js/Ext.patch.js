//http://www.sencha.com/forum/showthread.php?130332-ArrayReader-idProperty-bug&p=591598#post591598

if (Ext.versions.extjs.version <= '4.0.7')  // NOTE: Appears to be fixed in Ext 4.1.0 beta 2
{ 
	Ext.override(Ext.data.reader.Array, {
		getIdProperty: function () {
			var m = this.model.prototype;
			var prop = Ext.isDefined(this.idProperty) ? this.idProperty : m.idProperty;

			if (typeof prop === 'string') {
				//model uses string idProperty and array reader needs index...
				var index = m.fields.indexOfKey(prop);
				if (index == -1)
					throw "Id property of the model '" + this.model.displayName + "' could not be found.";
				prop = index;
			}
			return prop;
		}
	});

	Ext.override(Ext.data.reader.Reader, {

		buildExtractors: function (force) {
			var me = this,
            idProp = me.getIdProperty(),
            totalProp = me.totalProperty,
            successProp = me.successProperty,
            messageProp = me.messageProperty,
            accessor;

			if (force === true) {
				delete me.extractorFunctions;
			}

			if (me.extractorFunctions) {
				return;
			}

			//build the extractors for all the meta data
			if (totalProp) {
				me.getTotal = me.createAccessor(totalProp);
			}

			if (successProp) {
				me.getSuccess = me.createAccessor(successProp);
			}

			if (messageProp) {
				me.getMessage = me.createAccessor(messageProp);
			}

			if (Ext.isDefined(idProp)) {
				accessor = me.createAccessor(idProp);

				me.getId = function (record) {
					var id = accessor.call(me, record);
					return (id === undefined || id === '') ? null : id;
				};
			} else {
				me.getId = function () {
					return null;
				};
			}
			me.buildFieldExtractors();
		}
	});
}

/// http://www.sencha.com/forum/showthread.php?131484-Ext.form.field.Checkbox-bug&p=595247#post595247
Ext.override(Ext.form.field.Checkbox, {
	getModelData: function () {
		return this.callParent(arguments);
	}
});

//Reported: http://www.sencha.com/forum/showthread.php?132358-Radio-getModelData-bug&p=598226#post598226
Ext.override(Ext.form.field.Radio, {
	getModelData: function () {
		if (!this.checked)
			return undefined;
		var res = {};
		res[this.name] = this.inputValue;
		return res;
	}
});


/**
* Fix from default behaviour, since this.items has no remove method.
* See here: http://www.sencha.com/forum/showthread.php?133240-4.0.0-Ext.Action.removeComponent
* @param {Object} comp The component to remove.
*/
Ext.override(Ext.Action, {	
	removeComponent: function (comp) {
		Ext.Array.remove(this.items, comp);
	}
});


///
if (Ext.versions.extjs.version == '4.0.1')
Ext.override(Ext.grid.View, {
	processUIEvent: function (e) {
		var me = this,
		item = e.getTarget(me.getItemSelector(), me.getTargetEl()),
		map = this.statics().EventMap,
		index, record,
		type = e.type,
		overItem = me.mouseOverItem,
		newType;
		if (!item) {
			if (type == 'mouseover' && me.stillOverItem(e, overItem)) {
				item = overItem;
			}
			if (type == 'keydown') {
				record = me.getSelectionModel().getLastSelected();
				if (record) {
					item = me.getNode(record);
				}
			}
		}
		if (item) {
			index = me.indexOf(item);
			if (!record) {
				record = me.getRecord(item);
			}
			if (me.processItemEvent(record, item, index, e) === false) {
				return false;
			}
			newType = me.isNewItemEvent(item, e);
			if (newType === false) {
				return false;
			}
			if (map[newType] && (
(me['onBeforeItem' + map[newType]](record, item, index, e) === false) ||
(me.fireEvent('beforeitem' + newType, me, record, item, index, e) === false) ||
(me['onItem' + map[newType]](record, item, index, e) === false)
)) {
				return false;
			}
			me.fireEvent('item' + newType, me, record, item, index, e);
		}
		else {
			if (map[newType] && (
(me.processContainerEvent(e) === false) ||
(me['onBeforeContainer' + map[type]](e) === false) ||
(me.fireEvent('beforecontainer' + type, me, e) === false) ||
(me['onContainer' + map[type]](e) === false)
)) {
				return false;
			}
			me.fireEvent('container' + type, me, e);
		}
		return true;
	}

});

Ext.override(Ext.data.AbstractStore, {
	setProxy: function (proxy) {
		var me = this;
		if (proxy instanceof Ext.data.proxy.Proxy || proxy.setModel) {
			proxy.setModel(me.model);
		} else {
			if (Ext.isString(proxy)) {
				proxy = {
					type: proxy
				};
			}
			Ext.applyIf(proxy, {
				model: me.model
			});
			proxy = Ext.createByAlias('proxy.' + proxy.type, proxy);
		}
		me.proxy = proxy;
		return me.proxy;
	}
});

if (Ext.versions.extjs.version == '4.1.0')
    Ext.override(Ext.panel.Panel, {
        getKeyMap: function () {
            if (!this.keyMap) {
                this.keyMap = new Ext.KeyMap(this.el, this.keys);
            }
            return this.keyMap;
        }
    });

if (Ext.versions.extjs.version == '4.1.1')
    Ext.override(Ext.form.field.Time, {
        syncSelection: function () {
            var me = this,
                picker = me.picker,
                toSelect,
                selModel,
                value,
                data, d, dLen, rec;

            if (picker && !me.skipSync) {
                picker.clearHighlight();
                value = me.getValue();
                selModel = picker.getSelectionModel();
                // Update the selection to match
                me.ignoreSelection++;
                if (value === null) {
                    selModel.deselectAll();
                } else if (Ext.isDate(value)) {
                    // find value, select it
                    data = picker.store.data.items;
                    dLen = data.length;

                    for (d = 0; d < dLen; d++) {
                        rec = data[d];

                        if (Ext.Date.isEqual(rec.get('date'), value)) {
                            toSelect = rec;
                            break;
                        }
                    }

                    if (toSelect)
                        selModel.select(toSelect);
                    else
                        me.setRawValue(me.formatDate(value));
                }
                me.ignoreSelection--;
            }
        }
    });