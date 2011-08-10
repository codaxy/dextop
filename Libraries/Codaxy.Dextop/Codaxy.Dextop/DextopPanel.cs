using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
    /// <summary>
    /// Base class used for various Dextop windows.
    /// </summary>
    public class DextopPanel : DextopRemotableBase
    {
        /// <summary>
        /// Gets the session associated with the window.
        /// </summary>
        public DextopSession Session { get { return Remote.Context.Session; } }
    }
}
