using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase.Demos
{
    public class TopicAttribute : System.Attribute
    {
        public String Name { get; set; }
    }

    public class TopicDextopRemotingAttribute : TopicAttribute
    {
        public TopicDextopRemotingAttribute() { Name = "Remoting"; }
    }

    public class TopicDextopWindowsAttribute : TopicAttribute
    {
        public TopicDextopWindowsAttribute() { Name = "Windows"; }
    }

    public class TopicDextopGridAttribute : TopicAttribute
    {
        public TopicDextopGridAttribute() { Name = "Grid"; }
    }

    public class TopicDextopFormsAttribute : TopicAttribute
    {
        public TopicDextopFormsAttribute() { Name = "Forms"; }
    }

    public class TopicDextopLiveAttribute : TopicAttribute
    {
        public TopicDextopLiveAttribute() { Name = "Live"; }
    }
}