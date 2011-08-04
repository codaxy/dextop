SM2_DEFER = true;

Ext.define('Dextop.modules.SoundModule', {

	constructor: function (config) {

		var soundManager = new SoundManager();

		soundManager.url = config.url;
		window.soundManager = this.soundManager = soundManager; // Flash expects window.soundManager.

		soundManager.onready(function() {
			if (config.sounds)
				for (var s in config.sounds)
					soundManager.createSound(s, config.sounds[s]);
			
			config.session.playSound = function(sound) {
				window.soundManager.play(sound);
			}
		});

		soundManager.beginDelayedInit(); // start SM2 init.

		//this.callParent(config);
	}
});