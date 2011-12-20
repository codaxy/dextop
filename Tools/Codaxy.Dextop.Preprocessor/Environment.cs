using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Preprocessor
{
    class DextopPreprocessorEnvironment : IDextopEnvironment
    {
        public string VirtualAppPath
        {
            get { return "/showcase"; }
        }

        public string PhysicalAppPath
        {
            get;
            set;
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
