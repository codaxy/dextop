using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Remoting
{
    class DextopRemoteMethodCall
    {
        public String RemoteId { get; set; }
        public String MethodName { get; set; }
        public string[] Arguments { get; set; }
        public DextopFormSubmit FormSubmit { get; set; }
    }

    class DextopRemoteMethodCallResult
    {
        public bool success { get; set; }
        public object result { get; set; }
    }    

    class DextopRemoteMethodCallException
    {
        public string type { get; set; }
        public string exception { get; set; }
        public string stackTrace { get; set; }
    }    

	/// <summary>
	/// Implement IDextopRemotable to allow RPC calls from the client. 
	/// </summary>
    public interface IDextopRemotable : IDisposable
    {
		/// <summary>
		/// Gets the remote object used for client-side communication.
		/// </summary>
        DextopRemote Remote { get; }           

		/// <summary>
		/// Initializes the remotable object. 
		/// </summary>
		/// <param name="remote">Remote object used for communication with the client-side object.</param>
		/// <param name="config">Configuration of the object to be created on the client side.</param>
        void InitRemotable(DextopRemote remote, DextopConfig config);
    }
}
