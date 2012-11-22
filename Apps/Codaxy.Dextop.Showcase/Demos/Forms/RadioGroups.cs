using System;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
	[Demo("RadioGroups",
		Title = "Radio Groups",
		Description = "Explore various options of using radio groups.",
		Path = "~/Demos/Forms"
	)]
	[LevelAdvanced]
	[TopicDextopForms]
	[CategoryDemo]
	public class RadioGroupsWindow : DextopWindow
	{
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            config["data"] = new Form
            {
                R1 = "B",
                R2 = 0,
                R3 = 2,
                R4 = 3,
                R5 = 1
            };
        }

		[DextopRemotable]
		void Send(Form form)
		{
            throw new DextopInfoMessageException(DextopUtil.Encode(form));
		}

		[DextopForm]
		class Form
		{
			[DextopFormRadioGroup(0, fieldLabel="String")]
			[DextopFormRadio(boxLabels = new[] { "Item 1", "Item 2", "Item 3" }, inputValues = new object[] { "A", "B", "C" })]
			public String R1 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "3 Columns", columns=3)]
			[DextopFormRadio(boxLabels = new[] { "Item 1", "Item 2", "Item 3", "Item 4", "Item 5" })]
			public int? R2 { get; set; }			

			[DextopFormCheckboxGroup(0, fieldLabel = "Vertical", columns = 3, vertical=true)]
			[DextopFormRadio(boxLabels = new[] { "Item 1", "Item 2", "Item 3", "Item 4", "Item 5" })]
			public int? R3 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "Percent Width", columnWidths = new [] {0.25, 0.5, 0.25})]
			[DextopFormRadio(boxLabels = new[] { "Item 1", "Item 2", "Item 3", "Item 4", "Item 5" })]
			public int? R4 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "Pixel Width", columnWidths = new double[] { 75, 150, 200 })]
			[DextopFormRadio(boxLabels = new[] { "Item 1", "Item 2", "Item 3", "Item 4", "Item 5" })]
			public int? R5 { get; set; }
		}
	}
}