using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop
{
	/// <summary>
	/// A base class describing one part of the application.
	/// </summary>
    public abstract partial class DextopModule
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopModule"/> class.
		/// </summary>
        public DextopModule()
        {
			SmartOverwrite = true;
        }

		/// <summary>
		/// Gets or sets the virtual path associated with the module.
		/// </summary>	
        protected internal string VirtualPath { get; set; }        
		internal String PhysicalPath { get; set; }
        internal DextopApplication Application { get; set; }

		/// <summary>
		/// Gets the name of the module.
		/// </summary>
        public abstract string ModuleName { get; }

		/// <summary>
		/// Setup mapping of module's namespaces.
		/// </summary>
        protected abstract void InitNamespaces();

		/// <summary>
		/// Default True. If SmartOverwrite is set module preprocessors will not overwrite generated files unless content has changed.
		/// File timestamp will be preserved.
		/// </summary>
		protected bool SmartOverwrite { get; set; }


		/// <summary>
		/// Gets the assemblies required by the module.
		/// </summary>
		/// <returns></returns>
        protected virtual IList<Assembly> GetAssemblies()
        {
            return new[] { this.GetType().Assembly };
        }

		/// <summary>
		/// Override this module to register any of the assembly preprocessors.
		/// </summary>
		/// <param name="preprocessors">The preprocessors.</param>
        protected abstract void RegisterAssemblyPreprocessors(Dictionary<String, IDextopAssemblyPreprocessor> preprocessors);

		/// <summary>
		/// Initializes the module resources.
		/// </summary>
        protected abstract void InitResources();


		/// <summary>
		/// Initializes the module.
		/// </summary>
        public void Initialize()
        {            
            InitNamespaces();
            var assemblies = GetAssemblies();
            var preprocessors = new Dictionary<String, IDextopAssemblyPreprocessor>();
            RegisterAssemblyPreprocessors(preprocessors);
            PreprocessAssemblies(assemblies, preprocessors);
            InitResources();
        }

		/// <summary>
		/// Register session within the module. Module can optionaly create a remotable object associated with the session.
		/// </summary>
		/// <param name="session"></param>
		/// <returns></returns>
		protected internal virtual IDextopRemotable RegisterSession(DextopSession session) { return null; }

		private void PreprocessAssemblies(IList<Assembly> assemblies, Dictionary<String, IDextopAssemblyPreprocessor> preprocessors)
		{
			foreach (var p in preprocessors)
			{
				byte[] content;
				using (var s = new MemoryStream())
				{
					p.Value.ProcessAssemblies(Application, assemblies, s);
					content = s.ToArray();
				}
				bool write = true;
				var path = MapPath(p.Key);

				if (SmartOverwrite)
				{
					var fileInfo = new FileInfo(path);
					if (fileInfo.Exists && fileInfo.Length == content.Length)
					{
						//file exists and it's of the same length. 
						//check byte by byte if files are equal					
						using (var stream = fileInfo.OpenRead())
						{
							bool skip = true;
							for (var i = 0; i < content.Length; i++)
								if (content[i] != stream.ReadByte())
								{
									skip = false;
									break;
								}
							write = !skip;
						}
					}
				}

				if (write)
					File.WriteAllBytes(path, content);
			}
		}

        internal IEnumerable<string> PrefixVirtualPath(IEnumerable<string> list)
        {
            return list.Select(a => DextopUtil.CombinePaths(VirtualPath, a));
        }
    }

	/// <summary>
	/// 
	/// </summary>
    public class DextopResourceOptimizationContext
    {
		/// <summary>
		/// Gets or sets the output module.
		/// </summary>		
        public DextopModule OptimizationOutputModule { get; set; }
    }
}
