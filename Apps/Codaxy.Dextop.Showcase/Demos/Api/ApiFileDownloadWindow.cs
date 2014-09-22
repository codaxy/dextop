using Codaxy.Dextop.Api;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase.Demos.Api
{
    [Demo("ApiFileDownloadWindow",
        Title = "File Download API",
        Description = "Downloading files using Dextop API.",
        ClientLauncher = true,
        Path = "~/Demos/Api"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
    [CategoryDemo]
    [DextopApiControllerAlias("file-download-window")]
    public class ApiFileDownloadWindowController : DextopApiController
    {

        protected override void OnProcessAjaxRequest(HttpContext context)
        {
            context.Response.ForceFileDownload("hello.txt");
            context.Response.Output.Write(string.Format("Hello {0} !", context.Request.QueryString["name"]));
        }

    }
}