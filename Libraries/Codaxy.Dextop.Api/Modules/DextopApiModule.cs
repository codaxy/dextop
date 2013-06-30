using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Api;

namespace Codaxy.Dextop.Modules
{
    public class DextopApiModule : DextopModule
    {
        public override string ModuleName
        {
            get { return "dextop-api"; }
        }

        protected override void InitNamespaces()
        {
            RegisterNamespaceMapping("Codaxy.Dextop.Api*", "Dextop.api");
        }

        protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
        {
            if (!Application.PreprocessingEnabled || Application.PreprocessorMode)
            {
                preprocessors.Add("js/generated/api.js", new DextopApiPreprocessor());
            }
        }

        protected override void RegisterLoaders(Dictionary<string, IDextopFileLoader> loaders)
        {
            
        }

        protected override void InitResources()
        {
            
        }
    }
}
