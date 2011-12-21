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


        /// <summary>
        /// Gets or sets the application.
        /// </summary>
        /// <value>
        /// The application.
        /// </value>
        protected internal DextopApplication Application { get; internal set; }

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
        /// 
        /// </summary>
        /// <param name="loaders"></param>
        protected abstract void RegisterLoaders(Dictionary<String, IDextopFileLoader> loaders);

		/// <summary>
		/// Initializes the module resources.
		/// </summary>
        protected abstract void InitResources();


		/// <summary>
		/// Initializes the module.
		/// </summary>
        internal void Initialize()
        {
            InitNamespaces();

            var assemblies = GetAssemblies();
            var preprocessors = new Dictionary<String, IDextopAssemblyPreprocessor>();
            RegisterAssemblyPreprocessors(preprocessors);
            PreprocessAssemblies(assemblies, preprocessors);

            var loaders = new Dictionary<String, IDextopFileLoader>();
            RegisterLoaders(loaders);
            ExecuteLoaders(loaders);
            InitResources();
        }

        private void ExecuteLoaders(Dictionary<string, IDextopFileLoader> loaders)
        {
            foreach (var kv in loaders)
            {
                var filePath = MapPath(kv.Key);
                if (!File.Exists(filePath))
                    throw new DextopException("File '{0}' not found and therefore cannot be loaded.", kv.Key);
                using (var fs = File.OpenRead(filePath))
                    kv.Value.Load(Application, this, fs);
            }
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

        /// <summary>
        /// Set fake optimization to true if preprocessor is used to generate resources in build time.
        /// </summary>
        public bool FakeOptimization { get; set; }
    }
}
