using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Api
{
    public interface DextopApiInvoker
    {
        object Invoke(String controllerType, String action, String[] arguments);
    }
}
