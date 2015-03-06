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
            preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "remote.js"), new DextopRemotingPreprocessor() { TypeFilter = PreprocessingTypeFilter });
            
            if (!Application.PreprocessingEnabled || Application.PreprocessorMode)
            {
                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "model.js"), new DextopModelPreprocessor() { TypeFilter = PreprocessingTypeFilter });
                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "headers.js"), new DextopGridHeaderPreprocessor() { TypeFilter = PreprocessingTypeFilter });
                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "forms.js"), new DextopFormPreprocessor() { TypeFilter = PreprocessingTypeFilter });
                preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "enums.js"), new DextopEnumPreprocessor() { TypeFilter = PreprocessingTypeFilter });
            }
		}

        /// <summary>
        /// Registers standard data loaders
        /// </summary>
        /// <param name="generatedFilesPath">The generated files path.</param>
        /// <param name="loaders">The loaders.</param>
        protected void RegisterStandardFileLoaders(String generatedFilesPath, Dictionary<String, IDextopFileLoader> loaders)
        {
            
        }        
    }
}
