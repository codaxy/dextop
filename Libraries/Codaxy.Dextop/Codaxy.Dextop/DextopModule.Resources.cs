using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Codaxy.Dextop
{
    public partial class DextopModule
    {
        List<DextopJsResourcePackage> JsPackages { get; set; }
        List<DextopCssResourcePackage> CssPackages { get; set; }		

		/// <summary>
		/// Shortcut for CreateJsPackage(package).Register(...).
		/// </summary>
		/// <param name="package">The package.</param>
		/// <param name="pathPrefix">The path prefix.</param>
		/// <param name="files">The files.</param>
        public void RegisterJs(String package, String pathPrefix, params String[] files)
        {
            var p = CreateJsPackage(package);
            p.Register(pathPrefix, files);
        }

		/// <summary>
		/// Creates the new JS package used by the module.
		/// </summary>
		/// <param name="package">The package.</param>
		/// <returns></returns>
        public DextopJsResourcePackage CreateJsPackage(String package)
        {
            var p = new DextopJsResourcePackage(this, package)
            {
                Concate = true,
                Minify = true,
                SmartOverwrite = SmartOverwrite,
                External = UsingExternalResources
            };
            if (JsPackages == null)
                JsPackages = new List<DextopJsResourcePackage>();
            JsPackages.Add(p);
            return p;
        }

		/// <summary>
		/// Creates the new CSS package.
		/// </summary>
		/// <returns></returns>
        public DextopCssResourcePackage CreateCssPackage()
        {
            var p = new DextopCssResourcePackage(this)
            {
                Minify = true,
                SmartOverwrite = SmartOverwrite,
                External = UsingExternalResources
            };
            if (CssPackages == null)
                CssPackages = new List<DextopCssResourcePackage>();
            CssPackages.Add(p);
            return p;
        }

		/// <summary>
		/// Shortcut for CreateCssPackage().Register(...).
		/// </summary>
		/// <param name="path">The path.</param>
		/// <param name="minify">if set to <c>true</c> [minify].</param>
        public void RegisterCss(String path, bool minify = true)
        {
            var p = CreateCssPackage();
            p.Minify = minify;
            p.Register(path);
        }	

		/// <summary>
		/// Gets the list of all js files required by the module.
		/// </summary>
		/// <param name="language">The language.</param>
		/// <returns></returns>
        public String[] GetJsFiles(string language)
        {
            if (JsPackages == null)
                return new string[0];
            return JsPackages.SelectMany(a => a.GetPaths(language)).ToArray();
        }

		/// <summary>
		/// Gets the list of all CSS files required by the module.
		/// </summary>
		/// <param name="language">The language.</param>
		/// <returns></returns>
		public String[] GetCssFiles(string language)
		{
			if (CssPackages == null)
				return new string[0];
			return CssPackages.SelectMany(a => a.GetPaths(language)).ToArray();
		}				

		/// <summary>
		/// Maps the virtual path to the physical.
		/// </summary>
		/// <param name="path">The path.</param>
		/// <returns></returns>
        public string MapPath(string path)
        {
            var colonHack = path.Replace(":", "..");
            return Path.Combine(PhysicalPath, colonHack);
        }

		/// <summary>
		/// Optimizes the module resources by using concatenation, minifying and compressing techniques.
		/// </summary>
		/// <param name="context">The context.</param>
        public virtual void OptimizeResources(DextopResourceOptimizationContext context)
        {
            if (JsPackages != null)
                foreach (var pkg in JsPackages)
                    pkg.Optimize(context);

            if (CssPackages != null)
                foreach (var pkg in CssPackages)
                    pkg.Optimize(context);
        }
    }
}
