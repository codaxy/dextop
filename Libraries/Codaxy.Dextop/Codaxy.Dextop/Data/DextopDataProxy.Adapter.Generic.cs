using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Adapter type used to convert a generic proxy to a non-generic IDextopDataProxy.
	/// </summary>
	/// <typeparam name="Model">Model type</typeparam>
    public class DextopDataProxyAdapter<Model> : IDextopDataProxy where Model : class
    {
        readonly IDextopDataProxy<Model> proxy;

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopDataProxyAdapter&lt;Model&gt;"/> class.
		/// </summary>
		/// <param name="proxy">The proxy.</param>
        public DextopDataProxyAdapter(IDextopDataProxy<Model> proxy)
        {
            if (proxy == null)
                throw new ArgumentNullException("proxy");
            this.proxy = proxy;
        }

        IList<object> IDextopDataProxy.Create(IList<object> data)
        {
            return proxy.Create(data.Select(a => (Model)a).ToArray()).ToArray();
        }

        IList<object> IDextopDataProxy.Destroy(IList<object> data)
        {
            return proxy.Destroy(data.Select(a => (Model)a).ToArray()).ToArray();
        }

        IList<object> IDextopDataProxy.Update(IList<object> data)
        {
            return proxy.Update(data.Select(a => (Model)a).ToArray()).ToArray();
        }

        DextopReadResult IDextopReadProxy.Read(DextopReadFilter options)
        {
            return proxy.Read(options);
        }
    }
}
