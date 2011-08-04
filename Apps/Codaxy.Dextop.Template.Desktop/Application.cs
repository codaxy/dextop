using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Modules;

namespace Codaxy.Dextop.Template.Desktop
{
	public class Application : DextopApplication
	{
		protected override void RegisterModules()
		{
			RegisterModule("client/lib/ext", new DextopExtJSModule());
			RegisterModule("client/lib/ext/examples/desktop", new ExtDesktopModule());
			RegisterModule("client/lib/dextop", new DextopCoreModule());
			RegisterModule("client", new ApplicationModule());
		}		
	}
}