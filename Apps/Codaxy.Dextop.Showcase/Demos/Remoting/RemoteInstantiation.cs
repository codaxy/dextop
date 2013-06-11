using System;
using System.Threading;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("RemoteInstantiation",
        Title = "Remote Instantiation",
        Description = "Learn how to create remote objects on the server.",
        Path = "~/Demos/Remoting"
    )]
    [LevelMedium]
    [TopicDextopRemoting]
	[CategoryGettingStarted]
    public class RemoteInstantiationWindow : DextopWindow
    {
        String title;
        
        [DextopRemotableConstructor(alias = "rinstant")]
        public RemoteInstantiationWindow()
        {
            title = "Parameterless";
        }

        [DextopRemotable]
        public RemoteInstantiationWindow(String a, String b)
        {
            title = String.Format("[{0} {1}]", a, b);
        }

        [DextopRemotableConstructor(route = "rinstant/{routeParam}")]
        public RemoteInstantiationWindow(String routeParam)
        {
            title = "Route with param: " + routeParam;
        }

        [DextopRemotable]
        public RemoteInstantiationWindow(DextopConfig dc)
        {
            title = DextopUtil.Encode(dc);
        }

        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            config["title"] = title;
        }

        
        
    }
}