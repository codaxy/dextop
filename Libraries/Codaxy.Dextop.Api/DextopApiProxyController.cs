using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Api
{
    public abstract class DextopApiProxyController<T> : DextopApiController
        where T : class
    {
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

        protected abstract DextopReadResult<T> Read(DextopReadFilter filter);
        protected virtual IEnumerable<T> Create(IEnumerable<T> records) { throw new NotSupportedException("Proxy does not support create method."); }
        protected virtual IEnumerable<T> Update(IEnumerable<T> records) { throw new NotSupportedException("Proxy does not support update method."); }
        protected virtual IEnumerable<T> Delete(IEnumerable<T> records) { throw new NotSupportedException("Proxy does not support delete method."); }

        public virtual object Load(string json)
        {
            var filter = DextopUtil.Decode<DextopReadFilter>(json);
            var result = Read(filter);
            var serializer = Serializer;

            return new ExtendedReadResult
            {
                total = result.TotalCount,
                data = serializer.Serialize(result.Rows)
            };
        }

        public virtual object Create(String json)
        {
            var serializer = Serializer;
            var data = serializer.Deserialize(json);
            var result = Create(data.Select(a => (T)a)).ToArray();
            return new ReadResult { data = serializer.Serialize(result.Select(a => (object)a).ToArray()) };
        }

        public virtual object Update(String json)
        {
            var serializer = Serializer;
            var data = serializer.Deserialize(json);
            var result = Update(data.Select(a => (T)a)).ToArray();
            return new ReadResult { data = serializer.Serialize(result.Select(a => (object)a).ToArray()) };
        }

        public virtual object Destroy(String json)
        {
            var serializer = Serializer;
            var data = serializer.Deserialize(json);
            var result = Delete(data.Select(a => (T)a)).ToArray();
            return new ReadResult { data = serializer.Serialize(result.Select(a=>(object)a).ToArray()) };
        }
    }


}
