using System;
using System.Threading;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
	[Demo("AdvancedExceptionHandling",
		Title = "Advanced Exception Handling",
        Description = "Catch that nasty exception...",
        Path = "~/Demos/Remoting"
    )]
    [LevelAdvanced]
    [TopicDextopRemoting]
	[CategoryGettingStarted]
    public class AdvancedExceptionHandlingWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);			
			Remote.OnMapRemotingException = MapException;
        }

		[DextopRemotable]
		public String DoSomething()
		{
			throw new NotSupportedException();
		}

		[DextopRemotable]
		public String TrySomethingElse()
		{
			throw new NotImplementedException();
		}

		object MapException(Exception ex)
		{
			try
			{
				throw ex;
			}
			catch (NotSupportedException)
			{
				throw new DextopErrorMessageException("Special exception handler detected that this operation is not supported.");
			}
		}
    }
}