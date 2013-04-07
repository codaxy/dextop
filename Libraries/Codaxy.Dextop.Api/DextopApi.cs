using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Autofac;

namespace Codaxy.Dextop.Api
{
    public class DextopApi
    {
        static IContainer container;

        public static void Initialize(IContainer c)
        {
            container = c;
        }

        public static T Resolve<T>()
        {
            return container.Resolve<T>();
        }
    }
}
