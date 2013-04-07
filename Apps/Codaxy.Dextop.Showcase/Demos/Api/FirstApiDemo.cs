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
        public string Hello()
        {
            return "Hello World!";
        }

        public string Error()
        {
            throw new DextopErrorMessageException("This is an error message.");
        }

        public string Info()
        {
            throw new DextopInfoMessageException("This is an info message");
        }
    }
}