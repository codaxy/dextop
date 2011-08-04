using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	public partial class DextopSession
	{
		DextopDependencyResolver _dr;
		DextopDependencyResolver DepencencyResolver { get { return _dr ?? (_dr = new DextopDependencyResolver()); } }

		/// <summary>
		/// Registers all services on which session depends.
		/// </summary>
		protected virtual void RegisterDependencies()
		{

		}
	}
}
