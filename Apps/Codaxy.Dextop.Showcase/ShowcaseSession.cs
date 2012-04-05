using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Remoting;
using System.Threading;
using System.Dynamic;
using System.IO;

namespace Codaxy.Dextop.Showcase
{
    public class ShowcaseSession : DextopSession
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.Session";

			config["aboutPageUrl"] = DextopUtil.AbsolutePath("source/About.html?cb=" + DateTime.Now.Ticks);            
        }

        [DextopRemotable]
        DextopConfig CreateDemoWindow(string id, string remoteId)
        {
            var w = ((ShowcaseApplication)DextopApplication).CreateDemo(id);
            return Remote.Register(w, remoteId, false);
        }

		protected override object[] BuildLookupData(string name, out DextopSessionVariableSharing sharing)
		{
			switch (name)
			{
				case "OnOff":					
					sharing = DextopSessionVariableSharing.Global;
					return new[] { 
						new object[] { true, "On" },
						new object[] { false, "Off" }
					};
			}
			return base.BuildLookupData(name, out sharing);
		}
    }
}