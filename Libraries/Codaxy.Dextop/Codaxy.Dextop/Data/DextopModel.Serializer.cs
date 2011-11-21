using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Model serializer encodes/decodes model data to JSON and vice versa.
	/// </summary>
    public interface IDextopModelSerializer
    {
		/// <summary>
		/// Serializes the specified records to JSON string.
		/// </summary>
		/// <param name="records">The records.</param>
		/// <returns>JSON</returns>
        object Serialize(IList<object> records);

		/// <summary>
		/// Deserializes the specified JSON string to records.
		/// </summary>
		/// <param name="json">The JSON.</param>
		/// <returns></returns>
        IList<object> Deserialize(object json);
    }
}
