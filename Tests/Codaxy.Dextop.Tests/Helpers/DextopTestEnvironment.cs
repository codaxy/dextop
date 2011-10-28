using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Tests.Helpers
{
    class DextopTestEnvironment : IDextopEnvironment
    {
        public string VirtualAppPath
        {
            get { return "/"; }
        }

        public string PhysicalAppPath
        {
            get { return "."; }
        }

        public DateTime Now
        {
            get { return DateTime.Now; }
        }

        public DateTime UtcNow
        {
            get { return DateTime.UtcNow; }
        }
    }
}
