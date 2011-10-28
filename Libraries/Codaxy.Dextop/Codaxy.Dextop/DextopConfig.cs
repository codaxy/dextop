using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Dynamic;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Extensible configuration object suited for sending of JSON data to the client.
	/// </summary>
    public class DextopConfig : Dictionary<String, object>
    {
		/// <summary>
		/// Applies the specified data.
		/// </summary>
		/// <param name="data">The data.</param>
        public void Apply(params IDictionary<String, object>[] data)
        {
            foreach (var dict in data)            
                foreach (var kv in dict)
                    this[kv.Key] = kv.Value;
            
        }

		/// <summary>
		/// Try to cast property to given type.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="property">The property name.</param>
		/// <param name="value">The value.</param>
		/// <returns>True if value is found and converted.</returns>
		public bool TryGet<T>(String property, out T value)
		{
			try			
			{
				object v;
                if (TryGetValue(property, out v) && v!=null)
                {
                    if (v is string)
                        value = (T)DextopUtil.DecodeValue(v as string, typeof(T));
                    else
                        value = (T)Codaxy.Common.Convert.ChangeType(v, typeof(T));
                    return true;
                }
			}
			catch {}

			value = default(T);
			return false;			
		}

		/// <summary>
		/// Safely gets the property value. If value is not found or invalid, default value is used.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="property">The property name.</param>
		/// <param name="defaultValue">The default value.</param>
		/// <returns>Value.</returns>
		public T SafeGet<T>(String property, T defaultValue = default(T))
		{
			T res;
			if (TryGet(property, out res))
				return res;
			return defaultValue;
		}
    }
}
