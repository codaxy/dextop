using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase.Demos
{
    public class DemoAttribute : System.Attribute
    {
        public String Id { get; set; }
        public DemoAttribute(String id) { Id = id; }
        public String Title { get; set; }
        public String Description { get; set; }
        public bool ClientLauncher { get; set; }
        public String Path { get; set; }
    }
}