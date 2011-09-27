using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;
using System.IO;

namespace Codaxy.Dextop
{
	/// <summary>
	/// A class used to manages module's CSS files.
	/// </summary>
    public class DextopCssResourcePackage
    {
        DextopResourcePackage package;

		/// <summary>
		/// When enabled result js files will not be overriden until source files are modified.
		/// </summary>
		public bool SmartOverwrite { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopCssResourcePackage"/> class.
		/// </summary>
		/// <param name="module">The module.</param>
        public DextopCssResourcePackage(DextopModule module)
        {
            package = new DextopResourcePackage(module);
        }

		/// <summary>
		/// Registers the CSS files with specified virtual paths.
		/// </summary>
		/// <param name="virtualPaths">The virtual paths.</param>
        public void Register(params string[] virtualPaths)
        {
            foreach (var vpath in virtualPaths)
                package.AddFiles(package.SearchServer(vpath, ".css", true));
        }

		/// <summary>
		/// Registers the localization files.
		/// </summary>
		/// <param name="language">The lang.</param>
		/// <param name="virtualPathFormats">The virtual path formats.</param>
        public void RegisterLocalization(string language, params string[] virtualPathFormats)
        {
            foreach (var vpath in virtualPathFormats)
                package.AddLocalization(language, package.SearchServer(String.Format(vpath, language), ".css", false));
        }

		/// <summary>
		/// Registers the localizations for multiple languages using path formats. '{0}' in the path format
		/// will be replaced with the language code.
		/// </summary>
		/// <param name="languages">The langs.</param>
		/// <param name="virtualPathFormats">The virtual path formats.</param>
        public void RegisterLocalizations(string[] languages, params string[] virtualPathFormats)
        {
            foreach (var lang in languages)
                RegisterLocalization(lang, virtualPathFormats);
        }

		/// <summary>
		/// Optimizes the content of the package.
		/// </summary>
		/// <param name="context">The context.</param>
        public void Optimize(DextopResourceOptimizationContext context)
        {
            OptimizeFileList(package.Files);

            if (package.Localizations != null)
                foreach (var loc in package.Localizations)
                    OptimizeFileList(loc.Value);
        }

        void OptimizeFileList(List<string> files)
        {
            for (var i = 0; i < files.Count; i++)
            {
				var filePath = package.Module.MapPath(files[i]);
			
				DateTime lastWrite;
                var cb = DextopFileUtil.CalculateCacheBuster(new [] { filePath }, out lastWrite);
                if (Minify)
                {					
					var outputPath = new FileInfo(filePath.Substring(0, filePath.Length - 4) + "-min.css");
					if (!SmartOverwrite || !outputPath.Exists || outputPath.LastAccessTime <= lastWrite)
					{
						var css = File.ReadAllText(filePath);
						css = DextopFileUtil.MinifyCss(css);
						File.WriteAllText(outputPath.FullName, css);
						files[i] = files[i].Substring(0, files[i].Length - 4) + "-min.css";
					}
                }
                files[i] = files[i] + "?cb=" + cb;
            }
        }

		/// <summary>
		/// Gets the virtual paths of the files in the package.
		/// </summary>
		/// <param name="language">The language.</param>
		/// <returns></returns>
        public IList<String> GetPaths(String language) { return package.GetFiles(language); }

		/// <summary>
		/// Gets or sets a value indicating whether css files should be minified.
		/// </summary>		
        public bool Minify { get; set; }
    }
}
