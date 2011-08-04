using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Default implementation of the IDextopRemotable interface which can be used as a base class.
	/// </summary>
	public class DextopRemotableBase : IDextopRemotable
	{
		/// <summary>
		/// Gets the remote object used for client-side communication.
		/// </summary>
		public DextopRemote Remote { get; private set; }

		/// <summary>
		/// Initializes the remotable object.
		/// </summary>
		/// <param name="remote">Remote object used for communication with the client-side object.</param>
		/// <param name="config">Configuration of the object to be created on the client side.</param>
		public virtual void InitRemotable(DextopRemote remote, DextopConfig config)
		{
			Remote = remote;
		}

		/// <summary>
		/// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
		/// </summary>
		public virtual void Dispose()
		{
			if (Remote != null)
				Remote.Dispose();
		}
	}
}
