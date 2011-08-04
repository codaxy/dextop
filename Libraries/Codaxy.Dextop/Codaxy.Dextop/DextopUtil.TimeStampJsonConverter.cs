using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	class TimeSpanConverter : Newtonsoft.Json.JsonConverter
	{
		readonly Newtonsoft.Json.JsonConverter dateConverter;
		readonly DateTime baseDate = new DateTime(1998, 1, 1);

		public TimeSpanConverter(Newtonsoft.Json.JsonConverter dateConverter) { this.dateConverter = dateConverter; }

		public override bool CanConvert(Type objectType)
		{
			return objectType == typeof(TimeSpan) || objectType == typeof(TimeSpan?);
		}

		public override object ReadJson(Newtonsoft.Json.JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
		{
			if (objectType == typeof(TimeSpan))
				return ((DateTime)dateConverter.ReadJson(reader, typeof(DateTime?), null, serializer)).TimeOfDay;

			if (objectType == typeof(TimeSpan?))
			{
				var value = (DateTime?)dateConverter.ReadJson(reader, typeof(DateTime?), null, serializer);
				return value.HasValue ? (TimeSpan?)value.Value.TimeOfDay : null;
			}

			throw new Exception("Expected timestamp object value.");			
		}

		public override void WriteJson(Newtonsoft.Json.JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
		{
			dateConverter.WriteJson(writer, baseDate.Add((TimeSpan)value), serializer);
		}
	}
}
