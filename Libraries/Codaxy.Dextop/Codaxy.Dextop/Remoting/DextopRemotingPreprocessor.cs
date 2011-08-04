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
	/// Generates remote proxies.
	/// </summary>
    public class DextopRemotingPreprocessor : IDextopAssemblyPreprocessor
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
                    var types = assembly.GetTypes().Where(t => remotableInterfaceType.IsAssignableFrom(t) && remotableInterfaceType != t);
					HashSet<Type> includedTypes = new HashSet<Type>();
                    foreach (var type in types)
                    {
						WriteType(application, sw, type, includedTypes);
                    }
                }
            }
        }

		Type remotableInterfaceType = typeof(IDextopRemotable);
        Type formSubmitType = typeof(DextopFormSubmit);

		private void WriteType(DextopApplication application, StreamWriter sw, Type type, HashSet<Type> includedTypes)
		{
			if (includedTypes.Contains(type))
				return;

			includedTypes.Add(type);

			var typeName = GetTypeName(application, type);

			if (type.BaseType != null && remotableInterfaceType.IsAssignableFrom(type.BaseType) && type.Assembly == type.BaseType.Assembly)
				WriteType(application, sw, type.BaseType, includedTypes);
				

			sw.WriteLine("Ext.define('{0}', {{", typeName);			

			if (type.BaseType != null && remotableInterfaceType.IsAssignableFrom(type.BaseType))
			{
				sw.Write("\textend: '{0}'", GetTypeName(application, type.BaseType));
			}
			else
			{
				sw.Write("\textend: 'Dextop.remoting.Proxy'");
			}

			bool constructor = false;

			bool firstMethod = !constructor;

            foreach (var mi in type.GetMethods(BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance))
            {
                DextopRemotableAttribute ra;
                if (AttributeHelper.TryGetAttribute<DextopRemotableAttribute>(mi, out ra, false))
                {
                    ReflectionRemoteMethodInvoker.CacheMethodInfo(mi, ra);

                    if (mi.DeclaringType == type)
                    {                        
                        var methodName = mi.Name;
                        sw.WriteLine(",");
                        var parameters = mi.GetParameters();
                        var upload = parameters.Any(a => a.ParameterType == formSubmitType);
                        if (upload)
                        {
                            if (parameters.Length == 0 || parameters[0].ParameterType != formSubmitType)
                                throw new Exception("Form submit methods must have first parameter of type DextopFormSubmit.");
                            sw.Write("\t{0}: function(", methodName);
                            for (var i = 0; i < parameters.Length; i++)
                            {
                                sw.Write(parameters[i].Name);
                                sw.Write(", ");
                            }
                            sw.Write("callback, scope");
                            sw.Write(") {{ this.submitForm(callback, scope, '{0}', {1}, [", methodName, parameters[0].Name);
                            if (parameters.Length > 1)
                            {
                                sw.Write(parameters[1].Name);
                                for (var i = 2; i < parameters.Length; i++)
                                {
                                    sw.Write(", ");
                                    sw.Write(parameters[i].Name);
                                }
                            }
                            sw.Write("]);}");
                        }
                        else
                        {
                            sw.Write("\t{0}: function(", methodName);
                            for (var i = 0; i < parameters.Length; i++)
                            {
                                sw.Write(parameters[i].Name);
                                sw.Write(", ");
                            }
                            sw.Write("callback, scope");
                            sw.Write(") {{ this.invokeRemoteMethod(callback, scope, '{0}', [", methodName);
                            if (parameters.Length > 0)
                            {
                                sw.Write(parameters[0].Name);
                                for (var i = 1; i < parameters.Length; i++)
                                {
                                    sw.Write(", ");
                                    sw.Write(parameters[i].Name);
                                }
                            }
                            sw.Write("]);}");
                        }
                    }
                }
            }

			sw.WriteLine();
			sw.WriteLine("});");
			sw.WriteLine();
		}

        internal string GetTypeName(DextopApplication application, Type type)
        {
			var name = application.MapTypeName(type);
			return DextopUtil.GetRemotingProxyTypeName(name);
        }
    }
}
