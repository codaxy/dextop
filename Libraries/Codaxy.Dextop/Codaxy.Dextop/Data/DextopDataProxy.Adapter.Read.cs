using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
    class DextopReadProxyAdapter<T> : IDextopDataProxy where T:class
    {
        readonly IDextopReadProxy<T> proxy;

        public DextopReadProxyAdapter(IDextopReadProxy<T> proxy)
        {
            if (proxy == null)
                throw new ArgumentNullException("proxy");
            this.proxy = proxy;
        }

        IList<object> IDextopDataProxy.Create(IList<object> data)
        {
            throw new NotSupportedException();
        }

        IList<object> IDextopDataProxy.Destroy(IList<object> data)
        {
            throw new NotSupportedException();
        }

        IList<object> IDextopDataProxy.Update(IList<object> data)
        {
            throw new NotSupportedException();
        }

        DextopReadResult IDextopReadProxy.Read(DextopReadFilter filter)
        {
            return proxy.Read(filter);
        }
    }
}
