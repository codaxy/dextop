using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Common.Reflection;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Generate Dextop form columns.
	/// </summary>
    public class DextopGridHeaderPreprocessor : IDextopAssemblyPreprocessor
    {
		/// <summary>
		/// Processes the assemblies and generates the code.
		/// </summary>
		/// <param name="application">The application.</param>
		/// <param name="assemblies">The assemblies.</param>
		/// <param name="outputStream">The output stream.</param>
        public void ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream)
        {
            using (var w = new StreamWriter(outputStream))
            {
                var jw = new DextopJsWriter(w, DextopJsWriterOptions.Localization | DextopJsWriterOptions.ItemFactory);
                foreach (var assembly in assemblies)
                {
                    var headerTypes = AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DextopGridAttribute>(assembly, false);

                    foreach (var cap in headerTypes)
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
    }
}
