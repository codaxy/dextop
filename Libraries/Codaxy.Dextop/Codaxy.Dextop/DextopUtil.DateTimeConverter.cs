using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	/// <summary>
	/// DateTime JSON handling in Dextop is customized.
	/// Ext sends dates in ISO 8601 format 'yyyy-MM-ddThh:mm:ss', so it's natural 
	/// that Dextop use IsoDateTimeConverter. his results with an issue that
	/// date is written as string and it is not converted to js Date object.
	///
	/// JavaScriptDateTimeConverter sends dates as new Date(ticks), which are 
	/// recognized by the browser and converted to dates. But, JavaScriptDateTimeConverter
	/// cannot parse dates sent by the browser (sent in ISO format).
	///
	/// DextopDateTimeConverter sends dates using JavaScriptDateTimeConverter.
	/// DextopDateTimeConverter parses dates using IsoDateTimeConverter.
	/// </summary>
	class DextopDateTimeConverter : Newtonsoft.Json.JsonConverter
	{
		readonly Newtonsoft.Json.JsonConverter isoConverter;
		readonly Newtonsoft.Json.JsonConverter jsConverter;

		public DextopDateTimeConverter()
		{
			isoConverter = new Newtonsoft.Json.Converters.IsoDateTimeConverter
			{
				DateTimeStyles = System.Globalization.DateTimeStyles.AssumeLocal
			};

			jsConverter = new Newtonsoft.Json.Converters.JavaScriptDateTimeConverter();
		}

		public override bool CanConvert(Type objectType)
		{
			return jsConverter.CanConvert(objectType);
		}

		public override object ReadJson(Newtonsoft.Json.JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
		{
			return isoConverter.ReadJson(reader, objectType, existingValue, serializer);
		}

		public override void WriteJson(Newtonsoft.Json.JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
		{
			jsConverter.WriteJson(writer, value, serializer);
		}
	}

}
