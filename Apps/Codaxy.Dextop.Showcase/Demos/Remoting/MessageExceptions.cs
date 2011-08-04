using System;
using System.Threading;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
	[Demo("MessageExceptions",
        Title = "Message Exceptions",
        Description = "Exploring the ways to handle remote responses.",
        Path = "~/Demos/Remoting"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
	[CategoryGettingStarted]
    public class MessageExceptionsWindow : DextopWindow
    {
		[DextopRemotable]
		public void Error()
		{
			throw new DextopErrorMessageException("Nothing went well. We screwed up.");
		}		

		[DextopRemotable]
		public void Warning()
		{
			throw new DextopWarningMessageException("Almost everything went well, but ...");
		}

		[DextopRemotable]
		public void Info()
		{
			throw new DextopInfoMessageException("Everything went well.");
		}		
    }
}