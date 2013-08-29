Ext.ns('Dextop.data');

Ext.define('Dextop.data.RendererFactory', {

	statics: {

		defaultRenderer: function (value) { return value; },

		types: {
			number: function (options) {
				if (Ext.isString(options))
					options = {
						format: options
					};
				else
					options = options || {};

				if (!options.format && Ext.util.Format.decimalSeparator != '.') {
					return function (value) {
						var res = value || value === 0 ? value.toString() : '';
						res = res.replace('.', Ext.util.Format.decimalSeparator);
						return res;
					}
				}
				return Ext.util.Format.numberRenderer(options.format);
			},

			time: function (options) {
			    var format = options.format || Ext.form.field.Time.prototype.format || 'g:i A';
			    return function (v) {
			        if (!v)
			            return v;
			        return Ext.util.Format.date(v, format);
			    }
			},

			date: function (options) {
			    return Ext.util.Format.dateRenderer(options.format);
			},

			datetime: function(options) {
			    if (options.format)
			        return Ext.util.Format.dateRenderer(options.format);

			    return function (v) {
			        if (!v)
			            return v;
			        return Ext.util.Format.date(v, (Ext.Date.defaultFormat || Ext.util.Format.dateFormat) + ' ' + (Ext.form.field.Time.prototype.format || 'g:i A'));
			    }
			},

			tpl: function (options) {
			    var format = options.tpl || options.format;
			    if (!format)
			        return Dextop.data.RendererFactory.defaultRenderer;

			    var tpl = new Ext.XTemplate(format);
			    tpl.compile();			    
			    return function (value, meta, record) {
			        var v = tpl.apply(record.data) || '';
			        return v;
			    }
			},

			tooltipTpl: function (options) {
				var tpl = new Ext.XTemplate(options.tooltipTpl);
				tpl.compile();
				var renderer = options.renderer || Dextop.data.RendererFactory.defaultRenderer;
				return function (value, meta, record) {
					var v = renderer(value, meta, record) || '';
					var ttip = tpl.apply(record.data) || '';
					if (ttip && ttip != 'null')
						return '<div data-qtip=\"' + ttip + '\">' + v + '</div>';
					return v;
				}
			}
		},

		register: function (type, renderer) {
			var f = function () { return renderer; };
			Dextop.data.RendererFactory.types[type] = f;
		},

		registerFactory: function (type, factoryMethod) {
			Dextop.data.RendererFactory.types[type] = factoryMethod;
		},

		create: function (type, options) {
			var f = Dextop.data.RendererFactory.types[type];
			if (!f)
				throw "Renderer type '" + type + "' not defined.";
			return f(options);
		}
	}
});
