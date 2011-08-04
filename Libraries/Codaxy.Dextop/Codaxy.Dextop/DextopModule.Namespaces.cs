using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
    public partial class DextopModule
    {
        class NamespaceMapping
        {
            public String Namespace { get; set; }
            public String ClientNamespace { get; set; }
            public bool Prefix { get; set; }
        }
        List<NamespaceMapping> namespaceMapper = new List<NamespaceMapping>();

        /// <summary>
        /// Map C# (server) class namespace to JS (client) namespace.
        /// </summary>
        /// <param name="ns">Name of the C# (server) namespace. If the name ends with *, prefix match is used. </param>
        /// <param name="cns">Name of the JS (client) namespace.</param>
        public void RegisterNamespaceMapping(String ns, String cns)
        {
            namespaceMapper.Add(new NamespaceMapping
            {
                Namespace = ns.TrimEnd('*'),
                ClientNamespace = cns,
                Prefix = ns.EndsWith("*")
            });
        }

		/// <summary>
		/// Tries to the map the C# to JS namespace.
		/// </summary>
		/// <param name="serverNs">The namespace.</param>
		/// <param name="clientNs">The client namespace.</param>
		/// <returns></returns>
        public bool TryMapNamespace(String serverNs, out string clientNs)
        {
            foreach (var m in namespaceMapper)
                if (m.Namespace == serverNs)
                {
                    clientNs = m.ClientNamespace;
                    return true;
                }
                else if (m.Prefix && serverNs.StartsWith(m.Namespace))
                {
                    clientNs = m.ClientNamespace;
                    return true;
                }
            clientNs = null;
            return false;
        }
    }
}
