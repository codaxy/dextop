using System;
using Codaxy.Dextop.Remoting;
using System.Linq;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("FileUploadDemo",
        Title = "File Upload",
        Description = "Uploading files can be tricky.",
        Path = "~/Demos/Remoting"
    )]
    [LevelMedium]
    [TopicDextopRemoting]
    [CategoryCodeSnippet]
    public class FileUploadDemoWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.demos.FileUploadDemoWindow";            
        }

        [DextopRemotable]
        string UploadFile(DextopFormSubmit form)
        {
            if (form.Files.Count == 1)
            {
                var file = form.Files.Values.First();
                return String.Format("You have just uploaded the {1:0,0} bytes long file named '{0}'.", file.FileName, file.FileLength);
            }
            throw new InvalidOperationException("No file recieved!");
        }
    }
}