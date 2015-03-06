using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Dextop.Tools;
using Codaxy.Common.Reflection;
using Codaxy.Common.Globalization;
using System.Globalization;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Assembly preprocessors which generates Models.
	/// </summary>
    public class DextopModelPreprocessor: IDextopAssemblyPreprocessor
    {
        public Func<Type, IDextopAssemblyPreprocessor, bool> TypeFilter { get; set; }

        void IDextopAssemblyPreprocessor.ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream, Stream cacheStream)
        {
            var typeFilter = TypeFilter ?? ((x, y) => true);

			using (var sw = new StreamWriter(outputStream))
            {
                var jw = new DextopJsWriter(sw);
                foreach (var model in application.ModelManager.models)
                {
                    WriteModel(jw, model.Value);
                }
                
                foreach (var a in assemblies)
                {
                    var list = AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DextopModelAttribute>(a, false);
                    foreach (var t in list)
                        if (typeFilter(t.Key, this))
                        {
                            var model = application.ModelManager.BuildModel(t.Key, t.Value);
                            WriteModel(jw, model);
                        }
                }
            }
        }

		private static void WriteModel(DextopJsWriter jw, DextopModel model)
		{
			jw.WriteLine("Ext.define('{0}',", model.Meta.ModelName);
			jw.WriteObject(model);
			jw.WriteLine(");");
		}

        bool IDextopAssemblyPreprocessor.Cachable
        {
            get { return false; }
        }

        void IDextopAssemblyPreprocessor.LoadCache(DextopApplication application, IList<Assembly> assemblies, Stream cacheStream)
        {
            throw new NotSupportedException();
        }
    }
}
