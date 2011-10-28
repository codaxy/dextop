using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
    /// <summary>
    /// DextopEnvironment provides information about hosting environment.
    /// </summary>
    public interface IDextopEnvironment
    {
        /// <summary>
        /// Gets the virtual path of the directory that contains the application hosted in the current application domain.
        /// </summary>
        string VirtualAppPath { get; }

        /// <summary>
        /// Gets the physical drive path of the application directory for the application hosted in the current application domain.
        /// </summary>
        string PhysicalAppPath { get; }

        /// <summary>
        /// Gets a DateTime object that is set to the current date and time on this computer, expressed as the local time.
        /// </summary>
        DateTime Now { get; }

        /// <summary>
        /// Gets a DateTime object that is set to the current date and time on this computer, expressed as the Coordinated Universal Time (UTC).
        /// </summary>
        DateTime UtcNow { get; }
    }
}
