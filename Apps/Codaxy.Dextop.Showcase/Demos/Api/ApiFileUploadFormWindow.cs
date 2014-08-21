using Codaxy.Dextop.Api;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase.Demos.Api
{
    [Demo("ApiFileUploadFormWindow",
        Title = "File Upload Form API",
        Description = "Uploading files using Dextop API.",
        ClientLauncher = true,
        Path = "~/Demos/Api"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
    [CategoryDemo]
    [DextopApiControllerAlias("file-upload-form-window")]
    public class ApiFileUploadFormWindowController : DextopApiController
    {
        public string SubmitForm(DextopFormSubmit form)
        {
            var data = form.DecodeForm<Form>();

            if (data.Picture == null)
                throw new DextopErrorMessageException("No file specified.");

            return String.Format("Hi {0}, your picture has been saved.", data.Name);
        }

        [DextopForm]
        class Form
        {
            [DextopFormField(anchor = "0")]
            public String Name { get; set; }

            [DextopFormFileField(buttonText = "Choose Photo...", anchor = "0")]
            public DextopFile Picture { get; set; }
        }
    }
}