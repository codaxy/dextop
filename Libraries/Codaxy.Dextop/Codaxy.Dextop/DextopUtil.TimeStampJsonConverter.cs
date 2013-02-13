using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace Codaxy.Dextop
{
    class TimeSpanConverter : JsonConverter
    {
        readonly Newtonsoft.Json.JsonConverter readConverter;
        readonly Newtonsoft.Json.JsonConverter writeConverter;
        readonly DateTime baseDate = new DateTime(1998, 1, 1);

        public TimeSpanConverter()
        {
            this.readConverter = new IsoDateTimeConverter { DateTimeStyles = System.Globalization.DateTimeStyles.AssumeLocal };
            this.writeConverter = new IsoDateTimeConverter { DateTimeFormat = "HH:mm", DateTimeStyles = System.Globalization.DateTimeStyles.AssumeLocal };
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(TimeSpan) || objectType == typeof(TimeSpan?);
        }

        public override object ReadJson(Newtonsoft.Json.JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            if (objectType == typeof(TimeSpan))
                return ((DateTime)readConverter.ReadJson(reader, typeof(DateTime?), null, serializer)).TimeOfDay;

            if (objectType == typeof(TimeSpan?))
            {
                var value = (DateTime?)readConverter.ReadJson(reader, typeof(DateTime?), null, serializer);
                return value.HasValue ? (TimeSpan?)value.Value.TimeOfDay : null;
            }

            throw new Exception("Expected timestamp object value.");
        }

        public override void WriteJson(Newtonsoft.Json.JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer)
        {
            if (value != null)
                writeConverter.WriteJson(writer, baseDate.Add((TimeSpan)value), serializer);
            else
                writeConverter.WriteJson(writer, value, serializer);
        }
    }
}