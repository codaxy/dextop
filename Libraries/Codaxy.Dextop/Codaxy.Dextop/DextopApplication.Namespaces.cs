using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
    public partial class DextopApplication
    {
		/// <summary>
		/// Map C# (server) class namespace to JS (client) namespace.
		/// </summary>
		/// <param name="ns">Name of the C# (server) namespace. If the name ends with *, prefix match is used.</param>
		/// <returns>Client namespace.</returns>
		public virtual string MapNamespace(String ns)
        {
            String res;
			foreach (var m in Modules)
				if (m.TryMapNamespace(ns, out res))
					return res;
            throw new DextopNamespaceMappingException(ns);
        }

		/// <summary>
		/// Maps the C# (server) class name to the JS (client) type name;
		/// </summary>
		/// <param name="type">The type.</param>
		/// <param name="namespaceSuffix">The namespace suffix.</param>
		/// <returns>Client type name.</returns>
		public virtual string MapTypeName(Type type, params String[] namespaceSuffix)
		{
			var ns = MapNamespace(type.Namespace);
			ns += String.Join("", GetNestedTypeNames(type));
			return ns + String.Join("", namespaceSuffix) + "." + MapClassName(type.Name);
		}

		/// <summary>
		/// Maps server class name to client class name. By default, Dextop prefix is stripped. (DextopProxy -> Proxy)
		/// </summary>
		/// <param name="className">Class name obtained by type.Name property.</param>
		/// <returns>Mapping result.</returns>
		protected virtual string MapClassName(string className)
		{
			if (className.StartsWith("Dextop"))
				return className.Substring(6);
			return className;
		}

		IEnumerable<string> GetNestedTypeNames(Type type)
		{
			while (type.IsNested)
			{
				yield return "." + type.ReflectedType.Name;
				type = type.ReflectedType;
			}
		}
    }
}
