using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Model serializer encodes/decodes model data to JSON arrays and vice versa.
	/// </summary>
    public class DextopModelArraySerializer : IDextopModelSerializer
    {
        DextopModelTypeMeta Meta { get; set; }

        List<Func<object, object>> Getters;
        List<Action<object, object>> Setters;

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopModelArraySerializer"/> class.
		/// </summary>
		/// <param name="meta">The meta.</param>
        public DextopModelArraySerializer(DextopModelTypeMeta meta)
        {
            Meta = meta;
            Getters = new List<Func<object,object>>();
            Setters = new List<Action<object,object>>();
            foreach (var field in meta.Fields)
            {
                Func<object, object> getter = null;
                Action<object, object> setter = null;
                var property = meta.ModelType.GetProperty(field);
                if (property.CanRead)
                    getter = (target) => { return property.GetValue(target, null); };
                if (property.CanWrite)
                    setter = (target, value) => { property.SetValue(target, ChangeType(value, property.PropertyType), null); };

                Getters.Add(getter);
                Setters.Add(setter);
            }            
        }

		object ChangeType(object value, Type type)
		{
			if (value == null)
				return type.IsValueType ? Activator.CreateInstance(type) : null;
			if (value is String)
				return DextopUtil.DecodeValue((String)value, type);
			return Codaxy.Common.Convert.ChangeTypeInvariant(value, type);
		}

		/// <summary>
		/// Serializes the specified records to JSON string.
		/// </summary>
		/// <param name="records">The records.</param>
		/// <returns>
		/// JSON
		/// </returns>
        public string Serialize(IList<object> records)
        {
            return DextopUtil.Encode(records.Select(r => Getters.Select(a => a(r))));
        }

		/// <summary>
		/// Deserializes the specified JSON string to records.
		/// </summary>
		/// <param name="json">The JSON.</param>
		/// <returns></returns>
        public IList<object> Deserialize(string json)
        {            
            var data = DextopUtil.Decode<object[][]>(json);
            var res = new object[data.Length];
            for (var k = 0; k < res.Length; k++)
            {
                if (data[k].Length != Setters.Count)
                    throw new DextopException("Could not deserialize JSON array to type '{0}'. Array length does not match the required number of fields.", Meta.ModelType);
                res[k] = Activator.CreateInstance(Meta.ModelType);
                for (var i = 0; i < data[k].Length; i++)
                    if (Setters[i] != null)
                        Setters[i](res[k], data[k][i]);
            }
            return res;
        }
    }
}
