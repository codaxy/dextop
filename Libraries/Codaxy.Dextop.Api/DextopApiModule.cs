using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Autofac.Builder;

namespace Codaxy.Dextop.Api
{
    public class DextopApiAutofacModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);
            builder.RegisterType<DextopApiContext>();
            builder.RegisterType<StandardActionInvoker>().As<IDextopApiActionInvoker>().SingleInstance();
        }
    }

    public static class DextopApiRegistration
    {
        public static IRegistrationBuilder<object, Autofac.Features.Scanning.ScanningActivatorData, DynamicRegistrationStyle> RegisterApiControllers(this ContainerBuilder builder, params Assembly[] assemblies)
        {
            return builder.RegisterAssemblyTypes(assemblies).Where(t => t.IsAssignableTo<DextopApiController>());
        }        
    }
}

