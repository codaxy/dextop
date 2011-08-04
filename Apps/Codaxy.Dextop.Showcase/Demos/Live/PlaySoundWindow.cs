using System;
using System.Collections.Generic;
using System.Threading;
using Codaxy.Dextop.Data;


namespace Codaxy.Dextop.Showcase.Demos.Live
{
    [Demo("PlaySoundWindow",
        Title = "Play Sound",
        Description = "Usage of Sound Manager.",
        Path = "~/Demos/Live"
    )]
    [LevelMedium]
    [TopicDextopLive]
    [CategoryCodeSnippet]
    public class PlaySoundWindow : DextopWindow
    {
		public override void InitRemotable(DextopRemote remote, DextopConfig config)
		{
			base.InitRemotable(remote, config);
			config.Add("soundUrl", DextopUtil.AbsolutePath("client/sound/notify.mp3"));
		}
    }
}