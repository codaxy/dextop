using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Codaxy.Common.Reflection
{
    public static class AttributeHelper
    {
        public static T GetCustomAttribute<T>(MemberInfo type, bool inherit) where T:System.Attribute
        {
            return (T)type.GetCustomAttributes(typeof(T), inherit).SingleOrDefault();
        }

        public static T[] GetCustomAttributes<T>(MemberInfo type, bool inherit) where T : System.Attribute
        {
            return type.GetCustomAttributes(typeof(T), inherit).Select(a => (T)a).ToArray();
        }

        public static IEnumerable<PropertyInfo> FindPropertiesWithAttribute(Type type, Type attributeType, bool inherit)
        {
            foreach (var p in type.GetProperties())
            {
                var attributes = p.GetCustomAttributes(attributeType, inherit);
                if (attributes != null && attributes.Length > 0)
                    yield return p;
            }
        }

        public static bool TryGetAttribute<T>(MemberInfo type, out T a, bool inherit) where T : System.Attribute
        {
            a = GetCustomAttribute<T>(type, inherit);
            return a != null;
        }
    }
}
