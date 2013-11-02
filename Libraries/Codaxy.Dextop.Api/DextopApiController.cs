using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Api
{
    public class DextopApiController : IDisposable
    {
        internal protected DextopApiContext Context { get; set; }

        internal protected virtual void OnInitialize()
        {

        }

        internal protected virtual void OnError(Exception ex) { }

        internal protected virtual void OnExecuted() { }

        internal protected virtual void OnExecuting() { }

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

        void IDisposable.Dispose()
        {
            Dispose(true);

            // Call SupressFinalize in case a subclass implements a finalizer.
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {

        }
    }
}
