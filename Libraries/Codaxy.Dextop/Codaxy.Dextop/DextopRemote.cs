using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;
using System.Web;
using Codaxy.Dextop.Data;
using System.Diagnostics;

namespace Codaxy.Dextop
{
	/// <summary>
	/// A class responsible for communication with the client-side.
	/// </summary>
    public partial class DextopRemote
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopRemote"/> class.
		/// </summary>
		/// <param name="context">The context.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
        public DextopRemote(DextopContext context, String remoteId, bool subRemote)
        {
            Context = context;
            RemoteId = remoteId;
            IsClientInitiated = subRemote;
        }

        DextopSession Session { get { return Context.Session; } }

		/// <summary>
		/// Gets the context.
		/// </summary>
        public DextopContext Context { get; private set; }

		/// <summary>
		/// Gets or sets the on process ajax request handler.
		/// </summary>		        
		public Action<HttpContext> OnProcessAjaxRequest { get; set; }
		
		/// <summary>
		/// Gets or sets the on map remoting exception delegate.
		/// </summary>		
		public Func<Exception, object> OnMapRemotingException { get; set; }

		/// <summary>
		/// Gets or sets the type of the object on the client side.
		/// </summary>		
        public string RemoteHostType { get; set; }

		/// <summary>
		/// Gets the remote id.
		/// </summary>
        public string RemoteId { get; private set; }

		/// <summary>
		/// Gets a value indicating whether this instance is client initiated.
		/// </summary>
		public bool IsClientInitiated { get; private set; }

		/// <summary>
		/// Sends the message to the clien.
		/// </summary>
		/// <param name="msgs">List of messages to be sent.</param>
        public void SendMessage(params object[] msgs)
        {
            Session.SendServerMessage(RemoteId, msgs);
        }

		/// <summary>
		/// Registers the specified remotable.
		/// </summary>
		/// <param name="remotable">The remotable.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
		/// <returns></returns>
        public DextopConfig Register(IDextopRemotable remotable, string remoteId = null, bool subRemote = true)
        {
            return Context.Session.Register(this, remotable, remoteId, subRemote);
        }

		/// <summary>
		/// Sends the notification to the client side.
		/// </summary>
		/// <param name="notification">The notification.</param>
		public void SendNotification(DextopNotification notification)
		{
			Session.SendNotification(notification);
		}

		/// <summary>
		/// Releases unmanaged and - optionally - managed resources
		/// </summary>
        public void Dispose()
        {
            if (RemoteId != null)
            {
                DisposeComponents();
                Session.Unregister(RemoteId);
                RemoteId = null;
                Context = null;
            }
        }
    }
}
