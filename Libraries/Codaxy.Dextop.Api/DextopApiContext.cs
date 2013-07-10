using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Autofac;
using Codaxy.Dextop.Api.Util;

namespace Codaxy.Dextop.Api
{
    public class DextopApiContext
    {
        readonly ILifetimeScope scope;

        public DextopApiContext(ILifetimeScope scope)
        {
            this.scope = scope;
        }

        public DextopConfig Scope { get; set; }
        public HttpContextBase HttpContext { get; set; }

        public object ResolveScoped(Type type)
        {
            return scope.Resolve(type, new AutofacConfigParameter(Scope));
        }
    }
}
