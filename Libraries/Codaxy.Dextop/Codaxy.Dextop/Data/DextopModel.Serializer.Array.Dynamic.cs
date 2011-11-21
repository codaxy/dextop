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
    public class DextopModelDynamicArraySerializer : DextopModelArraySerializer    
    {
        /// <summary>
		/// Initializes a new instance of the <see cref="DextopModelArraySerializer"/> class.
		/// </summary>
		/// <param name="meta">The meta.</param>
        public DextopModelDynamicArraySerializer(DextopModelTypeMeta meta) : base(meta) {}


        /// <summary>
        /// Builds value provider for getting and setting property values during serialization.
        /// </summary>
        /// <param name="property"></param>
        /// <returns></returns>
        protected override Newtonsoft.Json.Serialization.IValueProvider BuildValueProvider(PropertyInfo property)
        {
            return new DynamicValueProvider(property);
        }
    }
}
