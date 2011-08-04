using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.Concurrent;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase
{
    public partial class ShowcaseApplication
    {   
        ConcurrentDictionary<String, Type> demoTypes = new ConcurrentDictionary<string, Type>();

        public void RegisterDemo(String id, Type type)
        {
            if (!typeof(IDextopRemotable).IsAssignableFrom(type))
                throw new InvalidOperationException(String.Format("Type '{0}' is not valid demo type, as it does not implement IDextopRemotable interface.", id));
            if (!demoTypes.TryAdd(id, type))
                throw new InvalidOperationException(String.Format("Demo with id '{0}' already registered.", id));
        }

        public IDextopRemotable CreateDemo(String id) {
            Type demoType;
            if (!demoTypes.TryGetValue(id, out demoType))
                throw new InvalidOperationException(String.Format("Demo with id '{0}' not registered.", id));
            return (IDextopRemotable)Activator.CreateInstance(demoType);
        }
    }
}