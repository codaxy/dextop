using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Common.Reflection;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Api
{
	/// <summary>
	/// Generates remote proxies.
	/// </summary>
    public class DextopApiPreprocessor : IDextopAssemblyPreprocessor
    {	
		Type apiControllerType = typeof(DextopApiController);
        Type formSubmitType = typeof(DextopFormSubmit);

        static bool IsSubclassOfRawGeneric(Type generic, Type toCheck)
        {
            while (toCheck != null && toCheck != typeof(object))
            {
                var cur = toCheck.IsGenericType ? toCheck.GetGenericTypeDefinition() : toCheck;
                if (generic == cur)
                {
                    return true;
                }
                toCheck = toCheck.BaseType;
            }
            return false;
        }

		private void WriteType(DextopApplication application, StreamWriter sw, StreamWriter cacheWriter, Type type, HashSet<Type> includedTypes)
		{
			if (includedTypes.Contains(type))
				return;

			includedTypes.Add(type);

			var typeName = GetTypeName(application, type);

			if (type.BaseType != null && apiControllerType.IsAssignableFrom(type.BaseType) && type.Assembly == type.BaseType.Assembly)
				WriteType(application, sw, cacheWriter, type.BaseType, includedTypes);
				

			sw.WriteLine("Ext.define('{0}', {{", typeName);			

			if (type.BaseType != null && apiControllerType.IsAssignableFrom(type.BaseType))
			{
				sw.WriteLine("\textend: '{0}',", GetTypeName(application, type.BaseType));
			}
			else
			{
				sw.WriteLine("\textend: 'Dextop.api.Controller',");
			}

            sw.Write("\tcontrollerType: '{0}'", type.AssemblyQualifiedName);

            var interfaces = type.GetInterfaces();            
            var proxyInterface = interfaces.FirstOrDefault(x => x.IsGenericType && typeof(IDextopReadProxy<>).IsAssignableFrom(x.GetGenericTypeDefinition()));

            if (proxyInterface!=null)
            {
                sw.WriteLine(",");
                sw.Write("\tmodel: '{0}'", application.MapTypeName(proxyInterface.GetGenericArguments()[0], ".model"));
            }

            foreach (var mi in type.GetMethods(BindingFlags.Public | BindingFlags.Instance))
            {
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
                

			sw.WriteLine();
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
            using (var cacheWriter = new StreamWriter(cacheStream))
            using (var sw = new StreamWriter(outputStream))
            {
                foreach (var assembly in assemblies)
                {
                    var types = assembly.GetTypes().Where(t => apiControllerType.IsAssignableFrom(t) && apiControllerType != t);
                    HashSet<Type> includedTypes = new HashSet<Type>();
                    foreach (var type in types)
                    {
                        WriteType(application, sw, cacheWriter, type, includedTypes);
                    }
                }
            }
        }

        bool IDextopAssemblyPreprocessor.Cachable
        {
            get { return true; }            
        }

        void IDextopAssemblyPreprocessor.LoadCache(DextopApplication application, IList<Assembly> assemblies, Stream cacheStream)
        {

        }
    }
}
