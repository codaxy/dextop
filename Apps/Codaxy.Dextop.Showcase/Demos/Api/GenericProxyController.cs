using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Api;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Api
{
    public class GenericProxyController<E, Id> : DextopApiController, IDextopDataProxy<E>
        where E: class
    {
        public IList<E> Create(IList<E> records)
        {
            throw new NotImplementedException();
        }

        public IList<E> Destroy(IList<E> records)
        {
            throw new NotImplementedException();
        }

        public IList<E> Update(IList<E> records)
        {
            throw new NotImplementedException();
        }

        public DextopReadResult<E> Read(DextopReadFilter filter)
        {
            throw new NotImplementedException();
        }
    }

    class M1 { }

    class C1 : GenericProxyController<M1, int> { }
}