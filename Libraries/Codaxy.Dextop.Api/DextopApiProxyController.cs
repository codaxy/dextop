using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Api
{
    public abstract class DextopApiProxyController<T> : IDextopApiController
        where T: class
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

        protected abstract DextopReadResult<T> Read(DextopReadFilter filter);
    }


}
