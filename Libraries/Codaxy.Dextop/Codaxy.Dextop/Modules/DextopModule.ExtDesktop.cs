using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Modules
{
	/// <summary>
	/// Ext's Web Desktop module
	/// </summary>
	public class ExtDesktopModule : DextopModule
	{
		/// <summary>
		/// Gets the name of the module.
		/// </summary>
		public override string ModuleName
		{
			get { return "ext-desktop"; }
		}

		/// <summary>
		/// Setup mapping of module's namespaces.
		/// </summary>
		protected override void InitNamespaces()
		{
			
		}

		/// <summary>
		/// Initializes the module resources.
		/// </summary>
		protected override void InitResources()
		{
			RegisterJs("core", "js/", 
				"Module.js",
				"StartMenu.js",
				"Taskbar.js",
				"FitAllLayout.js",
				"Desktop.js",
				"App.js",				
				"");
			RegisterCss("css/desktop.css");
		}
	}
}
