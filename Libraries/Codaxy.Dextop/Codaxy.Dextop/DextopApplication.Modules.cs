using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;

namespace Codaxy.Dextop
{
    public partial class DextopApplication
    {
        List<DextopModule> Modules = new List<DextopModule>();

		/// <summary>
		/// Registers the module.
		/// </summary>
		/// <param name="virtualPath">The virtual path.</param>
		/// <param name="module">The module.</param>
        protected void RegisterModule(String virtualPath, DextopModule module)
        {            
            module.PhysicalPath = DextopUtil.MapPath(virtualPath);
            module.VirtualPath = virtualPath;
            module.Application = this;
            Modules.Add(module);            
        }

		/// <summary>
		/// Optimizes the modules.
		/// </summary>
		/// <param name="outputVirtualPath">The output virtual path.</param>
        /// <param name="fakeOptimization">Forces fake optimization. (Preprocessor mode)</param>
        protected void OptimizeModules(String outputVirtualPath, bool fakeOptimization = false)
        {
            var outputModule = new DextopResourceOptimizationModule()
            {
                PhysicalPath = DextopUtil.MapPath(outputVirtualPath),
                VirtualPath = outputVirtualPath
            };

            var context = new DextopResourceOptimizationContext
            {
                OptimizationOutputModule = outputModule,
                FakeOptimization = fakeOptimization
            };

            foreach (var m in Modules)
                m.OptimizeResources(context);            
        }

		/// <summary>
		/// Gets the JS files registered in all modules.
		/// </summary>
		/// <param name="culture">The culture.</param>
		/// <returns></returns>
        public string[] GetJsFiles(CultureInfo culture)
        {
            var lang = MapCultureToLanguageCode(culture);            
            return Modules.SelectMany(a => a.GetJsFiles(lang)).Select(b=>DextopUtil.AbsolutePath(b)).ToArray();
        }

		/// <summary>
		/// Gets the CSS files registered in all modules.
		/// </summary>
		/// <param name="culture">The culture.</param>
		/// <returns></returns>
        public string[] GetCssFiles(CultureInfo culture)
        {
            var lang = MapCultureToLanguageCode(culture);            
            return Modules.SelectMany(a => a.GetCssFiles(lang).Select(b=>DextopUtil.AbsolutePath(b))).ToArray();
        }		

		internal IList<DextopModule> GetModules()
		{
			return Modules;
		}
    }
}
