using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.Concurrent;
using Codaxy.Dextop.Remoting;
using Codaxy.Common.Reflection;
using Codaxy.Dextop.Showcase.Demos;
using System.Reflection;
using System.Diagnostics;

namespace Codaxy.Dextop.Showcase
{
    public partial class ShowcaseApplication
    {   
        ConcurrentDictionary<String, Type> demoTypes = new ConcurrentDictionary<string, Type>();

        public void InitializeDemos()
        {
            try
            {
                if (PreprocessingEnabled && !PreprocessorMode)
                {
                    var data = AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DemoAttribute>(this.GetType().Assembly, false);

                    foreach (var entry in data)
                        RegisterDemo(entry.Value.Id, entry.Key);
                }
            }
            catch (ReflectionTypeLoadException ex)
            {
                throw ex.LoaderExceptions[0];
            }
        }

        public void RegisterDemo(String id, Type type)
        {
            Debug.WriteLine("ID DEMA REGISTER : "+id+" TYPE : "+type.ToString());
            if (!typeof(IDextopRemotable).IsAssignableFrom(type))
            {
                Debug.WriteLine("ID : " + id+" EXCEPTION NOT VALID");
                throw new InvalidOperationException(String.Format("Type '{0}' is not valid demo type, as it does not implement IDextopRemotable interface.", id));
            }
            if (!demoTypes.TryAdd(id, type))
            {
                Debug.WriteLine("ID : " + id + " EXCEPTION ALREADY REGISTERED");
                throw new InvalidOperationException(String.Format("Demo with id '{0}' already registered.", id));
            }
        }

        public IDextopRemotable CreateDemo(String id) {
            Debug.WriteLine("ID DEMA CREATE : " + id);
            Type demoType;
            if (!demoTypes.TryGetValue(id, out demoType))
                throw new InvalidOperationException(String.Format("Demo with id '{0}' not registered.", id));
            return (IDextopRemotable)Activator.CreateInstance(demoType);
        }
    }
}