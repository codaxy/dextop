using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Template.Desktop
{
	public class ApplicationModule : DextopModule
	{
		public override string ModuleName
		{
			get { return "app"; }
		}

		protected override void InitNamespaces()
		{
			RegisterNamespaceMapping("Codaxy.Dextop.Template.Desktop.Windows*", "Desktop.window");
			RegisterNamespaceMapping("Codaxy.Dextop.Template.Desktop*", "Desktop");
		}

		protected override void InitResources()
		{
			RegisterJs("all", "js/", 
				"generated/",
				"window/",
				"");			
		}

		protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
		{
			RegisterStandardAssemblyPreprocessors("js/generated", preprocessors);
		}
	}
}