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
        void ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream);
    }
}
