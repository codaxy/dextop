using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using Codaxy.Common.IO;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Direct
{
    public enum RequestType { Action, FormSubmit }

    public class Request
    {
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
        public String[] data
        {
            get;
            set;
        }
        public int tid
        {
            get;
            set;
        }
        public string type
        {
            get;
            set;
        }

        public RequestType RequestType { get; set; }

        public DextopFormSubmit FormSubmit { get; set; }
    }
}
