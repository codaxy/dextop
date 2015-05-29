using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Dextop.Remoting;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

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
        /// Set to true if resources cannot be found in this project
        /// </summary>
        public bool UsingExternalResources { get; set; }


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
            DateTime assemblyLastWriteTime = DateTime.MinValue;
            if (SmartOverwrite)
            {
                foreach (var a in assemblies)
                {
                    var assemblyWriteTime = File.GetLastWriteTime(a.Location);
                    if (assemblyWriteTime > assemblyLastWriteTime)
                        assemblyLastWriteTime = assemblyWriteTime;
                }
            }

            Parallel.ForEach(preprocessors, p =>
            {
                var outputPath = MapPath(p.Key);

                if (SmartOverwrite)
                {
                    var fileInfo = new FileInfo(outputPath);
                    if (p.Value.Cacheable)
                    {
                        var cacheInfo = new FileInfo(Path.ChangeExtension(fileInfo.FullName, ".cache"));
                        if (cacheInfo.Exists && cacheInfo.LastWriteTime > assemblyLastWriteTime)
                        {
                            using (var cs = cacheInfo.OpenRead())
                                try
                                {
                                    p.Value.LoadCache(Application, assemblies, cs);
                                    return;
                                }
                                catch (Exception ex)
                                {
                                    Debug.WriteLine(ex);
                                    //Fallback to assembly processing
                                }
                        }
                    }
                    else if (fileInfo.Exists && fileInfo.LastWriteTime > assemblyLastWriteTime)
                        return;
                }

                //If processing fails for any reason, make sure that we don't have an invalid file with new timestamp

                String cachePath = Path.ChangeExtension(outputPath, ".cache");
                String tmpOutputPath = outputPath + ".tmp";
                String tmpCachePath = cachePath + ".tmp";

                Stream cacheStream = p.Value.Cacheable ? File.Create(tmpCachePath) : null;
                Stream outputStream = File.Create(tmpOutputPath);

                using (cacheStream)
                using (outputStream)
                {
                    p.Value.ProcessAssemblies(Application, assemblies, outputStream, cacheStream);
                }

                File.Delete(outputPath);                
                File.Move(tmpOutputPath, outputPath);

                if (p.Value.Cacheable)
                {
                    File.Delete(cachePath);
                    File.Move(tmpCachePath, cachePath);
                }
            });
        }

        internal IEnumerable<string> PrefixVirtualPath(IEnumerable<string> list)
        {
            foreach (var a in list)
            {
                var colonHack = a.Replace(":/", "");
                yield return DextopUtil.CombinePaths(VirtualPath, colonHack);
            }
        }

        protected virtual bool PreprocessingTypeFilter(Type type, IDextopAssemblyPreprocessor preprocessor)
        {
            return true;
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
