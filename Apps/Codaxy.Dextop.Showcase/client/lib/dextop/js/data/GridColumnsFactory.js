Ext.ns('Dextop.data');

Ext.define('Dextop.data.GridColumnsFactory', {
	statics: {
		create: function (columns, options) {
			options = options || {};
			if (typeof columns === 'string') {
				var modelHeadersFactory = Ext.create(columns);
				columns = modelHeadersFactory.getItems(options);
			}
			for (var i = 0; i < columns.length; i++)
				columns[i] = Dextop.data.GridColumnsFactory.createColumn(columns[i], options);
			return columns;
		},

		columnDefaults: {
			'int': {
				align: 'right',
				field: {
					xtype: 'numberfield'
				},
				renderer: 'number'
			},
			'float': {
				align: 'right',
				field: {
					xtype: 'numberfield'
				},
				renderer: 'number'
			},
			'string': {
				field: {
					xtype: 'textfield'
				}
			},
			'date': {
				align: 'center',
				field: {
					xtype: 'datefield'
				},
				renderer: 'date',
				width: 90
			},
			'time': {
				align: 'center',
				field: {
					xtype: 'timefield'
				},
				renderer: 'time',
				width: 80
			},
			'datetime': {
				align: 'center',
				field: {
					xtype: 'textfield'
				},
				renderer: function (v) {
					if (!v)
						return v;
					return Ext.util.Format.date(v, (Ext.Date.defaultFormat || Ext.util.Format.dateFormat) + ' ' + (Ext.form.field.Time.prototype.format || 'g:i A'));
				}
			},
			'boolean': {
				factory: function (c, options) {
					Ext.applyIf(c, {
						xtype: 'checkcolumn',
						editor: options.checkEditor,
						align: 'center',
						width: 40,
						field: {
							xtype: 'checkbox'
						}
					});
				}
			},
			'lookup': {
				factory: function (c, options) {
					if (!options || !options.remote)
						throw "Invalid lookup options specified.";
					var store = options.remote.createStore(c.lookupId || c.dataIndex);
					if (!c.readonly)
						c.field = {
							xtype: 'combo',
							valueField: 'id',
							displayField: 'text',
							queryMode: 'local',
							forceSelection: true,
							disableKeyFilter: true,
							store: store
						};
					if (!c.renderer)
						c.renderer = function (value) {
							var rec = store.getById(value);
							return rec ? rec.get('text') : value;
						}
				}
			},

			'remote-lookup': {
				factory: function (c, options) {
					if (!options || !options.remote)
						throw "Invalid remote-lookup options specified.";
					var store = options.remote.createStore(c.lookupId || c.dataIndex);
					if (!c.readonly && c.field)
						Ext.applyIf(c.field, {
							xtype: 'combo',
							store: store,
							//enableKeyEvents: true,
							//triggerAction: 'query',
							minChars: 1,
							queryDelay: 50
						});

					if (!c.renderer && c.valueNotFoundDataIndex)
						c.renderer = function (value, meta, record) {
							if (record.dirty && record.modified && c.field && Ext.isDefined(record.modified[c.dataIndex])) {
								var rec = store.findRecord(c.field.valueField, value);
								return rec ? rec.get(c.field.displayField || c.field.valueField) : value;
							}
							var v = record.get(c.valueNotFoundDataIndex);
							return v;
						}
				}
			}
		},

		createColumn: function (c, options) {
			if (c.type) {
				var defaults = Dextop.data.GridColumnsFactory.columnDefaults[c.type];
				delete c.type;
				if (defaults)
					if (defaults.factory)
						defaults.factory(c, options);
					else
						Ext.applyIf(c, Ext.clone(defaults));
			}

			if (c.readonly)
				delete c.field;

			if (c.field && c.required)
				c.field.allowBlank = false;

			if (typeof c.renderer === 'string') {
				c.rendererOptions = c.rendererOptions || {};
				if (c.format) {
					c.rendererOptions.format = c.format;
					delete c.format;
				}
				c.renderer = Dextop.data.RendererFactory.create(c.renderer, c.rendererOptions);
			}

			if (options && options.renderers && options.renderers[c.dataIndex])
				c.renderer = options.renderers[c.dataIndex];

			if (!Ext.isDefined(c.menuDisabled))
			    c.menuDisabled = true;

			if (c.tpl) {
			    c.renderer = Dextop.data.RendererFactory.create('tpl', { tpl: c.tpl });
			    delete c.tpl;
			}

			if (c.tooltipTpl) {
				c.renderer = Dextop.data.RendererFactory.create('tooltipTpl', {
					renderer: c.renderer,
					tooltipTpl: c.tooltipTpl
				});
				delete c.tooltipTpl;
			}

			//sometimes header text is too long, so it's useful to display the tooltip with header text
			if (!c.tooltip && c.text)
				c.tooltip = c.text;

			if (c.columns)
				c.columns = Dextop.data.GridColumnsFactory.create(c.columns, options);

			return c;
		}
	}
})
