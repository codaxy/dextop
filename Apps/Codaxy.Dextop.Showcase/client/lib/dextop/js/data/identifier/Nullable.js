Ext.define('Dextop.data.identifier.Nullable', {
    extend: 'Ext.data.identifier.Generator',

    alias: 'data.identifier.nullable',

    generate: function () {
        return null;
    }
});