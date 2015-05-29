using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Common.Reflection;
using Codaxy.Dextop.Tools;
using Codaxy.Common.Globalization;
using System.Globalization;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Generate Dextop form columns.
	/// </summary>
    public class DextopGridHeaderPreprocessor : IDextopAssemblyPreprocessor
    {
        public Func<Type, IDextopAssemblyPreprocessor, bool> TypeFilter { get; set; }

        void IDextopAssemblyPreprocessor.ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream, Stream cacheStream)
        {
            var typeFilter = TypeFilter ?? ((x, y) => true);

            using (var w = new StreamWriter(outputStream))
            {
                var jw = new DextopJsWriter(w, DextopJsWriterOptions.Localization | DextopJsWriterOptions.ItemFactory);
                foreach (var assembly in assemblies)
                {
                    var headerTypes = AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DextopGridAttribute>(assembly, false);

                    foreach (var cap in headerTypes)
                        if (typeFilter(cap.Key, this))
                        {
                            var type = cap.Key;
                            var headers = DextopGridManager.BuildHeaders(type);
                            var name = application.MapTypeName(type, ".columns");
                            jw.Write("Ext.define('{0}', ", name);
                            jw.StartLocalizationScope();
                            jw.StartBlock();
                            jw.AddProperty("extend", "Dextop.ItemFactory");
                            jw.StartFunctionBlock("getDictionary");
                            jw.WriteLine("var dict = {};");
                            WriteDictRecursively(jw, headers);
                            jw.WriteLine("return dict;");
                            jw.CloseBlock();
                            jw.StartFunctionBlock("buildItems", "dict");
                            jw.Write("return [");
                            for (var i = 0; i < headers.Count; i++)
                            {
                                if (i > 0)
                                    jw.Write(", ");
                                jw.Write("dict['{0}']", headers[i].id);
                            }
                            jw.Write("];");
                            jw.CloseBlock();//function
                            jw.WriteLocalizations();
                            jw.CloseBlock();
                            jw.WriteLine(");"); //Ext.define(

                            jw.Flush();
                        }
                }
            }
        }

        private void WriteDictRecursively(DextopJsWriter jw, IList<DextopGridColumn> headers)
        {
            foreach (var field in headers)
            {
                if (field.HasColumns)
                    WriteDictRecursively(jw, field.Columns);
                
                    jw.Write("dict[\"{0}\"] = ", field.id);
                    jw.WriteObject(field);
                    jw.WriteLine(";");
            }
        }

        bool IDextopAssemblyPreprocessor.Cacheable
        {
            get { return false; }
        }

        void IDextopAssemblyPreprocessor.LoadCache(DextopApplication application, IList<Assembly> assemblies, Stream cacheStream)
        {
            throw new NotSupportedException();
        }
    }
}
