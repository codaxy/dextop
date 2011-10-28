using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Tests.Helpers
{
    class DextopTestApplication : DextopApplication
    {
        protected override void RegisterModules()
        {

        }

        public override string MapNamespace(string ns)
        {
            return "Test";
        }
    }
}
