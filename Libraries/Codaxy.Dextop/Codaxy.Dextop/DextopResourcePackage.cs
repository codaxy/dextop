using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Class for managing file list of JS and CSS packages.
	/// </summary>
    public class DextopResourcePackage
    {
		/// <summary>
		/// Gets the module associated with the package.
		/// </summary>
		public DextopModule Module { get; private set; }

		/// <summary>
		/// Gets the files in the package.
		/// </summary>
		public List<String> Files { get; private set; }

		/// <summary>
		/// Gets the localizations dictionary in the package.
		/// </summary>
		public Dictionary<String, List<String>> Localizations { get; private set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopResourcePackage"/> class.
		/// </summary>
		/// <param name="module">The module.</param>
        public DextopResourcePackage(DextopModule module)
        {
            Module = module;            
            Files = new List<string>();
        }

		/// <summary>
		/// Adds the files.
		/// </summary>
		/// <param name="files">The files.</param>
        public void AddFiles(IEnumerable<String> files)
        {
            AddFilesToList(Files, files);
        }

		/// <summary>
		/// Adds the localization files.
		/// </summary>
		/// <param name="lang">The lang.</param>
		/// <param name="files">The files.</param>
        public void AddLocalization(String lang, IEnumerable<string> files)
        {
            if (lang == null)
                throw new ArgumentNullException("code");
            if (Localizations == null)
                Localizations = new Dictionary<string, List<string>>();
            List<string> list;
            if (!Localizations.TryGetValue(lang, out list))
                Localizations.Add(lang, list = new List<string>());
            AddFilesToList(list, files);
        }
		
        void AddFilesToList(List<String> list, IEnumerable<String> files)
        {
            foreach (var file in files)
                if (list.IndexOf(file) == -1)
                    list.Add(file);
        }

		/// <summary>
		/// Searches the server for resource files.
		/// </summary>
		/// <param name="virtualPath">The virtual path.</param>
		/// <param name="extension">The extension.</param>
		/// <param name="throwIfNotFound">if set to <c>true</c> [throw if not found].</param>
		/// <returns></returns>
        public IList<string> SearchServer(String virtualPath, string extension, bool throwIfNotFound)
        {
            var files = new List<String>();
            if (virtualPath.EndsWith(extension, StringComparison.InvariantCultureIgnoreCase))
            {
                var fpath = Module.MapPath(virtualPath);
                if (File.Exists(fpath))
                    files.Add(virtualPath);
                else if (throwIfNotFound)
                    throw new InvalidDextopPackagePathException(DextopUtil.CombinePaths(Module.VirtualPath, virtualPath));
            }
            else if (virtualPath.EndsWith("/"))
            {
                bool recursive = virtualPath.EndsWith("/*/") || virtualPath.EndsWith("//");
                if (recursive)
                    virtualPath = virtualPath.TrimEnd('/', '*');
                String location = Module.MapPath(virtualPath);
                var list = Directory.GetFiles(location, "*" + extension, recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly);
                foreach (var f in list)
                {
                    var p = DextopUtil.CombinePaths(virtualPath, f.Substring(location.Length).Replace('\\', '/'));
                    files.Add(p);
                }
            }
            else
                throw new InvalidDextopPackagePathException(DextopUtil.CombinePaths(Module.VirtualPath, virtualPath));
            return files;
        }

		/// <summary>
		/// Gets the files in the package.
		/// </summary>
		/// <param name="lang">The lang.</param>
		/// <returns></returns>
        public IList<String> GetFiles(String lang)
        {
            List<String> res = new List<string>();
            res.AddRange(Module.PrefixVirtualPath(Files));
            List<string> loc;
            if (lang != null && Localizations != null && Localizations.TryGetValue(lang, out loc))
                res.AddRange(Module.PrefixVirtualPath(loc));
            return res;
        }
    }
}
