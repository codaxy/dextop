using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Windows
{
    [Demo("LogWindow",
        Title = "Log Window",
        Description = "Creating log window",
        Path = "~/Demos/Windows"
    )]
    [LevelBeginner]
    [TopicDextopWindows]
    [CategoryCodeSnippet]
    public class LogWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.demos.LogWindow";
        }
    }
}
