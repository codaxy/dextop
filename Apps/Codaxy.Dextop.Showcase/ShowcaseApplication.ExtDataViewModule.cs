using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase
{
    public class ExtJSDataViewModule : DextopModule
    {
        public override string ModuleName
        {
            get { return "ext-dataview"; }
        }

        protected override void InitNamespaces()
        {
            
        }

        protected override void InitResources()
        {
            //root is examples
            RegisterJs("pack", "", 
                "ux/DataView/Animated.js",
                "ux/BoxReorderer.js",
                "view/multisort/SortButton.js"
            );
            
        }
       
        protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
        {

        }
    }
}