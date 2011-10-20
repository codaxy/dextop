using System;
using Codaxy.Dextop.Remoting;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("FileDownloadDemo",
        Title = "File Download",
        Description = "Download file using injected IFRAME",
        Path = "~/Demos/Remoting"
    )]
    [LevelMedium]
    [TopicDextopRemoting]
    [CategoryCodeSnippet]
    public class FileDownloadDemoWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.OnProcessAjaxRequest = DownloadFileHandler;
        }

        void DownloadFileHandler(HttpContext context)
        {
            context.Response.ForceFileDownload("Hello.txt");
            context.Response.Output.Write("Hello, this file has been downloaded using an iframe injection technique.");
        }
    }
}