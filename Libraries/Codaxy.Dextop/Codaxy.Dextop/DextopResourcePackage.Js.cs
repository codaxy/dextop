using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;
using System.IO;

namespace Codaxy.Dextop
{
	/// <summary>
	/// A class used to manages module's JS files.
	/// </summary>
    public class DextopJsResourcePackage
    {
        DextopResourcePackage package;
		
		/// <summary>
		/// Gets or sets the name of the package.
		/// </summary>		
        protected string PackageName { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopJsResourcePackage"/> class.
		/// </summary>
		/// <param name="module">The module.</param>
		/// <param name="name">The name.</param>
        public DextopJsResourcePackage(DextopModule module, String name)
        {
            package = new DextopResourcePackage(module);
            PackageName = name;
        }

		/// <summary>
		/// Gets or sets a value indicating whether JS content should be obfuscated.
		/// </summary>		
        public bool Obfuscate { get; set; }

		/// <summary>
		/// Gets or sets a value indicating whether JS content should be concatenated to one file.
		/// </summary>	
		public bool Concate { get; set; }
		/// <summary>
		/// Gets or sets a value indicating whether JS content should be minified.
		/// </summary>	
        public bool Minify { get; set; }

		/// <summary>
		/// When enabled result js files will not be overriden until source files are modified.
		/// </summary>
		public bool SmartOverwrite { get; set; }

        /// <summary>
        /// Set to true if resources are not in this project
        /// </summary>
        public bool External { get; set; }

		/// <summary>
		/// Registers the files the specified path prefix.
		/// </summary>
		/// <param name="pathPrefix">The path prefix to be applied to all paths.</param>
		/// <param name="virtualPaths">The virtual path list.</param>
        public void Register(String pathPrefix, params string[] virtualPaths)
        {
            if (virtualPaths == null || virtualPaths.Length == 0)
            {
                virtualPaths = new[] { pathPrefix };
                pathPrefix = "";
            }

            if (External)
            {
                package.AddFiles(virtualPaths.Select(vpath=>DextopUtil.CombinePaths(pathPrefix, vpath)));
            }
            else
            {
                if (package.Module.Application.PreprocessingEnabled && !package.Module.Application.PreprocessorMode)
                    return;

                foreach (var vpath in virtualPaths)
                    package.AddFiles(package.SearchServer(DextopUtil.CombinePaths(pathPrefix, vpath), ".js", true));
            }
        }

		/// <summary>
		/// Registers the localization files.
		/// </summary>
		/// <param name="language">The language code.</param>
		/// <param name="pathPrefix">The path prefix to be applied to all paths.</param>
		/// <param name="virtualPathFormats">The virtual path formats.</param>
        public void RegisterLocalization(string language, String pathPrefix, params string[] virtualPathFormats)
        {
            foreach (var vpath in virtualPathFormats)
            {
                if (External)
                {
                    if (vpath.EndsWith("/"))
                        throw new DextopException("Folders are not allowed on external modules.");
                    package.AddLocalization(language, new[] { DextopUtil.CombinePaths(pathPrefix, String.Format(vpath, language)) });
                }
                else
                    package.AddLocalization(language, package.SearchServer(DextopUtil.CombinePaths(pathPrefix, String.Format(vpath, language)), ".js", false));
            }
        }

		/// <summary>
		/// Registers the localizations files for multiple languages using path formats. '{0}' in the path format
		/// will be replaced with the language code.
		/// </summary>
		/// <param name="languages">The languages.</param>
		/// <param name="pathPrefix">The path prefix.</param>
		/// <param name="virtualPathFormats">The virtual path formats.</param>
        public void RegisterLocalizations(string[] languages, String pathPrefix, params string[] virtualPathFormats)
        {
            foreach (var lang in languages)
                RegisterLocalization(lang, pathPrefix, virtualPathFormats);
        }

		/// <summary>
		/// Optimizes the JS files inside the package.
		/// </summary>
		/// <param name="context">The context.</param>
        public void Optimize(DextopResourceOptimizationContext context)
        {
            if (External)
                return;

            if (Concate)
            {
                var pkg = new DextopResourcePackage(context.OptimizationOutputModule);

                var fileName = package.Module.ModuleName + "-" + PackageName + ".js";

                if (!context.FakeOptimization)
                {
                    var filePaths = package.Files.Select(a => package.Module.MapPath(a)).ToArray();
                    DateTime lastWrite;
                    int cacheBuster = DextopFileUtil.CalculateCacheBuster(filePaths, out lastWrite);
                    var outputFile = new FileInfo(context.OptimizationOutputModule.MapPath(fileName));
                    if (!SmartOverwrite || !outputFile.Exists || outputFile.LastWriteTime <= lastWrite)
                    {
                        var js = DextopFileUtil.ConcateFiles(filePaths);
                        if (Minify)
                            js = DextopFileUtil.MinifyJs(js, Obfuscate);
                        DextopFileUtil.WriteTextFile(outputFile.FullName, js);
                    }
                }

                pkg.AddFiles(new[] { fileName });

                if (package.Localizations != null)
                    foreach (var loc in package.Localizations)
                    {
                        fileName = package.Module.ModuleName + "-" + PackageName + String.Format(".locale-{0}.js", loc.Key);

                        if (!context.FakeOptimization)
                        {
                            var filePaths = loc.Value.Select(a => package.Module.MapPath(a)).ToArray();
                            DateTime lastWrite;
                            var cacheBuster = DextopFileUtil.CalculateCacheBuster(filePaths, out lastWrite);
                            var outputFile = new FileInfo(context.OptimizationOutputModule.MapPath(fileName));
                            if (!SmartOverwrite || !outputFile.Exists || outputFile.LastWriteTime <= lastWrite)
                            {
                                var js = DextopFileUtil.ConcateFiles(filePaths);
                                js = DextopFileUtil.ConcateFiles(filePaths);
                                if (Minify)
                                    js = DextopFileUtil.MinifyJs(js, Obfuscate);
                                DextopFileUtil.WriteTextFile(outputFile.FullName, js);
                            }
                            fileName += "?cb=" + cacheBuster;
                        }
                        pkg.AddLocalization(loc.Key, new[] { fileName });
                    }

                package = pkg;
            }

            AppendCacheBusters(package.Files);
            if (package.Localizations != null)
                foreach (var pl in package.Localizations)
                    AppendCacheBusters(pl.Value);
        }

        void AppendCacheBusters(List<string> list)
        {
            for (var i = 0; i < list.Count; i++)
                if (!list[i].Contains("?cb="))
                    list[i] += "?cb=" + DextopFileUtil.CalculateCacheBuster(package.Module.MapPath(list[i]));
        }

		/// <summary>
		/// Gets the resources associated with the package.
		/// </summary>
		/// <param name="language">The lang.</param>
		/// <returns></returns>
        public IList<String> GetPaths(String language) { return package.GetFiles(language); }
    }
}
