using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Codaxy.Dextop
{
    /// <summary>
    /// Loads data on startup
    /// </summary>
    public interface IDextopFileLoader
    {
        void Load(DextopApplication application, DextopModule module, Stream inputStream);
    }
}
