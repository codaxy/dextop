using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Interface for Dextop code generators.
	/// </summary>
    public interface IDextopAssemblyPreprocessor
    {
        /// <summary>
        /// Processes the assemblies and generates the code.
        /// </summary>
        /// <param name="application">The application.</param>
        /// <param name="assemblies">The assemblies.</param>
        /// <param name="outputStream">The output stream.</param>
        /// <param name="cacheStream">The cache stream.</param>
        void ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream, Stream cacheStream);

        /// <summary>
        /// If true, cache stream will be provided on process assemblies and loaded.
        /// </summary>
        bool Cachable { get; }

        /// <summary>
        /// Load meta data from cache, instead of processing everything.
        /// </summary>
        /// <param name="application">The application.</param>
        /// <param name="assemblies">The assemblies.</param>
        /// <param name="cacheStream">The cache stream.</param>
        void LoadCache(DextopApplication application, IList<Assembly> assemblies, Stream cacheStream);
    }   
}
