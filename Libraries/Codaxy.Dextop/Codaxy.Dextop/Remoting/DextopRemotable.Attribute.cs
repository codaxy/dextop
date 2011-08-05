using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Remoting
{
	/// <summary>
	/// Use DextopRemotable attribute to mark that associated method is remotable.
	/// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Constructor)]
    public class DextopRemotableAttribute : System.Attribute
    {
    }

    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Constructor)]
    public class DextopRemotableConstructorAttribute : DextopRemotableAttribute
    {
        public string alias { get; set; }
    }
}
