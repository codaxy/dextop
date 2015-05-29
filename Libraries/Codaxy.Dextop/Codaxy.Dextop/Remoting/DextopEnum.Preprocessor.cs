using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Common.Reflection;

namespace Codaxy.Dextop.Remoting
{
	/// <summary>
	/// Generates remote enumerations.
	/// </summary>
    public class DextopEnumPreprocessor : IDextopAssemblyPreprocessor
    {		
		Type remotableInterfaceType = typeof(IDextopRemotable);
        Type formSubmitType = typeof(DextopFormSubmit);

		private void WriteType(DextopApplication application, StreamWriter sw, Type type)
		{
			var typeName = GetTypeName(application, type);

			sw.WriteLine("Ext.define('{0}', {{", typeName);
			sw.WriteLine("\tstatics: {");
			bool first = true;
			foreach (var ev in Enum.GetValues(type))
			{
				if (first)
					first = false;
				else
					sw.WriteLine(",");
				sw.Write("\t\t{0}: {1}", Enum.GetName(type, ev), (int)ev);
			}
			sw.WriteLine();
			sw.WriteLine("\t}");
			sw.WriteLine("});");
			sw.WriteLine();
		}

        internal string GetTypeName(DextopApplication application, Type type)
        {
			var name = application.MapTypeName(type);
			return name;
        }

        void IDextopAssemblyPreprocessor.ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream, Stream cacheStream)
        {
            var typeFilter = TypeFilter ?? ((x, y) => true);

            using (var sw = new StreamWriter(outputStream))
            {
                foreach (var assembly in assemblies)
                {
                    var types = Common.Reflection.AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DextopEnumAttribute>(assembly, false);
                    foreach (var type in types)
                        if (typeFilter(type.Key, this) && type.Key.IsEnum)
                        {
                            WriteType(application, sw, type.Key);
                        }
                }
            }
        }

        public Func<Type, IDextopAssemblyPreprocessor, bool> TypeFilter { get; set; }

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
