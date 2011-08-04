using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Remoting
{
	/// <summary>
	/// Use DextopRemotable attribute to mark that associated method is remotable.
	/// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class DextopRemotableAttribute : System.Attribute
    {
    }
}
