using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace Codaxy.Dextop.Tests.Helpers
{
    class JsonUtil
    {
        public static String Encode(object o)
        {
            return JsonConvert.SerializeObject(o, Formatting.None);
        }
    }
}
