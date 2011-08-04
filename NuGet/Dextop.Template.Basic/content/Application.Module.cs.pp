using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Forms;

namespace $rootnamespace$
{
    public class ApplicationModule : DextopModule
    {
        public override string ModuleName
        {
            get { return "demo"; }
        }

        protected override void InitNamespaces()
        {
			RegisterNamespaceMapping("$rootnamespace$.Windows*", "$rootnamespace$.window");
            RegisterNamespaceMapping("$rootnamespace$", "$rootnamespace$");                 
        }

        protected override void InitResources()
        {            
            RegisterJs("app", "client/js/",
                "generated/",
                "window/",
                "");
            RegisterCss("client/css/application.css");
        }


        protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
        {
			RegisterStandardAssemblyPreprocessors("client/js/generated/", preprocessors);
        }
    }
}