using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common
{
    public static class Nullable
    {
        public static bool IsNullableType(Type type)
        {
            return (type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>)));
        }

        public static Type GetNullableType(Type type)
        {
            Type nullable = typeof(Nullable<>);
            return nullable.MakeGenericType(type);
        }

        public static Type GetUnderlyingType(Type type) { return System.Nullable.GetUnderlyingType(type); }
    }
}
