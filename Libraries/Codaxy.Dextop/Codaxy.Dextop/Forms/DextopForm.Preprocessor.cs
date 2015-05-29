using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Common.Reflection;
using System.IO;
using Codaxy.Dextop.Tools;
using Codaxy.Dextop.Data;
using Codaxy.Common.Globalization;
using System.Globalization;
using System.Reflection;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Form code generation.
	/// </summary>
    public class DextopFormPreprocessor : IDextopAssemblyPreprocessor
    {
        public Func<Type, IDextopAssemblyPreprocessor, bool> TypeFilter { get; set; }

        void IDextopAssemblyPreprocessor.ProcessAssemblies(DextopApplication application, IList<System.Reflection.Assembly> assemblies, Stream outputStream, Stream cacheStream)
        {
            var typeFilter = TypeFilter ?? ((x, y) => true);

            using (var w = new StreamWriter(outputStream))
            {
                var jw = new DextopJsWriter(w, DextopJsWriterOptions.Localization);
                foreach (var assembly in assemblies)
                {
                    var formTypes = AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DextopFormAttribute>(assembly, false);
                    foreach (var formTypeAttribute in formTypes)
                        if (typeFilter(formTypeAttribute.Key, this))
                        {
                            var type = formTypeAttribute.Key;
                            var formFields = DextopFormBuilder.BuildForm(type);
                            var name = application.MapTypeName(type, ".form");
                            jw.Write("Ext.define('{0}', ", name);
                            jw.StartLocalizationScope();
                            jw.StartBlock();
                            jw.AddProperty("extend", "Dextop.ItemFactory");
                            jw.StartFunctionBlock("getDictionary", "options");
                            jw.WriteLine("options = options || {};");
                            jw.WriteLine("options.data = options.data || {};");
                            jw.WriteLine("var dict = Ext.apply({}, options.apply);");
                            WriteDictRecursively(jw, formFields);
                            jw.WriteLine("return dict;");
                            jw.CloseBlock();
                            jw.StartFunctionBlock("buildItems", "dict");
                            jw.Write("return [");
                            for (var i = 0; i < formFields.Count; i++)
                            {
                                if (i > 0)
                                    jw.Write(", ");
                                if (formFields[i].ItemName != null)
                                    jw.Write("dict['{0}']", formFields[i].ItemName);
                                else
                                    jw.WriteObject(formFields[i]);
                            }
                            jw.Write("];");
                            jw.CloseBlock();//function
                            jw.WriteLocalizations();
                            jw.CloseBlock();
                            jw.WriteLine(");"); //Ext.define(
                            jw.WriteLine();

                            jw.Flush();
                        }

                    
                }
            }
        }

        private void WriteDictRecursively(DextopJsWriter jw, IList<DextopFormObject> formFields)
        {
            foreach (var field in formFields)
            {
                WriteDictRecursively(jw, field.Items);
                if (field.ItemName != null)
                {
                    jw.Write("dict[\"{0}\"] = ", field.ItemName);
                    jw.WriteObject(field);
                    jw.WriteLine(";");
                }
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
