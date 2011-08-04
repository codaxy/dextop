using System;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
	[Demo("SharedLookupData",
		Title = "Shared Lookup Data",
		Description = "Dextop provides central lookup repository. ",
		Path = "~/Demos/Forms"
	)]
	[LevelMedium]
	[TopicDextopForms]
	[CategoryFeature]
	public class SharedLookupDataWindow : DextopWindow
	{
		public override void InitRemotable(DextopRemote remote, DextopConfig config)
		{
			base.InitRemotable(remote, config);
			Remote.AddSharedLookupData("OnOff"); //See Session.cs to see how to add lookups
		}

		[DextopForm]
		class Form
		{
			[DextopFormLookupCombo(allowBlank = false, anchor = "0", forceSelection = true, disableKeyFilter=true)]
			public bool OnOff { get; set; }
		}
	}
}