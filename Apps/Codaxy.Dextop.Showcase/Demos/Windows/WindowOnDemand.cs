using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Windows
{
    [Demo("WindowOnDemand",
        Title = "Window On Demand",
        Description = "Creating server-side window on demand",
        Path = "~/Demos/Windows"
    )]
    [LevelBeginner]
    [TopicDextopWindows]
    [CategoryCodeSnippet]
    public class WindowOnDemandWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.demos.WindowOnDemandWindow";
        }

        [DextopRemotable]
        public DextopConfig CreateWindow(String type)
        {
            IDextopRemotable window;
            switch (type)
            {
                case "simple":
                    window = new SimpleWindow();
                    break;
                // ...
                default:
                    throw new DextopErrorMessageException("Unknown window type: {0}", type);
            }

            return Remote.Register(window);
        }
    }
}
