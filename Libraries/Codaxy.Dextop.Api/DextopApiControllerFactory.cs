using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Autofac.Core;

namespace Codaxy.Dextop.Api
{
    public interface IDextopApiControllerFactory
    {
        IDextopApiController GetController(Type controllerType);
    }

    public delegate IDextopApiControllerFactory DextopApiControllerFactoryFactory(DextopConfig scope);

    class DextopApiControllerFactory : IDextopApiControllerFactory, IDisposable
    {
        readonly ILifetimeScope scope;
        readonly DextopConfig parameters;

        class ConfigParameter : Parameter
        {
            DextopConfig config;
            public ConfigParameter(DextopConfig config)
            {
                this.config = config;
            }

            public override bool CanSupplyValue(System.Reflection.ParameterInfo pi, IComponentContext context, out Func<object> valueProvider)
            {
                object value;
                if (config.TryGetValue(pi.Name, out value))
                {
                    valueProvider = () => Codaxy.Common.Convert.ChangeType(value, pi.ParameterType);
                    return true;
                }

                valueProvider = null;
                return false;
            }
        }

        public DextopApiControllerFactory(ILifetimeScope scope, DextopConfig parameters)
        {
            this.scope = scope;
            this.parameters = parameters;
        }

        public IDextopApiController GetController(Type controllerType)
        {
            return (IDextopApiController)scope.Resolve(controllerType, new ConfigParameter(parameters));
        }

        public void Dispose()
        {
            scope.Dispose();
        }
    }
}
