Ext.ns('Showcase');

Ext.require([
	'Ext.ux.DataView.Animated' 
]);

Ext.define('Showcase.DemoDataView', {
    extend: 'Ext.view.View',
    
    itemSelector: 'div.demo',
    overItemCls: 'hover',
    singleSelect: true,
    multiSelect: false,
    autoScroll: true,
    
    store: null,	
	
    initComponent: function(){
        Ext.apply(this, {
            tpl: new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="demo {level}">', 
					'<div class="content">', 
						'<strong>{title}</strong>', 
						'{description}<br/>',
					'</div>',
                    '<br/>',
                     '<div class="tag-wrapper">',                        
                        '<tpl if="category != \'Feature\'">',
						    '<span class="tag {category}">{category}</span> ',
                        '</tpl>',
						'<span class="tag orange">{topic}</span> ',
	 			    '</div>',
				'</div>',               
			'</tpl>'),
            
            plugins: [Ext.create('Ext.ux.DataView.Animated', {
                duration: 350,
                idProperty: 'id'
            })],
            
            listeners: {
                scope: this,
                itemclick: function(view, rec, item){
                    Dextop.getSession().selectDemo(rec);
                }
            }            
        });
        
        this.callParent(arguments);
    }
});
