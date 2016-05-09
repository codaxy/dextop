using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase
{
    public class ExtUxModule : DextopModule
    {
        public ExtUxModule()
        {
#if DEBUG
            Debug = true;
#endif
        }

    public bool Debug { get; set; }

    public override string ModuleName
        {
            get { return "ext-ux"; }
        }

        protected override void InitNamespaces()
        {
            
        }

        protected override bool MinifyCss { get { return false; } }
        protected override bool MinifyJs{ get { return false; } }

        protected override void InitResources()
        {
            var debugSuffix= Debug ? "-debug" : "";
            RegisterJs("pack", "", String.Format("ux{0}.js", debugSuffix));
            RegisterCss(String.Format("classic/resources/ux-all{0}.css", debugSuffix));
        }
       
        protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
        {

        }

        protected override void RegisterLoaders(Dictionary<string, IDextopFileLoader> loaders)
        {
            
        }
    }
}