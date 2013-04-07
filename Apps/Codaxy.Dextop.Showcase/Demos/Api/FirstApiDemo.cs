using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Api;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("FirstApiDemo",
        Title = "First API Demo",
        Description = "Show how to use stateless Dextop API",
        ClientLauncher = true,
        Path = "~/Demos/Api"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
    [CategoryDemo]
    public class FirstApiDemo : IDextopApiController
    {
        public string HelloWorld()
        {
            return "Hello World!";
        }
    }
}