using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase
{
    public class ExtChartsModule : DextopModule
    {
        public ExtChartsModule()
        {
#if DEBUG
            Debug = true;
#endif
        }

        public bool Debug { get; set; }

        public override string ModuleName
        {
            get { return "ext-charts"; }
        }

        protected override void InitNamespaces()
        {
            
        }

        protected override void InitResources()
        {
            string debugSuffix = Debug ? "-debug" : "";

            var js = CreateJsPackage("ext-charts");
            js.Concate = false;
            js.Register(String.Format("sencha-charts{0}.js", debugSuffix));
        }
       
        protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
        {

        }

        protected override void RegisterLoaders(Dictionary<string, IDextopFileLoader> loaders)
        {
            
        }
    }
}