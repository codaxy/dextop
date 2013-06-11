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
		Type remotableInterfaceType = typeof(IDextopRemotable);
        Type formSubmitType = typeof(DextopFormSubmit);

		private void WriteType(DextopApplication application, StreamWriter sw, StreamWriter cacheWriter, Type type, HashSet<Type> includedTypes)
		{
			if (includedTypes.Contains(type))
				return;

			includedTypes.Add(type);

			var typeName = GetTypeName(application, type);

			if (type.BaseType != null && remotableInterfaceType.IsAssignableFrom(type.BaseType) && type.Assembly == type.BaseType.Assembly)
				WriteType(application, sw, cacheWriter, type.BaseType, includedTypes);
				

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

            var clientTypeName = application.MapTypeName(type);
            var routes = new List<String>();

            foreach (var mi in type.GetConstructors(BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance))
            {
                DextopRemotableAttribute ra;
                if (AttributeHelper.TryGetAttribute<DextopRemotableAttribute>(mi, out ra, false))
                {

                    ReflectionRemoteMethodInvoker.CacheConstructorInfo(clientTypeName, mi, ra);
                    var ca = ra as DextopRemotableConstructorAttribute;
                    if (ca != null)
                    {
                        cacheWriter.WriteLine("{0}:{1}", ca.alias, type.AssemblyQualifiedName);
                        if (!String.IsNullOrEmpty(ca.route))
                            cacheWriter.WriteLine("{0}{1}:{2}", routePrefix, ca.alias, type.AssemblyQualifiedName);
                    }
                }
            }

            cacheWriter.WriteLine("{0}:{1}", clientTypeName, type.AssemblyQualifiedName);

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

        void IDextopAssemblyPreprocessor.ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream, Stream cacheStream)
        {
            using (var cacheWriter = new StreamWriter(cacheStream))
            using (var sw = new StreamWriter(outputStream))
            {
                foreach (var assembly in assemblies)
                {
                    var types = assembly.GetTypes().Where(t => remotableInterfaceType.IsAssignableFrom(t) && remotableInterfaceType != t);
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

        const string routePrefix = "route-";

        void IDextopAssemblyPreprocessor.LoadCache(DextopApplication application, IList<Assembly> assemblies, Stream cacheStream)
        {
            var invoker = application.RemoteMethodInvoker as ReflectionRemoteMethodInvoker;
            if (invoker == null)
                return;

            using (var tr = new StreamReader(cacheStream))
            {
                String line;
                while ((line = tr.ReadLine()) != null)
                {
                    var colon = line.IndexOf(':');
                    var id = line.Substring(0, colon);
                    var type = line.Substring(colon + 1);

                    if (id.StartsWith(routePrefix))
                        invoker.RegisterTypeRoute(id.Substring(routePrefix.Length), type);
                    else
                        invoker.RegisterTypeAlias(id, type);
                }
            }
        }
    }
}
