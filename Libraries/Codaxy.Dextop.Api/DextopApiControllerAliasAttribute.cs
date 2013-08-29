using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Api
{
    public class DextopApiControllerAliasAttribute : System.Attribute
    {
        public DextopApiControllerAliasAttribute(String alias)
        {
            Alias = alias;
        }

        public string Alias { get; set; }
    }
}
