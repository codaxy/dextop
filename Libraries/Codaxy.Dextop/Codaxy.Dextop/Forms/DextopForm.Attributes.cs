using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Indicates that a class has a Dextop form representation.
	/// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class DextopFormAttribute : System.Attribute
    {
    }
}
