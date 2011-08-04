using System;
using System.Threading;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("HelloRemotingDemo",
        Title = "Hello Remoting",
        Description = "Making remote method calls is really easy with Dextop.",
        Path = "~/Demos/Remoting"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
	[CategoryGettingStarted]
    public class HelloRemotingWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.demos.HelloRemotingWindow";            
        }

        [DextopRemotable]
        public String GetHelloWorldMessage() { return "Hello World!"; }

        class SearchFilter
        {
            public String FirstName { get; set; }
            public String LastName { get; set; }
        }

        [DextopRemotable]
        String Search(SearchFilter data)
        {
            return String.Format("Information about '{0} {1}' not found in the database.", data.FirstName, data.LastName);
        }

        [DextopRemotable]
        void RequestServerNotification()
        {
            ThreadPool.QueueUserWorkItem((state) =>
            {
                try
                {
                    Thread.Sleep(3000);
                    var msg = new { type = "alert", msg = "This is a notification you requested 3 seconds ago." };
                    Remote.SendMessage(msg);
                }
                catch { }
            });
        }
    }
}