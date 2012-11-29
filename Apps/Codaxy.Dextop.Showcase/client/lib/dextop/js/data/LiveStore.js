Ext.ns('Dextop.data');

Ext.define('Dextop.data.LiveStore', {
	extend: 'Ext.data.Store',

	mixins: {
		remotable: 'Dextop.remoting.Remotable'
	},

	constructor: function (config) {
		this.initRemote(config.remote);
		delete config.remote;

		if (!config.model)
			throw 'Store model is not defined.';

		if (!config.reader)
			config.reader = Ext.create('Ext.data.ArrayReader', {
				model: config.model,
				root: 'data'
			});

		Ext.apply(config.reader, {
			totalProperty: undefined,
			successProperty: undefined
		});

		this.proxy = Ext.create('Ext.data.ServerProxy', {
			model: this.model,
			reader: config.reader
		});

		this.callParent(arguments);
	},


	onDestroy: function () {
		this.destroyRemote();
		this.callParent(arguments);
	},

	load: function () {
		this.loading = true;
		this.remote.Subscribe(function (response) {
			if (!response || !response.success) {
				this.loading = false;
				this.fireEvent('load', this, null, false);
			}
		});
	},

	onServerMessage: function (data) {

	    if (data.load) {
	        var r = Ext.decode(data.load);
	        var result = this.reader.read({
	            data: r
	        });

	        this.loadRecords(result.records, {
	            addRecords: false
	        });

	        if (this.loading) {
	            this.loading = false;
	            this.fireEvent('load', this, result.records, true);
	        }
	    }

	    var suspendEvents = this.groupField || (this.autoSort && this.sorters && this.sorters.getCount() > 0);

        if (suspendEvents)
	        this.suspendEvents();

	    try {

	        if (data.remove) {
	            var r = Ext.decode(data.remove);
	            var result = this.reader.read({
	                data: r
	            });
	            var storeRecords = [];
	            for (var i = 0; i < result.records.length; i++) {
	                var r = this.getById(result.records[i].getId());
	                if (r)
	                    storeRecords.push(r);
	            }
	            this.remove(storeRecords);
	        }

	        if (data.update) {
	            var r = Ext.decode(data.update);
	            var result = this.reader.read({
	                data: r
	            });
	            for (var i = 0; i < result.records.length; i++) {
	                var rec = result.records[i];
	                var recId = rec.getId();
	                var original = this.getById(recId);
	                if (original) {
	                    original.beginEdit();
	                    original.set(rec.data); //easier way					
	                    original.endEdit();
	                    original.commit();
	                }
	            }
	        }

	        if (data.add) {
	            var r = Ext.decode(data.add);
	            var result = this.reader.read({
	                data: r
	            });
	            this.insert(this.getCount(), result.records);
	        }

	        if (this.autoSort) 
	            this.sort();

	        if (suspendEvents) {
	            this.resumeEvents();
	            this.fireEvent('datachanged', this);
	            this.fireEvent('refresh', this);
	        }

	    } catch (e) {
	        if (suspendEvents)
	            this.resumeEvents();
	        throw e;
	    }
	}
})
