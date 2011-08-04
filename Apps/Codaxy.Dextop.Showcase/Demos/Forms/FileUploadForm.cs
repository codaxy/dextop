using System;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Forms;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
    [Demo("FileUploadForm",
        Title = "File Upload Form Field",
        Description = "Uploading files can be tricky.",
        Path = "~/Demos/Forms"
    )]
    [LevelMedium]
    [TopicDextopForms]
    [CategoryCodeSnippet]
    public class FileUploadFormWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config); 
        }

        [DextopRemotable]
        string SubmitForm(DextopFormSubmit form)
        {
            var data = form.DecodeForm<Form>();

            if (data.Picture == null)
                throw new DextopErrorMessageException("No file specified.");

            return String.Format("Hi {0}, your picture has been saved.", data.Name);
        }

        [DextopForm]
        class Form
        {
            [DextopFormField(anchor="0")]
            public String Name { get; set; }

            [DextopFormFileField(buttonText = "Choose Photo...", anchor = "0")]
            public DextopFile Picture { get; set; }
        }
    }
}