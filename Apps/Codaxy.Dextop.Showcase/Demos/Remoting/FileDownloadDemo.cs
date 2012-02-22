using System;
using Codaxy.Dextop.Remoting;
using System.Linq;
using System.Web;
using System.Threading;

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
            if (context.Request.QueryString["long"] == "1")
            {
                context.Response.ForceFileDownload("Long.txt");
                DateTime start = DateTime.Now;
                while ((DateTime.Now - start).TotalSeconds < 60)
                {
                    context.Response.Output.WriteLine("Download of this file should last 60 seconds. Each line is added after one second pause. ");
                    context.Response.Output.Flush();
                    context.Response.Flush();
                    Thread.Sleep(1000);
                }
            }
            else
            {
                context.Response.ForceFileDownload("Hello.txt");
                context.Response.Output.Write("Hello, this file has been downloaded using an iframe injection technique.");
            }
        }
    }
}