using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Codaxy.Dextop
{
    class DextopWebEnvironment : IDextopEnvironment
    {
        public string VirtualAppPath
        {
            get { return HttpRuntime.AppDomainAppVirtualPath; }
        }

        public string PhysicalAppPath
        {
            get { return HttpRuntime.AppDomainAppPath; }
        }

        public DateTime Now
        {
            get
            {
                return DateTime.Now;
            }            
        }

        public DateTime UtcNow
        {
            get
            {
                return DateTime.UtcNow;
            }
            
        }
    }
}
