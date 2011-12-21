using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Forms;

namespace Codaxy.Dextop
{
    public partial class DextopModule
    {
		/// <summary>
		/// Register standard assembly preprocessors such as remoting, model, grid and forms preprocessors.
		/// </summary>
		/// <param name="generatedFilesPath"></param>
		/// <param name="preprocessors"></param>
		protected void RegisterStandardAssemblyPreprocessors(string generatedFilesPath, Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
		{
            if (!Application.PreprocessingEnabled || Application.PreprocessorMode)
            {
                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "remote.js"), new DextopRemotingPreprocessor());

                if (Application.PreprocessingEnabled)
                    preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "constructors.config"), new DextopRemotableConstructorPreprocessor());

                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "model.js"), new DextopModelPreprocessor());
                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "headers.js"), new DextopGridHeaderPreprocessor());
                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "forms.js"), new DextopFormPreprocessor());
                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "enums.js"), new DextopEnumPreprocessor());
            }
		}

        /// <summary>
        /// Registers standard data loaders
        /// </summary>
        /// <param name="generatedFilesPath">The generated files path.</param>
        /// <param name="loaders">The loaders.</param>
        protected void RegisterStandardFileLoaders(String generatedFilesPath, Dictionary<String, IDextopFileLoader> loaders)
        {
            if (Application.PreprocessingEnabled && !Application.PreprocessorMode)
            {
                loaders.Add(DextopUtil.CombinePaths(generatedFilesPath, "constructors.config"), new DextopRemotableConstructorLoader());
            }
        }        
    }
}
