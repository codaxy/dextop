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
        const string virtualPathSwitch = "/virtualPath:";
        
        static int Main(string[] args)
        {
            try
            {
                if (args.Length == 0)
                {
                    PrintUsage();
                    return 1;
                }

                var applicationAssemblyPath = args[0];
                var fileInfo = new FileInfo(applicationAssemblyPath);
                if (fileInfo.Directory.Name != "bin")
                    throw new InvalidOperationException("You should point to main application's assembly inside application's bin directory.");

                var dxEnv = new DextopPreprocessorEnvironment
                {
                    PhysicalAppPath = fileInfo.Directory.Parent.FullName
                };

                DextopEnvironment.SetProvider(dxEnv);

                for (var i = 1; i < args.Length; i++)
                {
                    if (args[i].StartsWith(virtualPathSwitch))
                        dxEnv.VirtualAppPath = args[i].Substring(virtualPathSwitch.Length);

                    if (args[i].StartsWith("/?"))
                        PrintUsage();
                }

                var appAssembly = Assembly.LoadFrom(applicationAssemblyPath);
                var bootstrappers = GetApplicationBootstrapperTypes(appAssembly);

                

                foreach (var booterType in bootstrappers)
                {
                    var bootstrapper = (IDextopApplicationBootsraper)Activator.CreateInstance(booterType);
                    var app = bootstrapper.CreateApplication();
                    app.Initialize();
                }

                Console.WriteLine("Dextop preprocessing complete.");      
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Dextop preprocessor error: " + ex);                
                return 1;
            }
        }

        private static void PrintUsage()
        {            
            Console.WriteLine("Syntax: Codaxy.Dextop.Preprocessor source [/virtualPath:path]");
            Console.WriteLine("Switches:");
            string switchFormat = "  {0:-20} {1}";
            Console.WriteLine(switchFormat, virtualPathSwitch, "Sets different virtual path. Default is '/'.");
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
