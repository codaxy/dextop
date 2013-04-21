using System;
using System.Globalization;
using Codaxy.Dextop;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Utilities;

namespace Newtonsoft.Json.Converters
{
    /// <summary>
    /// Converts a <see cref="DateTime"/> to and from a JavaScript date constructor (e.g. new Date(52231943)).
    /// </summary>
    public class JavaScriptIsoDateTimeConverter : IsoDateTimeConverter
    {
        private const string DefaultDateTimeFormat = "yyyy'/'MM'/'dd' 'HH':'mm':'ss";

        /// <summary>
        /// Writes the JSON representation of the object.
        /// </summary>
        /// <param name="writer">The <see cref="JsonWriter"/> to write to.</param>
        /// <param name="value">The value.</param>
        /// <param name="serializer">The calling serializer.</param>
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            String isoDateTimeString;

            if (value is DateTime)
            {
                DateTime dateTime = (DateTime)value;

                if ((DateTimeStyles & DateTimeStyles.AdjustToUniversal) == DateTimeStyles.AdjustToUniversal 
                    || (DateTimeStyles & DateTimeStyles.AssumeUniversal) == DateTimeStyles.AssumeUniversal)
                    dateTime = dateTime.ToUniversalTime();

                isoDateTimeString = dateTime.ToString(DefaultDateTimeFormat);
            }
#if !PocketPC && !NET20
            else if (value is DateTimeOffset)
            {
                DateTimeOffset dateTimeOffset = (DateTimeOffset)value;

                if ((DateTimeStyles & DateTimeStyles.AdjustToUniversal) == DateTimeStyles.AdjustToUniversal
                    || (DateTimeStyles & DateTimeStyles.AssumeUniversal) == DateTimeStyles.AssumeUniversal)
                    dateTimeOffset = dateTimeOffset.ToUniversalTime();

                isoDateTimeString = dateTimeOffset.ToString(DefaultDateTimeFormat);
            }
#endif
            else
            {
                throw new Exception("Expected date object value.");
            }

            writer.WriteStartConstructor("Date");
            writer.WriteValue(isoDateTimeString);
            writer.WriteEndConstructor();
        }
    }
}