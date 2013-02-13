using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
    class DextopModelFieldTypeMapper
    {
        static Dictionary<Type, Tuple<String, String>> extFieldType;

        static Dictionary<Type, Tuple<String, String>> GenerateExtFieldTypeMapping()
        {
            var res = new Dictionary<Type, Tuple<String, String>>();
            res[typeof(string)] = Tuple.Create("string", "string");
            res[typeof(char)] = Tuple.Create("string", "string");
            res[typeof(char?)] = Tuple.Create("string", "string");
            res[typeof(int)] = Tuple.Create("int", "int");
            res[typeof(int?)] = Tuple.Create("int", "int");
            res[typeof(short)] = Tuple.Create("int", "int");
            res[typeof(short?)] = Tuple.Create("int", "int");
            res[typeof(long)] = Tuple.Create("int", "int");
            res[typeof(long?)] = Tuple.Create("int", "int");
            res[typeof(float)] = Tuple.Create("float", "float");
            res[typeof(float?)] = Tuple.Create("float", "float");
            res[typeof(double)] = Tuple.Create("float", "float");
            res[typeof(double?)] = Tuple.Create("float", "float");
            res[typeof(decimal)] = Tuple.Create("float", "float");
            res[typeof(decimal?)] = Tuple.Create("float", "float");
            res[typeof(bool)] = Tuple.Create("boolean", "boolean");
            res[typeof(bool?)] = Tuple.Create("boolean", "boolean");
            res[typeof(DateTime)] = Tuple.Create("date", "boolean");
            res[typeof(DateTime?)] = Tuple.Create("date", "boolean");
            res[typeof(TimeSpan)] = Tuple.Create("timestamp", "time");
            res[typeof(TimeSpan?)] = Tuple.Create("date", "time");
            res[typeof(Guid)] = Tuple.Create("string", "string");
            res[typeof(Guid?)] = Tuple.Create("string", "string");
            return res;
        }

		/// <summary>
		/// Get an Ext's field type name for a given type.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <param name="typeName">Name of the type.</param>
		/// <returns>True if type can be mapped to a field.</returns>
        public static bool TryGetFieldTypeName(Type type, out String typeName, out string editorType)
        {
            if (Common.Nullable.IsNullableType(type))
            {
                return TryGetFieldTypeName(Common.Nullable.GetUnderlyingType(type), out typeName, out editorType);
            }

            if (type.IsEnum)
            {
                typeName = "int";
                editorType = typeName;
                return true;
            }            

            if (extFieldType == null)
                extFieldType = GenerateExtFieldTypeMapping();

            Tuple<String, String> typeData;
            if (extFieldType.TryGetValue(type, out typeData))
            {
                typeName = typeData.Item1;
                editorType = typeData.Item2;
                return true;
            }

            typeName = null;
            editorType = null;
            return false;
        }

        /// <summary>
        /// Check if given type can be mapped to Ext's field type.
        /// </summary>
		/// <param name="type">The type.</param>
		/// <returns>True if type can be mapped to a field.</returns>
        public static bool HasExtJsFieldType(Type type) { String ft, et; return TryGetFieldTypeName(type, out ft, out et); }
    }
}
