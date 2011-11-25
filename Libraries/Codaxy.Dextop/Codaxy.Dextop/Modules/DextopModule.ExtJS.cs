using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Module which includes ext-all js and css resources.
	/// </summary>
    public class DextopExtJSModule : DextopModule
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopExtJSModule"/> class.
		/// </summary>
        public DextopExtJSModule()
        {
#if DEBUG
            Debug = true;
#endif
        }

		/// <summary>
		/// Gets or sets a value indicating whether debug version should be used.
		/// </summary>
        public bool Debug { get; set; }

		/// <summary>
		/// Gets or sets the CSS theme suffix.
		/// </summary>		
		public String CssThemeSuffix { get; set; }

		/// <summary>
		/// Gets the name of the module.
		/// </summary>
        public override string ModuleName
        {
            get { return "ext"; }
        }

		/// <summary>
		/// Setup mapping of module's namespaces.
		/// </summary>
        protected override void InitNamespaces()
        {

        }

        /// <summary>
        /// Override this module to register any of the assembly preprocessors.
        /// </summary>
        /// <param name="preprocessors">The preprocessors.</param>
        protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
        {
           
        }

		/// <summary>
		/// Initializes the module resources.
		/// </summary>
        protected override void InitResources()
        {
            var js = CreateJsPackage("ext");
            js.Concate = false;
            if (Debug)
                js.Register("ext-all-debug.js");
            else
                js.Register("ext-all.js");

            js.RegisterLocalizations(new[] { "sr", "ru", "fr", "de", "da" }, "locale/", "ext-lang-{0}.js");

            var css = CreateCssPackage();
            css.Minify = false;
			
			// No debug version since 4.0.2
			//if (Debug)
			//    css.Register("resources/css/ext-all-debug.css");
			//else
			//    css.Register("resources/css/ext-all.css");

			css.Register("resources/css/ext-all" + CssThemeSuffix + ".css");
        }
    }
}
