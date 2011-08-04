using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Simple implementation of IDextopRemotable with public Config property.
	/// </summary>
	public class DextopRemotableConfig : IDextopRemotable
	{
		/// <summary>
		/// Gets the remote object used for client-side communication.
		/// </summary>
		public DextopRemote Remote
		{
			get; private set;
		}

		/// <summary>
		/// Gets or sets the config.
		/// </summary>
		public DextopConfig Config { get; set; }
		
		/// <summary>
		/// Gets or sets the type of the remote host.
		/// </summary>		
		public String RemoteHostType { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopRemotableConfig"/> class.
		/// </summary>
		/// <param name="remoteHostType">Type of the remote host.</param>
		/// <param name="config">The config.</param>
		public DextopRemotableConfig(string remoteHostType, DextopConfig config)
		{
			Config = config;			
			RemoteHostType = remoteHostType;
		}

		/// <summary>
		/// Initializes the remotable object.
		/// </summary>
		/// <param name="remote">Remote object used for communication with the client-side object.</param>
		/// <param name="config">Configuration of the object to be created on the client side.</param>
		public void InitRemotable(DextopRemote remote, DextopConfig config)
		{
			Remote = remote;
			if (Config != null)
			{
				config.Apply(Config);
				Config = null;
			}

			remote.RemoteHostType = RemoteHostType;
		}

		/// <summary>
		/// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
		/// </summary>
		public void Dispose()
		{
			if (Remote!=null)
				Remote.Dispose();
		}
	}
}
