using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common.Localization
{
    public static class Util
    {
        public static Dictionary<String, String> GetDictionary<T>(T localization)
        {
            var type = typeof(T);
            var stringType = typeof(String);
            Dictionary<String, String> res = new Dictionary<string, string>();
            foreach (var f in type.GetFields())
                if (f.FieldType == stringType)
                {
                    var v = f.GetValue(localization);
                    if (v != null)
                        res.Add(f.Name, (String)v);
                }
            return res;
        }
    }
}
