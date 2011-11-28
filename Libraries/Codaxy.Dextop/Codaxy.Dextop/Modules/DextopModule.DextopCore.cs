using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Dextop core module. Includes all Dextop library resources.
	/// </summary>
    public class DextopCoreModule : DextopModule
    {
		/// <summary>
		/// Gets the name of the module.
		/// </summary>
        public override string ModuleName
        {
            get { return "dextop"; }
        }

		/// <summary>
		/// Override this method to setup namespace mapping.
		/// </summary>
        protected override void InitNamespaces()
        {
            RegisterNamespaceMapping("Codaxy.Dextop.Forms*", "Dextop.form");
            RegisterNamespaceMapping("Codaxy.Dextop.Data*", "Dextop.data");
            RegisterNamespaceMapping("Codaxy.Dextop", "Dextop");
        }

		/// <summary>
		/// Initializes the module resources.
		/// </summary>
        protected override void InitResources()
        {
            var coreModule = CreateJsPackage("core");
            coreModule.Register("js/",
                "direct/",
                "remoting/",				
                "generated/",
                "data/",
                "ux/",
                "/"
            );
            coreModule.RegisterLocalizations(new[] { "sr", "ru", "da" }, "js/locale/", "dextop-{0}.js");

			RegisterCss("css/dextop.css");
        }

		/// <summary>
		/// Override this module to register any of the assembly preprocessors.
		/// </summary>
		/// <param name="preprocessors">The preprocessors.</param>
        protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
        {
            preprocessors.Add("js/generated/remote.js", new Remoting.DextopRemotingPreprocessor());
        }


    }
}
