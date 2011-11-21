using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;
using Newtonsoft.Json.Linq;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Remotable data proxy. This class gets called by the Dextop.data.Proxy client-side object.
	/// </summary>
    public class DextopProxy : IDextopRemotable
    {
        class ReadResult
        {
            public object data { get; set; }
        }

        class EncodedReadResult : ReadResult
        {
            public int total { get; set; }            
        }

        readonly IDextopModelSerializer serializer;
		readonly IDextopDataProxy proxy;
		readonly DextopModelTypeMeta meta;

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopProxy"/> class.
		/// </summary>
		/// <param name="dataProxy">The data proxy service.</param>
		/// <param name="meta">The meta.</param>
		/// <param name="serializer">The serializer.</param>
        public DextopProxy(IDextopDataProxy dataProxy, DextopModelTypeMeta meta, IDextopModelSerializer serializer = null)
        {
            this.proxy = dataProxy;
            this.meta = meta;
            this.serializer = serializer ?? meta.ArraySerializer;             
        }

		/// <summary>
		/// Gets the remote object used for client-side communication.
		/// </summary>
        public DextopRemote Remote
        {
            get;
            private set;
        }

		/// <summary>
		/// Initializes the remotable object.
		/// </summary>
		/// <param name="remote">Remote object used for communication with the client-side object.</param>
		/// <param name="config">Configuration of the object to be created on the client side.</param>
        public void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            Remote = remote;
            Remote.RemoteHostType = "Dextop.data.Proxy";
            config["model"] = meta.ModelName; 
        }

        [DextopRemotable]
        EncodedReadResult Load(string optionsJSON)
        {
            var filter = DextopUtil.Decode<DextopReadFilter>(optionsJSON);
            var result = proxy.Read(filter);
            return new EncodedReadResult
            {
                total = result.TotalCount,
                data = serializer.Serialize(result.Rows)
            };
        }

        [DextopRemotable]
        ReadResult Create(String json)
        {
            var data = serializer.Deserialize(json);
            var result = proxy.Create(data);
            return new ReadResult { data = serializer.Serialize(result) };
        }

        [DextopRemotable]
        ReadResult Update(String json)
        {
            var data = serializer.Deserialize(json);
            var result = proxy.Update(data);
            return new ReadResult { data = serializer.Serialize(result) };
        }

        [DextopRemotable]
        ReadResult Destroy(String json)
        {
            var data = serializer.Deserialize(json);
            var result = proxy.Destroy(data);
            return new ReadResult { data = serializer.Serialize(result) };
        }

		/// <summary>
		/// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
		/// </summary>
        public void Dispose()
        {
            if (Remote != null)
                Remote.Dispose();
        }
    }
}
