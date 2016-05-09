using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Modules;

namespace Codaxy.Dextop.Showcase
{
    public partial class ShowcaseApplication : DextopApplication
    {
        protected override void RegisterModules()
        {
            RegisterModule("client/lib/ext/", new DextopExtJSModule
            {
                CssThemeSuffix = "-gray",
                UsingExternalResources = true
            });

            RegisterModule("client/lib/ext/build/packages/ux/classic/", new ExtUxModule
            {
                UsingExternalResources = true
            });

            RegisterModule("client/lib/ext/build/packages/charts/classic/", new ExtChartsModule
            {
                UsingExternalResources = true
            });

            RegisterModule("client/lib/dextop", new DextopCoreModule());
            RegisterModule("client/lib/dextop", new DextopApiModule());
            
            var soundModule = new DextopSoundModule();
            soundModule.AddSound("error", "client/sound/notify.mp3");
            RegisterModule("client/lib/sound", soundModule);

            RegisterModule("", new ShowcaseApplicationModule());
        }

        protected override void OnModulesInitialized()
        {
            base.OnModulesInitialized();
            if (Optimize)
                OptimizeModules("client/js/cache", PreprocessingEnabled && !PreprocessorMode);
        }        

        public bool Optimize { get; set; }      
    }
}