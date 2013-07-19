using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Api
{
    public class DextopApiStoreAttribute : System.Attribute
    {
        public DextopApiStoreAttribute(String storeId)
        {
            StoreId = storeId;
        }

        public string StoreId { get; set; }
        
        public bool autoLoad { get; set; }
    }
}
