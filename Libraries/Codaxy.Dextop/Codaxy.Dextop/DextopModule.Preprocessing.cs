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
			preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "remote.js"), new DextopRemotingPreprocessor());
			preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "model.js"), new DextopModelPreprocessor());
			preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "headers.js"), new DextopGridHeaderPreprocessor());
			preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "forms.js"), new DextopFormPreprocessor());
			preprocessors.Add(DextopUtil.CombinePaths(generatedFilesPath, "enums.js"), new DextopEnumPreprocessor());
		}
    }
}
