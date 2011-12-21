using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Codaxy.Dextop
{
    /// <summary>
    /// Loads data on startup.
    /// </summary>
    public interface IDextopFileLoader
    {
        /// <summary>
        /// Loads data from the input stream.
        /// </summary>
        /// <param name="application"></param>
        /// <param name="module"></param>
        /// <param name="inputStream"></param>
        void Load(DextopApplication application, DextopModule module, Stream inputStream);
    }
}
