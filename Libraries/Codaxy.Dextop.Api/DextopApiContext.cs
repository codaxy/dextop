using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Autofac;
using Codaxy.Dextop.Api.Util;

namespace Codaxy.Dextop.Api
{
    public sealed class DextopApiContext : IDisposable
    {
        readonly ILifetimeScope scope;

        public DextopApiContext(ILifetimeScope scope)
        {
            this.scope = scope.BeginLifetimeScope();
        }

        public DextopConfig Scope { get; set; }
        public HttpContextBase HttpContext { get; set; }

        public object ResolveScoped(Type type)
        {
            if (Scope!=null)
                return scope.Resolve(type, new AutofacConfigParameter(Scope));

            return Resolve(type);
        }

        public Type ResolveScoped<Type>()
        {
            return (Type)ResolveScoped(typeof(Type));
        }

        public Type Resolve<Type>()
        {
            return scope.Resolve<Type>();
        }

        public object Resolve(Type type)
        {
            return scope.Resolve(type);
        }

        internal DextopApiController ResolveController(Type controllerType)
        {
            var controller = (DextopApiController)ResolveScoped(controllerType);
            controller.Context = this;
            return controller;
        }

        public void Dispose()
        {
            scope.Dispose();
        }
    }
}
