using System;
using System.Threading;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
	[Demo("RemotingCallbacks",
        Title = "Remoting Callbacks",
        Description = "Exploring the ways to handle remote responses.",
        Path = "~/Demos/Remoting"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
	[CategoryGettingStarted]
    public class RemotingCallbacksWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
			Remote.RemoteHostType = "Showcase.demos.RemotingCallbacksWindow";            
        }

		[DextopRemotable]
		public String GetHelloWorldMessage(bool fail)
		{
			if (fail)
				throw new NotImplementedException();
			return "Hello World!";
		}
    }
}