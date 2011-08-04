using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading;
using System.Dynamic;
using System.IO;
using Codaxy.Dextop;
using Codaxy.Dextop.Remoting;
using $rootnamespace$.Windows;

namespace $rootnamespace$
{
    public class Session : DextopSession
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "$rootnamespace$.Session";
        }

        [DextopRemotable]
        DextopConfig CreateSimpleWindow()
        {
            var win = new SimpleWindow();
            return Remote.Register(win);
        }
    }
}