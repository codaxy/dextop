using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Util
{
    public class DextopRoute
    {
        String[] routeParts { get; set; }

        public static string[] GetRouteElements(string url)
        {
            return url.Split('/');
        }
        
        public DextopRoute(String url)
        {
            routeParts = GetRouteElements(url);
        }

        public bool Match(string[] elements, out DextopConfig matchedParams)
        {
            matchedParams = null;
            if (elements.Length != routeParts.Length)
                return false;
            matchedParams = new DextopConfig();

            for (var i = 0; i < elements.Length; i++)
            {
                String name;
                if (String.Compare(elements[i], routeParts[i], true) == 0)
                    continue;

                if (!IsPlaceholder(routeParts[i], out name))
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
