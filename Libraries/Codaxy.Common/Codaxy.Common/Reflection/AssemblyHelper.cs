using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;

namespace Codaxy.Common.Reflection
{
    public static class AssemblyHelper
    {
        public static IEnumerable<Type> GetAttributedTypesForAssembly(Assembly assembly, Type attributeType, bool inherit)
        {
            return assembly.GetTypes().Where(a => a.GetCustomAttributes(attributeType, inherit).Any());                    
        }

        public static Dictionary<Type, AttributeType[]> GetTypeAttributesDictionaryForAssembly<AttributeType>(Assembly assembly, bool inherit)
        {
            Dictionary<Type, AttributeType[]> res = new Dictionary<Type, AttributeType[]>();
            var attributeType = typeof(AttributeType);
            foreach (var t in assembly.GetTypes()) {
                var att = t.GetCustomAttributes(attributeType, inherit);
                if (att!=null && att.Length>0)
                    res.Add(t, att.Select(a => (AttributeType)a).ToArray());
            }
            return res;
        }

        public static Dictionary<Type, AttributeType> GetTypeAttributeDictionaryForAssembly<AttributeType>(Assembly assembly, bool inherit)
        {
            var res = new Dictionary<Type, AttributeType>();
            var attributeType = typeof(AttributeType);
            foreach (var t in assembly.GetTypes())
            {
                var att = t.GetCustomAttributes(attributeType, inherit);
                if (att != null && att.Length == 1)
                    res.Add(t, (AttributeType)att[0]);
            }
            return res;
        }

        public static IEnumerable<Assembly> GetAttributedAssemblies(Type attributeType)
        {
            return AppDomain.CurrentDomain.GetAssemblies().Where(a => a.GetCustomAttributes(attributeType, true).Any());            
        }

        public static Assembly[] GetAllAssemblies() { return AppDomain.CurrentDomain.GetAssemblies(); }

        public static Dictionary<Assembly, AttributeType[]> GetAssemblyAttributesDict<AttributeType>(bool inherit) where AttributeType : Attribute
        {
            var res = new Dictionary<Assembly, AttributeType[]>();
            foreach (var a in GetAllAssemblies())
            {
                var att = GetCustomAttributes<AttributeType>(a, inherit);
                if (att.Length > 0)
                    res.Add(a, att);
            }
            return res;
        }

        public static Dictionary<Assembly, AttributeType> GetAssemblyAttributeDict<AttributeType>(bool inherit) where AttributeType : Attribute
        {
            var res = new Dictionary<Assembly, AttributeType>();
            foreach (var a in GetAllAssemblies())
            {
                var att = GetCustomAttribute<AttributeType>(a, inherit);
                if (att != null)
                    res.Add(a, att);
            }
            return res;
        }

        public static String GetAssemblyDirectory(Assembly assembly)
        {
            var dllInfo = new FileInfo(Assembly.GetExecutingAssembly().Location);
            return dllInfo.DirectoryName;
        }

        public static Stream ReadEmbeddedFile(Assembly assembly, String fileName)
        {            
            var name = assembly.GetName().Name + "." + fileName.Replace("\\", ".").TrimStart('.');
            return assembly.GetManifestResourceStream(name);
        }

        public static String ReadEmbeddedText(Assembly assembly, String fileName)
        {
            using (var tr = new StreamReader(ReadEmbeddedFile(assembly, fileName)))
                return tr.ReadToEnd();
        }

        public static T GetCustomAttribute<T>(Assembly assembly, bool inherit) where T : System.Attribute
        {
            return (T)assembly.GetCustomAttributes(typeof(T), inherit).SingleOrDefault();
        }

        public static T[] GetCustomAttributes<T>(Assembly assembly, bool inherit) where T : System.Attribute
        {
            return assembly.GetCustomAttributes(typeof(T), inherit).Select(a => (T)a).ToArray();
        }

        public static bool TryGetAttribute<T>(Assembly assembly, out T a, bool inherit) where T : System.Attribute
        {
            a = GetCustomAttribute<T>(assembly, inherit);
            return a != null;
        }
    }
}
