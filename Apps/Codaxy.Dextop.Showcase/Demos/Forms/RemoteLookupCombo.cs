using System;
using System.Linq;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
    [Demo("RemoteLookupCombo",
        Title = "Remote Lookup",
        Description = "Basic remote lookup field",
        Path="~/Demos/Forms"
    )]
    [LevelMedium]
    [TopicDextopForms]
    [CategoryDemo]
	public class RemoteLookupCombo : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);

			Remote.AddStore("RemoteLookup", RemoteLookup);

            config["data"] = new Form
            {
                RemoteLookup2 = "Blue",
                RemoteLookup = "Red",
                RemoteLookupDescription = "Code Red"
            };
        }

		RemoteLookupModel[] RemoteLookup(DextopReadFilter filter)
		{
			String query = filter.Params.SafeGet<String>("query");

			var data = new [] { 
				new RemoteLookupModel { Code = "Red", Description = "Code Red"},
				new RemoteLookupModel { Code = "Blue", Description = "Code Blue"},
				new RemoteLookupModel { Code = "Green", Description = "Code Green"},
			};

			if (String.IsNullOrWhiteSpace(query))
				return data;

			return data.Where(a => a.Code.StartsWith(query) || a.Description.Contains(query)).ToArray();
		}

		[DextopModel]
		class RemoteLookupModel
		{
			[DextopModelId]
			public String Code { get; set; }
			public String Description { get; set; }
		}

		[DextopRemotable]
		void Send(Form form)
		{

		}

		[DextopForm]
		class Form
		{
			[DextopFormRemoteLookupCombo("Code", "Description", initialLookupValueField = "RemoteLookupDescription", disableKeyFilter=false, forceSelection=true, hideTrigger=true)]
			public string RemoteLookup { get; set; }

			public string RemoteLookupDescription { get; set; }

            [DextopFormRemoteLookupCombo("Code", "Description", disableKeyFilter = true, lookupId = "RemoteLookup", forceSelection=false)]
            public string RemoteLookup2 { get; set; }
		}
    }
}