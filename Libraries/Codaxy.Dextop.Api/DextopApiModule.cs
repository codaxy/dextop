using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Autofac;

namespace Codaxy.Dextop.Api
{
    public class DextopApiModule : Autofac.Module
    {
        private Assembly[] assemblies;

        public DextopApiModule(params Assembly[] assemblies)
        {
            this.assemblies = assemblies;
        }

        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);
            builder.Register<DextopApiControllerFactoryFactory>(ctx =>
            {
                var lifetimeScope = ctx.Resolve<ILifetimeScope>();
                return (scope) => new DextopApiControllerFactory(lifetimeScope, scope);
            });
            builder.RegisterAssemblyTypes(assemblies).Where(t => t.IsAssignableTo<IDextopApiController>()).As<IDextopApiController>();
        }
    }
}
