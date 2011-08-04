using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Tools
{
	/// <summary>
	/// An object which knows how to write its own JS implementation
	/// </summary>
    public interface IDextopJsObject
    {
		/// <summary>
		/// Writes the JS representation of the object to the writer.
		/// </summary>
		/// <param name="jw">The writer.</param>
        void WriteJs(DextopJsWriter jw);
    }
}
