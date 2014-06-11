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
        /// Don't load Ext CSS files. Useful when using custom themes.
        /// </summary>
        public bool SkipCss { get; set; }

        /// <summary>
        /// Don't load localized files.
        /// </summary>
        public bool SkipLocalizations { get; set; }

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
        /// </summary>
        /// <param name="loaders"></param>
        protected override void RegisterLoaders(Dictionary<string, IDextopFileLoader> loaders)
        {
            
        }

		/// <summary>
		/// Initializes the module resources.
		/// </summary>
        protected override void InitResources()
        {
            string debugSuffix = Debug ? "-debug" : "";

            var js = CreateJsPackage("ext");
            js.Concate = false;
            js.Register(String.Format("ext-all{0}.js", debugSuffix));

            if (!SkipLocalizations)
                js.RegisterLocalizations(new[] { "sr", "ru", "fr", "de", "da" }, "locale/", "ext-lang-{0}.js");

            var css = CreateCssPackage();
            css.Minify = false;
            if (!SkipCss)
            {
                var name = "ext-theme" + CssThemeSuffix;
                css.Register(String.Format("packages/{0}/build/resources/{0}-all{1}.css", name, debugSuffix));
            }
        }
    }
}
