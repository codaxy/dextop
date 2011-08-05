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
        //Demo is required to have a public parameterless constructor
        public RemoteInstantiationWindow() {}

        //[DextopRemotableConstructor(alias="...")]
        [DextopRemotable]
        RemoteInstantiationWindow(DextopConfig config)
        {

        }
    }
}