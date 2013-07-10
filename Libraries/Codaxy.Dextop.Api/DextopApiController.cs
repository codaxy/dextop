using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Codaxy.Dextop.Api
{
    public class DextopApiController
    {
        internal protected DextopApiContext Context { get; set; }

        internal protected virtual void OnInitialize()
        {
            
        }

        internal protected virtual void OnError(Exception ex)
        {

        }
    }
}
