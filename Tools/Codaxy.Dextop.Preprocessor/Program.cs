using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Reflection;

namespace Codaxy.Dextop.Preprocessor
{
    class Program
    {
        static int Main(string[] args)
        {
            try
            {
                if (args.Length == 0)
                    throw new InvalidOperationException("Arguments not supplied.");
                var applicationAssemblyPath = args[0];
                var fileInfo = new FileInfo(applicationAssemblyPath);
                if (fileInfo.Directory.Name != "bin")
                    throw new InvalidOperationException("You should point to main application's assembly inside application's bin directory.");
                var appAssembly = Assembly.LoadFrom(applicationAssemblyPath);
                var bootstrappers = GetApplicationBootstrapperTypes(appAssembly);

                DextopEnvironment.SetProvider(new DextopPreprocessorEnvironment
                {
                    PhysicalAppPath = fileInfo.Directory.Parent.FullName
                });

                foreach (var booterType in bootstrappers)
                {
                    var bootstrapper = (IDextopApplicationBootsraper)Activator.CreateInstance(booterType);
                    var app = bootstrapper.CreateApplication();
                    app.Initialize();
                }

                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Dextop preprocessor error: " + ex);                
                return 1;
            }
        }

        static IEnumerable<Type> GetApplicationBootstrapperTypes(Assembly a)
        {
            var bootsrapperType = typeof(IDextopApplicationBootsraper);
            var types = a.GetTypes();
            foreach (var type in types)
                if (type.GetInterfaces().Contains(bootsrapperType))
                    yield return type;
        }
    }
}
