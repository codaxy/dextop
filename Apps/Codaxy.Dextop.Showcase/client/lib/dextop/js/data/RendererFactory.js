Ext.ns('Dextop.data');

Ext.define('Dextop.data.RendererFactory', {

	statics: {

		defaultRenderer: function (value) { return value; },

		types: {
			number: function (options) {
				return Ext.util.Format.numberRenderer();
			},

			tooltipTpl: function (options) {
				options = options || {};
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
