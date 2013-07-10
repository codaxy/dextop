using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Autofac;
using Autofac.Core;

namespace Codaxy.Dextop.Api.Util
{
    class AutofacConfigParameter : Parameter
    {
        DextopConfig config;
        public AutofacConfigParameter(DextopConfig config)
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
}
