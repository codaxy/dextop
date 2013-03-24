using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Common.Reflection;
using Newtonsoft.Json;
using Codaxy.Common.Globalization;
using System.Globalization;

namespace Codaxy.Dextop.Remoting
{
    ///// <summary>
    ///// Generates remote proxies.
    ///// </summary>
    //public class DextopRemotableConstructorPreprocessor : IDextopAssemblyPreprocessor
    //{		
    //    /// <summary>
    //    /// Processes the assemblies and generates the code.
    //    /// </summary>
    //    /// <param name="application">The application.</param>
    //    /// <param name="assemblies">The assemblies.</param>
    //    /// <param name="outputStream">The output stream.</param>
    //    public void ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream outputStream)
    //    {
    //        List<Constructor> data = new List<Constructor>();            
    //        using (var sw = new StreamWriter(outputStream))
    //        {
    //            foreach (var assembly in assemblies)
    //            {                    
    //                var types = assembly.GetTypes().Where(t => remotableInterfaceType.IsAssignableFrom(t) && remotableInterfaceType != t);
    //                HashSet<Type> includedTypes = new HashSet<Type>();
    //                foreach (var type in types)
    //                {
    //                    WriteType(application, sw, type, data);
    //                }
    //            }
    //            sw.WriteLine(JsonConvert.SerializeObject(data, Formatting.Indented));
    //        }
    //    }

    //    Type remotableInterfaceType = typeof(IDextopRemotable);
    //    Type formSubmitType = typeof(DextopFormSubmit);

    //    internal class Constructor
    //    {
    //        public String name { get; set; }            
    //        public String type { get; set; }
    //    }

    //    private void WriteType(DextopApplication application, StreamWriter sw, Type type, List<Constructor> data)
    //    {
    //        var typeName = GetTypeName(application, type);

    //        bool constructor = false;

    //        foreach (var mi in type.GetConstructors(BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance))
    //        {
    //            DextopRemotableAttribute ra;
    //            if (AttributeHelper.TryGetAttribute<DextopRemotableAttribute>(mi, out ra, false))
    //            {
    //                String alias = null;
    //                var rac = ra as DextopRemotableConstructorAttribute;
    //                if (rac!=null)
    //                    alias = rac.alias;
    //                data.Add(new Constructor
    //                {
    //                    name = alias ?? application.MapTypeName(type),
    //                    type = type.AssemblyQualifiedName
    //                });

    //                constructor = true;
    //            }
    //        }

    //        if (!constructor)
    //            data.Add(new Constructor
    //            {
    //                name = application.MapTypeName(type),
    //                type = type.AssemblyQualifiedName
    //            });
    //    }

    //    internal string GetTypeName(DextopApplication application, Type type)
    //    {
    //        var name = application.MapTypeName(type);
    //        return DextopUtil.GetRemotingProxyTypeName(name);
    //    }
    //}
}
