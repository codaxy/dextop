using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
    class DextopModelJsonSerializer : IDextopModelSerializer
    {
        DextopModelTypeMeta Meta { get; set; }

        public string Type { get { return "json"; } }

        public DextopModelJsonSerializer(DextopModelTypeMeta meta)
        {
            Meta = meta;
        }

        public object Serialize(IList<object> records)
        {
            return JArray.FromObject(records);
        }

        public IList<object> Deserialize(object json)
        {
            JArray data;
            if (json is string)
            {
                data = JArray.Parse((string)json);
            }
            else if (json is JArray)
                data = (JArray)json;
            else
                throw new DextopException();

            var result = new List<object>();
            foreach (var o in data)
                using (var reader = new JTokenReader(o))
                    result.Add(DextopUtil.JsonSerializer.Deserialize(reader, Meta.ModelType));

            return result;
        }
    }
}
