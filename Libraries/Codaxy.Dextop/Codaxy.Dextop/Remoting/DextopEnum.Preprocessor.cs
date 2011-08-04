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
		/// <summary>
		/// Processes the assemblies and generates the code.
		/// </summary>
		/// <param name="application">The application.</param>
		/// <param name="assemblies">The assemblies.</param>
		/// <param name="outputStream">The output stream.</param>
        public void ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream)
        {
			using (var sw = new StreamWriter(outputStream))
            {
                foreach (var assembly in assemblies)
                {
					var types = Common.Reflection.AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DextopEnumAttribute>(assembly, false);					
                    foreach (var type in types)
						if (type.Key.IsEnum)
						{
							WriteType(application, sw, type.Key);
						}
                }
            }
        }

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
    }
}
