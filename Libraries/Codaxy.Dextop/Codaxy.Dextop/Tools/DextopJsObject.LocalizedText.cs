using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Tools
{
	class DextopRawJs : IDextopJsObject
	{
		public String Text { get; set; }

		public DextopRawJs() { }
		public DextopRawJs(String text) { Text = text; }
		public DextopRawJs(String format, params object[] args) { Text = String.Format(format, args); }

		public void WriteJs(DextopJsWriter jw)
		{
			jw.Write(Text);
		}
	}
}
