using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Direct
{
    public class Response
    {
        public string type
        {
            get;
            set;
        }
        public string action
        {
            get;
            set;
        }
        public string method
        {
            get;
            set;
        }
        public object result
        {
            get;
            set;
        }
        public int tid
        {
            get;
            set;
        }
    }
}
