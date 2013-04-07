Ext.define('Dextop.api.Controller', {

    controllerContext: null,

    constructor: function (config) {
        Ext.apply(this, config);
    },

    invokeRemoteMethod: function (callback, scope, method, args) {

        var handler = Dextop.remoting.Proxy.createHandler(callback, scope);

        if (handler.prepare)
            handler.prepare.call(handler.scope);

        if (handler.setMask)
            handler.setMask();

        DextopApi.invoke(method, Ext.encode(this.controllerContext), this.encodeArguments(args), handler.callback, handler.scope);
    },

    encodeArguments: function (a) {
        /* Ext.encode([undefined, 1]) => '[1]' - wrong
		* Ext.encode([null, 1]) => '[null, 1]' - ok
		* If first argument in method call is undefined, second argument will fill it's place
		*/
        for (var i = 0; i < a.length; i++)
            if (!Ext.isDefined(a[i]))
                a[i] = null;
            else if (a[i] !== null)
                if (a[i].$className === "Ext.form.Basic")
                    a[i] = Ext.encode(a[i].getFieldValues());
                else if (typeof a[i] === 'object')
                    a[i] = Ext.encode(a[i]);
        return Ext.encode(a);
    }

});