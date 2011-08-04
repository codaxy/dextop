using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Base class used for various Dextop windows.
	/// </summary>
	public class DextopWindow : DextopRemotableBase
    {
		/// <summary>
		/// Gets the session associated with the window.
		/// </summary>
		public DextopSession Session { get { return Remote.Context.Session; } }
	}

	/// <summary>
	/// Base class used for various Dextop windows.
	/// </summary>
	/// <typeparam name="SessionType">The type of the session type.</typeparam>
	public class DextopWindow<SessionType> : DextopWindow where SessionType: DextopSession
	{
		/// <summary>
		/// Gets the session associated with the window.
		/// </summary>
		public new SessionType Session { get { return (SessionType)Remote.Context.Session; } }
	}
}
