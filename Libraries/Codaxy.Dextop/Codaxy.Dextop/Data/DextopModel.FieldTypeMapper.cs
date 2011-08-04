using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
    class DextopModelFieldTypeMapper
    {
        static Dictionary<Type, String> extFieldType;

        static Dictionary<Type, String> GenerateExtFieldTypeMapping()
        {
            Dictionary<Type, String> res = new Dictionary<Type, string>();
            res[typeof(string)] = "string";
            res[typeof(char)] = "string";
            res[typeof(char?)] = "string";
            res[typeof(int)] = "int";
            res[typeof(int?)] = "int";
            res[typeof(short)] = "int";
            res[typeof(short?)] = "int";
            res[typeof(long)] = "int";
            res[typeof(long?)] = "int";
            res[typeof(float)] = "float";
            res[typeof(float?)] = "float";
            res[typeof(double)] = "float";
            res[typeof(double?)] = "float";
            res[typeof(decimal)] = "float";
            res[typeof(decimal?)] = "float";
            res[typeof(bool)] = "boolean";
            res[typeof(bool?)] = "boolean";
            res[typeof(DateTime)] = "date";
            res[typeof(DateTime?)] = "date";
            res[typeof(TimeSpan)] = "time";
            res[typeof(TimeSpan?)] = "time";
            return res;
        }

		/// <summary>
		/// Get an Ext's field type name for a given type.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <param name="typeName">Name of the type.</param>
		/// <returns>True if type can be mapped to a field.</returns>
        public static bool TryGetFieldTypeName(Type type, out String typeName)
        {
            if (type.IsEnum)
            {
                typeName = "int";
                return true;
            }

            if (extFieldType == null)
                extFieldType = GenerateExtFieldTypeMapping();

            return extFieldType.TryGetValue(type, out typeName);
        }

        /// <summary>
        /// Check if given type can be mapped to Ext's field type.
        /// </summary>
		/// <param name="type">The type.</param>
		/// <returns>True if type can be mapped to a field.</returns>
        public static bool HasExtJsFieldType(Type type) { String name; return TryGetFieldTypeName(type, out name); }
    }
}
