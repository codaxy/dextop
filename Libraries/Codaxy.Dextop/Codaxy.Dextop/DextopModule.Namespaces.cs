using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
    public partial class DextopModule
    {
        enum NamespaceMappingMode { Exact, PrefixExact, Prefix }

        class NamespaceMapping
        {
            public String Namespace { get; set; }
            public String ClientNamespace { get; set; }
            public NamespaceMappingMode Mode { get; set; }
        }
        List<NamespaceMapping> namespaceMapping = new List<NamespaceMapping>();

        /// <summary>
        /// Map C# (server) class namespace to JS (client) namespace. Use * and % to define prefix mappings.
        /// </summary>
        /// <param name="ns">Name of the C# (server) namespace. If the name ends with *, prefix match is used. If the name ends with % only that part of namespace is mapped. </param>
        /// <param name="cns">Name of the JS (client) namespace.</param>
        public void RegisterNamespaceMapping(String ns, String cns)
        {
            namespaceMapping.Add(new NamespaceMapping
            {
                Namespace = ns.TrimEnd('*'),
                ClientNamespace = (cns ?? "").TrimEnd('*'),
                Mode = GetNamespaceMappingMode(ns, cns)
            });
        }

        NamespaceMappingMode GetNamespaceMappingMode(String ns, String cns)
        {
            if (ns.EndsWith("*"))
                if (cns.EndsWith("*"))
                    return NamespaceMappingMode.Prefix;
                else
                    return NamespaceMappingMode.PrefixExact;            
            return NamespaceMappingMode.Exact;
        }

		/// <summary>
		/// Tries to the map the C# to JS namespace.
		/// </summary>
		/// <param name="serverNs">The namespace.</param>
		/// <param name="clientNs">The client namespace.</param>
		/// <returns></returns>
        public bool TryMapNamespace(String serverNs, out string clientNs)
        {
            foreach (var m in namespaceMapping)
                switch (m.Mode)
                {
                    case NamespaceMappingMode.Exact:
                        if (m.Namespace == serverNs)
                        {
                            clientNs = m.ClientNamespace;
                            return true;
                        }
                        break;
                    case NamespaceMappingMode.Prefix:
                        if (serverNs.StartsWith(m.Namespace))
                        {
                            clientNs = m.ClientNamespace + serverNs.Substring(m.Namespace.Length);
                            return true;
                        }
                        break;
                    case NamespaceMappingMode.PrefixExact:
                        if (serverNs.StartsWith(m.Namespace))
                        {
                            clientNs = m.ClientNamespace;
                            return true;
                        }
                        break;
                }                
            clientNs = null;
            return false;
        }
    }
}
