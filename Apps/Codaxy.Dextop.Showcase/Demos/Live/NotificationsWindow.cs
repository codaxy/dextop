using System;
using System.Collections.Generic;
using System.Threading;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Remoting;


namespace Codaxy.Dextop.Showcase.Demos.Live
{
	[Demo("NotificationsWindow",
		Title = "Notifications",
        Description = "Notify user about important events...",
        Path = "~/Demos/Live"
    )]
    [LevelMedium]
    [TopicDextopLive]
    [CategoryCodeSnippet]
	public class NotificationsWindow : DextopWindow
    {
		[DextopRemotable]
		public void NotifyMe()
		{
			Remote.SendNotification(new DextopNotification
			{
				Alert = true,
				Sound = DextopNotificationSound.Standard,
				Message = "This is an alert and sound notification from the server.",
				Type = DextopMessageType.Error
			});
		}
    }
}