using System;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
	[Demo("CheckboxGroups",
		Title = "Checkbox Groups",
		Description = "Explore various options of using checkbox groups.",
		Path = "~/Demos/Forms"
	)]
	[LevelAdvanced]
	[TopicDextopForms]
	[CategoryDemo]
	public class CheckboxGroupsWindow : DextopWindow
	{
		[DextopRemotable]
		void Send(Form form)
		{
			
		}

		[DextopForm]
		class Form
		{
			[DextopFormCheckboxGroup(0, fieldLabel="One Check Required", allowBlank=false)]
			[DextopFormCheckbox(boxLabel = "Item 1")]
			public bool Checkbox1 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 2")]
			public bool Checkbox2 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 3")]
			public bool Checkbox3 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "3 Columns", columns=3)]
			[DextopFormCheckbox(boxLabel = "Item 1")]
			public bool C1 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 2")]
			public bool C2 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 3")]
			public bool C3 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 4")]
			public bool C4 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 5")]
			public bool C5 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "Vertical", columns = 3, vertical=true)]
			[DextopFormCheckbox(boxLabel = "Item 1")]
			public bool V1 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 2")]
			public bool V2 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 3")]
			public bool V3 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 4")]
			public bool V4 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 5")]
			public bool V5 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "Custom Width", columnWidths = new [] {0.25, 0.5, 0.25}, vertical = true)]
			[DextopFormCheckbox(boxLabel = "Item 1")]
			public bool W1 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 2")]
			public bool W2 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 3")]
			public bool W3 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 4")]
			public bool W4 { get; set; }

			[DextopFormCheckbox(boxLabel = "Item 5")]
			public bool W5 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "Pixel Widths", columnWidths = new double[] { 50, 100, 200 }, vertical = true)]
			[DextopFormCheckbox(boxLabel = "50 px")]
			public bool CW1 { get; set; }

			[DextopFormCheckbox(boxLabel = "50 px")]
			public bool CW2 { get; set; }

			[DextopFormCheckbox(boxLabel = "100 px")]
			public bool CW3 { get; set; }

			[DextopFormCheckbox(boxLabel = "100 px")]
			public bool CW4 { get; set; }

			[DextopFormCheckbox(boxLabel = "200 px")]
			public bool CW5 { get; set; }
		}
	}
}