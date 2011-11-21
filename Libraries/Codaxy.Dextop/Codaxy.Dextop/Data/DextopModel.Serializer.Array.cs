using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Model serializer encodes/decodes model data to JSON arrays and vice versa.
	/// </summary>
    public class DextopModelArraySerializer : IDextopModelSerializer
    {
        DextopModelTypeMeta Meta { get; set; }

        class FieldInfo
        {
            public IValueProvider ValueProvider;
            public Type PropertyType;
            public bool CanRead;
            public bool CanWrite;
        }

        List<FieldInfo> Fields;

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopModelArraySerializer"/> class.
		/// </summary>
		/// <param name="meta">The meta.</param>
        public DextopModelArraySerializer(DextopModelTypeMeta meta)
        {
            Meta = meta;
            Fields = new List<FieldInfo>();
           
            foreach (var field in meta.Fields)
            {
                var property = meta.ModelType.GetProperty(field);
                var vp = BuildValueProvider(property);
                Fields.Add(new FieldInfo
                {
                    CanRead = property.CanRead,
                    CanWrite = property.CanWrite,
                    PropertyType = property.PropertyType,
                    ValueProvider = vp
                });
            }
        }

        /// <summary>
        /// Builds value provider for getting and setting property values during serialization.
        /// </summary>
        /// <param name="property"></param>
        /// <returns></returns>
        protected virtual IValueProvider BuildValueProvider(PropertyInfo property)
        {
            return new ReflectionValueProvider(property);
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
        public object Serialize(IList<object> records)
        {
            return new JArray(records.Select(r => new JArray(Fields.Select(a => a.ValueProvider.GetValue(r)))));
        }

		/// <summary>
		/// Deserializes the specified JSON string to records.
		/// </summary>
		/// <param name="json">The JSON.</param>
		/// <returns></returns>
        public IList<object> Deserialize(object json)
        {
            JArray data;
            if (json is string)
                data = JArray.Parse((String)json);
            else if (json is JArray)
                data = (JArray)json;
            else
                throw new DextopException();
            
            var res = new List<object>();
            foreach (JArray record in data)
            {
                //if (record.Length != Setters.Count)
                //throw new DextopException("Could not deserialize JSON array to type '{0}'. Array length does not match the required number of fields.", Meta.ModelType);
                var row = Activator.CreateInstance(Meta.ModelType);
                for (var i = 0; i < Fields.Count; i++)
                    if (Fields[i].CanWrite)
                    {
                        var value = ChangeType(((JValue)record[i]).Value, Fields[i].PropertyType);
                        Fields[i].ValueProvider.SetValue(row, value);
                    }
                res.Add(row);
            }
            return res;
        }
    }
}
