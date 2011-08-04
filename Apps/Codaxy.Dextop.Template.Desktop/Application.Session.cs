using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Template.Desktop.Windows;

namespace Codaxy.Dextop.Template.Desktop
{
	public class Session : DextopSession
	{
		public override void InitRemotable(DextopRemote remote, DextopConfig config)
		{
			base.InitRemotable(remote, config);
		}

		DextopWindow DoCreateWindow(String windowType, DextopConfig windowArgs)
		{
			switch (windowType)
			{
				case "grid": return new GridWindow();
				case "notepad": return new NotepadWindow();
			}
			throw new DextopErrorMessageException("Unknown window type '{0}'.", windowType);
		}

		[DextopRemotable]
		public DextopConfig CreateWindow(String windowType, DextopConfig windowArgs)
		{
			var w = DoCreateWindow(windowType, windowArgs);
			return Remote.Register(w);
		}
	}
}