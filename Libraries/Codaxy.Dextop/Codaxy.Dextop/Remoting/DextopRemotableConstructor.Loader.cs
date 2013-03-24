using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.IO;
using Codaxy.Common.Reflection;
using Newtonsoft.Json;

namespace Codaxy.Dextop.Remoting
{
    ///// <summary>
    ///// Load remotable constructors.
    ///// </summary>
    //public class DextopRemotableConstructorLoader : IDextopFileLoader
    //{
    //    /// <summary>
    //    /// Loads data from the input stream.
    //    /// </summary>
    //    /// <param name="application"></param>
    //    /// <param name="module"></param>
    //    /// <param name="inputStream"></param>
    //    public void Load(DextopApplication application, DextopModule module, Stream inputStream)
    //    {
    //        var invoker = application.RemoteMethodInvoker as ReflectionRemoteMethodInvoker;
    //        if (invoker == null)
    //            return;

    //        JsonReader jr = new JsonTextReader(new StreamReader(inputStream));
    //        var js = new JsonSerializer();
    //        var constructors = js.Deserialize<List<DextopRemotableConstructorPreprocessor.Constructor>>(jr);

    //        foreach (var c in constructors)
    //            invoker.RegisterTypeAlias(c.name, c.type);
    //    }
    //}
}
