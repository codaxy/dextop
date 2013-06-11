using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Util
{
    public class DextopRoute
    {
        String[] parts { get; set; }
        
        public DextopRoute(String url)
        {
            parts = url.Split('/');
        }

        public bool Match(string[] elements, out DextopConfig matchedParams)
        {
            matchedParams = null;
            if (elements.Length != parts.Length)
                return false;
            matchedParams = new DextopConfig();

            for (var i = 0; i < elements.Length; i++)
            {
                String name;
                if (String.Compare(elements[i], parts[i], true) == 0)
                    continue;

                if (!IsPlaceholder(elements[i], out name))
                    return false;

                matchedParams[name] = elements[i];
            }
            return true;
        }

        private bool IsPlaceholder(string p, out string name)
        {
            if (p[0] == '{' && p[p.Length - 1] == '}')
            {
                name = p.Substring(1, p.Length - 2);
                return true;
            }

            name = null;
            return false;
        }
    }
}
