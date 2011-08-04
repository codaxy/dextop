using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace Common.Localization
{
    public class Cache 
    {
        public Cache(LocalizationData d)
        {
            Data = d;
            cache = new Dictionary<Type, object>();
        }

        public LocalizationData Data { get; private set; }
        Dictionary<Type, object> cache;       

        public static String GetLocalizationName(Type type)
        {            
            return type.FullName;
        }

        public T Get<T>() where T: new()
        {
            var type = typeof(T);
            object cres;
            if (cache.TryGetValue(type, out cres))
                return (T)cres;            
            
            var res = new T();
            var locName = GetLocalizationName(type);         

            Field[] fields;
            if (Data != null && Data.TryGetValue(locName, out fields))
            {                
                foreach (var f in fields)
                {
                    var finfo = type.GetField(f.FieldName);
                    if (finfo != null)
                        finfo.SetValue(res, f.LocalizedText);
                }
            }

            lock (cache)
            {
                cache[type] = res;
            }

            return res;
        }

        public Dictionary<String, String> GetDict<T>()
        {
            var type = typeof(T);
            var locName = GetLocalizationName(type);

            Dictionary<String, String> res = new Dictionary<string, string>();

            Field[] fields;
            if (Data != null && Data.TryGetValue(locName, out fields))
            {
                foreach (var f in fields)
                {
                    res.Add(f.FieldName, f.LocalizedText);
                }
            }
            return res;
        }

        public LocalizationData GetLocalizationData()
        {
            return Data;
        }
    }
}
