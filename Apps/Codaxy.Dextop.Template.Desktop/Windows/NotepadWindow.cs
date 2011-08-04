using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Template.Desktop.Windows
{
	public class NotepadWindow : DextopWindow
	{
		[DextopRemotable]
		public String UploadContent(String content)
		{
			return String.Format("HTML content of length {0:#,#0} has been uploaded.", content.Length);
		}
	}
}