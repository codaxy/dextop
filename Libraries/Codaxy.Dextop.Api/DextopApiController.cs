using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Api
{
    public class DextopApiController
    {
        internal protected DextopApiContext Context { get; set; }

        internal protected virtual void OnInitialize()
        {
            
        }

        internal protected virtual void OnError(Exception ex)
        {

        }

        protected virtual IDextopApiActionInvoker CreateActionInvoker(String action, params String[] arguments)
        {
            IDextopApiActionInvoker invoker;
            if (ProxyActionInvoker.Try(this, action, out invoker))
                return invoker;
            return new StandardActionInvoker(this);
        }

        internal DextopApiInvocationResult Invoke(String action, params String[] arguments)
        {
            var invoker = CreateActionInvoker(action, arguments);
            var result = invoker.Invoke(action, arguments);
            return result;
        }
    }
}
