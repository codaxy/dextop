using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Live store.
	/// </summary>
    public class DextopLiveStore : IDextopRemotable
    {
        IDextopModelSerializer serializer;
        IDextopObservableStore store;
        DextopModelTypeMeta meta;
        bool subscribed;

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopLiveStore"/> class.
		/// </summary>
		/// <param name="meta">The meta.</param>
		/// <param name="source">The source.</param>
		/// <param name="serializer">The serializer.</param>
        public DextopLiveStore(DextopModelTypeMeta meta, IDextopObservableStore source = null, IDextopModelSerializer serializer = null)
        {
            this.meta = meta;
            this.serializer = serializer ?? meta.ArraySerializer;
            Source = source;
        }

		/// <summary>
		/// Gets or sets the underlying data store.
		/// </summary>		
        public IDextopObservableStore Source
        {
            get { return store; }
            set
            {
                DetachSourceHandlers();
                store = value;
                AttachSourceHandlers();
            }
        }

        [DextopRemotable]
        void Subscribe()
        {
            subscribed = true;
            var data = Source.Load();
            Remote.SendMessage(new Message
            {                
                load = Serialize(data)
            });
        }

        private void AttachSourceHandlers()
        {
            if (store != null)
                store.DataChanged += OnSourceDataChanged;
        }

        class Message
        {
            public String load { get; set; }
            public String add { get; set; }
            public String update { get; set; }
            public String remove { get; set; }
        }

        void OnSourceDataChanged(object sender, DextopStoreEventArgs e)
        {
            var remote = Remote;
            if (subscribed && remote != null)
            {
                var msg = new Message
                {
                    load = e.Event.Clear ? Serialize(new object[0]) : null,
                    add = Serialize(e.Event.Create),
                    remove = Serialize(e.Event.Destroy),
                    update = Serialize(e.Event.Update)
                };
                remote.SendMessage(msg);
            }
        }

        private string Serialize(IList<object> data)
        {
            if (data == null)
                return null;
            return serializer.Serialize(data);
        }

        private void DetachSourceHandlers()
        {
            if (store != null)
                store.DataChanged -= OnSourceDataChanged;
        }

		/// <summary>
		/// Gets the remote object used for client-side communication.
		/// </summary>
        public DextopRemote Remote { get; private set; }

		/// <summary>
		/// Initializes the remotable object.
		/// </summary>
		/// <param name="remote">Remote object used for communication with the client-side object.</param>
		/// <param name="config">Configuration of the object to be created on the client side.</param>
        public void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            Remote = remote;
            remote.RemoteHostType = "Dextop.data.LiveStore";
            config["model"] = meta.ModelName;
        }

		/// <summary>
		/// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
		/// </summary>
        public void Dispose()
        {
            DetachSourceHandlers();
            if (Remote != null)
                Remote.Dispose();
        }
    }
}
