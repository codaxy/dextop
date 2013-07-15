using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Api
{
    class ProxyActionInvoker
    {
        public static bool Try(DextopApiController controller, String action, out IDextopApiActionInvoker invoker)
        {
            invoker = null;
            switch (action)
            {
                case "read":
                case "create":
                case "update":
                case "destroy":
                    break;
                
                default:
                    return false;
            }
            var proxyInterface = controller.GetType().GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IDextopReadProxy<>));

            if (proxyInterface==null)
                return false;

            var type = typeof(ProxyActionInvoker<>).MakeGenericType(proxyInterface.GetGenericArguments());
            invoker = (IDextopApiActionInvoker)Activator.CreateInstance(type, controller);
            return true;
        }

    }
    class ProxyActionInvoker<T> : IDextopApiActionInvoker
        where T: class
    {
        IDextopReadProxy<T> proxy;
        
        public ProxyActionInvoker(IDextopReadProxy<T> proxy)
        {
            this.proxy = proxy;
        }

        class ReadResult
        {
            public object data { get; set; }
        }

        class ExtendedReadResult : ReadResult
        {
            public int total { get; set; }
        }

        IDextopModelSerializer _serializer;
        IDextopModelSerializer Serializer
        {
            get
            {
                if (_serializer == null)
                    _serializer = ResolveModelSerializer();
                return _serializer;
            }
        }

        private IDextopModelSerializer ResolveModelSerializer()
        {
            return DextopApplication.GetApplication().ModelManager.GetModelMeta(typeof(T)).DefaultSerializer;
        }

        public DextopApiInvocationResult Invoke(string action, string[] arguments)
        {
            object result = null;
            switch (action)
            {
                case "read":
                    result = Load(arguments[0]);
                    break;
                case "create":
                    result = Create(arguments[0]);
                    break;
                case "update":
                    result = Update(arguments[0]);
                    break;
                case "destroy":
                    result = Destroy(arguments[0]);
                    break;
                default:
                    throw new DextopException();
            }

            return DextopApiInvocationResult.Success(result);
        }

        object Load(string json)
        {
            var filter = DextopUtil.Decode<DextopReadFilter>(json);
            var result = proxy.Read(filter);
            var serializer = Serializer;

            return new ExtendedReadResult
            {
                total = result.TotalCount,
                data = serializer.Serialize(result.Rows)
            };
        }

        IDextopDataProxy<T> Proxy
        {
            get
            {
                var result = proxy as IDextopDataProxy<T>;
                if (result == null)
                    throw new DextopException("Controller does not implement write methods.");
                return result;
            }
        }

        object Create(String json)
        {
            var serializer = Serializer;
            var data = serializer.Deserialize(json);
            var result = Proxy.Create(data.Select(a => (T)a).ToArray()).ToArray();
            return new ReadResult { data = serializer.Serialize(result.Select(a => (object)a).ToArray()) };
        }

        object Update(String json)
        {
            var serializer = Serializer;
            var data = serializer.Deserialize(json);
            var result = Proxy.Update(data.Select(a => (T)a).ToArray()).ToArray();
            return new ReadResult { data = serializer.Serialize(result.Select(a => (object)a).ToArray()) };
        }

        object Destroy(String json)
        {
            var serializer = Serializer;
            var data = serializer.Deserialize(json);
            var result = Proxy.Destroy(data.Select(a => (T)a).ToArray()).ToArray();
            return new ReadResult { data = serializer.Serialize(result.Select(a => (object)a).ToArray()) };
        }
    }

    //public abstract class DextopApiProxyController<T> : DextopApiController
    //    where T : class
    //{
    //    class ReadResult
    //    {
    //        public object data { get; set; }
    //    }

    //    class ExtendedReadResult : ReadResult
    //    {
    //        public int total { get; set; }
    //    }

    //    IDextopModelSerializer _serializer;
    //    IDextopModelSerializer Serializer
    //    {
    //        get
    //        {
    //            if (_serializer == null)
    //                _serializer = ResolveModelSerializer();
    //            return _serializer;
    //        }
    //    }

    //    private IDextopModelSerializer ResolveModelSerializer()
    //    {
    //        return DextopApplication.GetApplication().ModelManager.GetModelMeta(typeof(T)).DefaultSerializer;
    //    }

    //    protected abstract DextopReadResult<T> Read(DextopReadFilter filter);
    //    protected virtual IEnumerable<T> Create(IEnumerable<T> records) { throw new NotSupportedException("Proxy does not support create method."); }
    //    protected virtual IEnumerable<T> Update(IEnumerable<T> records) { throw new NotSupportedException("Proxy does not support update method."); }
    //    protected virtual IEnumerable<T> Delete(IEnumerable<T> records) { throw new NotSupportedException("Proxy does not support delete method."); }

    //    public virtual object Load(string json)
    //    {
    //        var filter = DextopUtil.Decode<DextopReadFilter>(json);
    //        var result = Read(filter);
    //        var serializer = Serializer;

    //        return new ExtendedReadResult
    //        {
    //            total = result.TotalCount,
    //            data = serializer.Serialize(result.Rows)
    //        };
    //    }

    //    public virtual object Create(String json)
    //    {
    //        var serializer = Serializer;
    //        var data = serializer.Deserialize(json);
    //        var result = Create(data.Select(a => (T)a)).ToArray();
    //        return new ReadResult { data = serializer.Serialize(result.Select(a => (object)a).ToArray()) };
    //    }

    //    public virtual object Update(String json)
    //    {
    //        var serializer = Serializer;
    //        var data = serializer.Deserialize(json);
    //        var result = Update(data.Select(a => (T)a)).ToArray();
    //        return new ReadResult { data = serializer.Serialize(result.Select(a => (object)a).ToArray()) };
    //    }

    //    public virtual object Destroy(String json)
    //    {
    //        var serializer = Serializer;
    //        var data = serializer.Deserialize(json);
    //        var result = Delete(data.Select(a => (T)a)).ToArray();
    //        return new ReadResult { data = serializer.Serialize(result.Select(a=>(object)a).ToArray()) };
    //    }
    //}


}
