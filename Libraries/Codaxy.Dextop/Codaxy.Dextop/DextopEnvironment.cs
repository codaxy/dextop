using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
    /// <summary>
    /// DextopEnvironment provides information about hosting environment.
    /// </summary>
    public class DextopEnvironment
    {
        /// <summary>
        /// Gets the virtual path of the directory that contains the application hosted in the current application domain.
        /// </summary>
        public static string VirtualAppPath { get { return _environment.VirtualAppPath; } }

        /// <summary>
        /// Gets the physical drive path of the application directory for the application hosted in the current application domain.
        /// </summary>
        public static string PhysicalAppPath { get { return _environment.PhysicalAppPath; } }

        /// <summary>
        /// Gets a DateTime object that is set to the current date and time on this computer, expressed as the local time.
        /// </summary>
        public static DateTime Now { get { return _environment.Now; } }


        /// <summary>
        /// Gets a DateTime object that is set to the current date and time on this computer, expressed as the Coordinated Universal Time (UTC).
        /// </summary>
        public static DateTime UtcNow { get { return _environment.UtcNow; } }

        static IDextopEnvironment _environment = new DextopWebEnvironment();


        /// <summary>
        /// Override default environment data provider. Use this option if dextop is not hosted inside IIS.
        /// </summary>
        /// <param name="provider"></param>
        public static void SetProvider(IDextopEnvironment provider)
        {
            if (provider == null)
                throw new ArgumentNullException("provider");
            _environment = provider;
        }

    }
}
