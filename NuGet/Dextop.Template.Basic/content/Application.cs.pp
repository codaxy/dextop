using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop;

namespace $rootnamespace$
{
    public partial class Application : DextopApplication
    {       
        protected override void RegisterModules()
        {
            RegisterModule("client/lib/ext", new DextopExtJSModule());
            RegisterModule("client/lib/dextop", new DextopCoreModule());
            RegisterModule("", new ApplicationModule());
        }

        protected override void OnModulesInitialized()
        {
            base.OnModulesInitialized();
#if !DEBUG
            OptimizeModules("client/js/cache");
#endif
        }
    }
}