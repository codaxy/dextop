using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Codaxy.Common.Localization.Xml
{
    class PathUtil
    {
        public static String GetLocalizationFilePath(String basePath, String assemblyName, String langCode)
        {
            return System.IO.Path.Combine(basePath, assemblyName + "." + langCode + ".xml");
        }

        public static String GetDefaultLocalizationFilePath(String basePath, Assembly assembly)
        {
            return System.IO.Path.Combine(basePath, AssemblyHelper.GetAssemblyName(assembly) + ".xml");
        }
    }
}
