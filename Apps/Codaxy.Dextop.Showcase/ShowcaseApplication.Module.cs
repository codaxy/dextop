using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Forms;

namespace Codaxy.Dextop.Showcase
{
    public class ShowcaseApplicationModule : DextopModule
    {
        public override string ModuleName
        {
            get { return "showcase"; }
        }

        protected override void InitNamespaces()
        {
            RegisterNamespaceMapping("Codaxy.Dextop.Showcase.Demos*", "Showcase.demos");
            RegisterNamespaceMapping("Codaxy.Dextop.Showcase.Windows*", "Showcase.window");
            RegisterNamespaceMapping("Codaxy.Dextop.Showcase*", "Showcase");            
        }

        protected override void InitResources()
        {            
            RegisterJs("app", "client/js/",
				"generated/",
                "controls/",
                "");
            RegisterJs("demos", "demos/", "*/");
            RegisterCss("client/css/features.css");
            RegisterCss("client/css/theme.css");
        }

		protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
		{
            if (!Application.PreprocessingEnabled || Application.PreprocessorMode)
            {
                preprocessors.Add("client/js/generated/demos.js", new Demos.DemoPreprocessor());
                //#if DEBUG
                preprocessors.Add("source/dummy.txt", new Demos.DemoSourcePreprocessor());
                preprocessors.Add("client/js/controls/guides.js", new Guides.GuidePreprocessor()); //generated to controls as it's included in project
                //#endif
                RegisterStandardAssemblyPreprocessors("client/js/generated/", preprocessors);
            }
		}

        protected override void RegisterLoaders(Dictionary<string, IDextopFileLoader> loaders)
        {
            RegisterStandardFileLoaders("client/js/generated/", loaders);
        }
    }
}