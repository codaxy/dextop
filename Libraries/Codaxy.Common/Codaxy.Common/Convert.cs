using System;
using System.ComponentModel;
using System.Globalization;

namespace Codaxy.Common
{
    /// <summary>
    /// System.Convert replacement.
    /// Can convert nullable types and enums.
    /// </summary>
    public class Convert
    {
        public static object ChangeType(object o, Type type)
        {
            if (type.IsEnum)
                return Enum.Parse(type, o.ToString(), true);

            if (Nullable.IsNullableType(type))
            {
                var underlyingType = Nullable.GetUnderlyingType(type);
                var data = ChangeType(o, underlyingType);
                NullableConverter nullableConverter = new NullableConverter(type);
                return nullableConverter.ConvertFrom(data);
            }
            return System.Convert.ChangeType(o, type);
        }

        public static object ChangeType(object o, Type type, IFormatProvider provider)
        {
            if (type.IsEnum)
                return Enum.Parse(type, o.ToString(), true);                
            
            if (Nullable.IsNullableType(type))
            {
                var underlyingType = Nullable.GetUnderlyingType(type);
                var data = ChangeType(o, underlyingType, provider);
                NullableConverter nullableConverter = new NullableConverter(type);
                return nullableConverter.ConvertFrom(data);
            }

            return System.Convert.ChangeType(o, type, provider);
        }

        public static object ChangeTypeInvariant(object o, Type type)
        {
            return ChangeType(o, type, CultureInfo.InvariantCulture);
        }
    }
}
