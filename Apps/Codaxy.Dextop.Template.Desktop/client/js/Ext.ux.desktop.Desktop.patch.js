Ext.override(Ext.ux.desktop.Desktop, {

	addWindow: function (win) {
		var me = this;
		me.windows.add(win);
		win.taskButton = me.taskbar.addTaskButton(win);

		win.on({
			activate: me.updateActiveWindow,
			beforeshow: me.updateActiveWindow,
			deactivate: me.updateActiveWindow,
			minimize: me.minimizeWindow,
			destroy: me.onWindowClose,
			scope: me
		});

		win.on({
			afterrender: function () {
				win.dd.xTickSize = me.xTickSize;
				win.dd.yTickSize = me.yTickSize;

				if (win.resizer) {
					win.resizer.widthIncrement = me.xTickSize;
					win.resizer.heightIncrement = me.yTickSize;
				}
			},
			single: true
		});

		//		// replace normal window close w/fadeOut animation:
		//		win.doClose = function () {
		//			win.el.disableShadow();
		//			win.el.fadeOut({
		//				listeners: {
		//					afteranimate: function () {
		//						win.destroy();
		//					}
		//				}
		//			});
		//		};
	}
});