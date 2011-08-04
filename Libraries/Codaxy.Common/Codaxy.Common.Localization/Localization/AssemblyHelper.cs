using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Codaxy.Common.Localization
{
    class AssemblyHelper
    {
        public static Type[] GetLocalizationTypesForAssembly(params Assembly[] assemblies)
        {
            List<Type> res = new List<Type>();
            foreach (var assembly in assemblies)
                foreach (var theType in assembly.GetTypes())
                    foreach (var a in theType.GetCustomAttributes(false))
                        if (a is LocalizationAttribute)
                            res.Add(theType);

            return res.ToArray();
        }

        public static IEnumerable<Assembly> GetLocalizedAssemblies()
        {
            return Codaxy.Common.Reflection.AssemblyHelper.GetAttributedAssemblies(typeof(LocalizationAttribute));            
        }

        public static String[] GetLocalizedAssemblyNames()
        {
            return GetLocalizedAssemblies().Select(a => a.GetName().Name).ToArray();
        }

        public static Assembly GetAssembly(String assemblyName)
        {
            return AppDomain.CurrentDomain.GetAssemblies().SingleOrDefault(a => a.GetName().Name == assemblyName);
        }

        public static String GetAssemblyName(Assembly assembly) { return assembly.GetName().Name; }

        public static LocalizationData GetDefaultLocalizationData(Assembly assembly, IEnumerable<ILocalizationDataProvider> providers)
        {
            LocalizationData res = new LocalizationData();
            foreach (var p in providers)
            {
                var data = p.ReadDefaultData(assembly);
                res.Include(data);
            }
            return res;
        }       
    }
}
