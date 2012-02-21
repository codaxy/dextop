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
            [DextopFormCheckbox(boxLabel = "Item 1", hideEmptyLabel = true)]
			public bool Checkbox1 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 2", hideEmptyLabel = true)]
			public bool Checkbox2 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 3", hideEmptyLabel = true)]
			public bool Checkbox3 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "3 Columns", columns=3)]
            [DextopFormCheckbox(boxLabel = "Item 1", hideEmptyLabel = true)]
			public bool C1 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 2", hideEmptyLabel = true)]
			public bool C2 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 3", hideEmptyLabel = true)]
			public bool C3 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 4", hideEmptyLabel = true)]
			public bool C4 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 5", hideEmptyLabel = true)]
			public bool C5 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "Vertical", columns = 3, vertical=true)]
            [DextopFormCheckbox(boxLabel = "Item 1", hideEmptyLabel = true)]
			public bool V1 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 2", hideEmptyLabel = true)]
			public bool V2 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 3", hideEmptyLabel = true)]
			public bool V3 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 4", hideEmptyLabel = true)]
			public bool V4 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 5", hideEmptyLabel = true)]
			public bool V5 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "Custom Width", columnWidths = new [] {0.25, 0.5, 0.25}, vertical = true)]
            [DextopFormCheckbox(boxLabel = "Item 1", hideEmptyLabel = true)]
			public bool W1 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 2", hideEmptyLabel = true)]
			public bool W2 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 3", hideEmptyLabel = true)]
			public bool W3 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 4", hideEmptyLabel = true)]
			public bool W4 { get; set; }

            [DextopFormCheckbox(boxLabel = "Item 5", hideEmptyLabel = true)]
			public bool W5 { get; set; }

			[DextopFormCheckboxGroup(0, fieldLabel = "Pixel Widths", columnWidths = new double[] { 50, 100, 200 }, vertical = true)]
			[DextopFormCheckbox(boxLabel = "50 px", hideEmptyLabel=true)]
			public bool CW1 { get; set; }

            [DextopFormCheckbox(boxLabel = "50 px", hideEmptyLabel = true)]
			public bool CW2 { get; set; }

            [DextopFormCheckbox(boxLabel = "100 px", hideEmptyLabel = true)]
			public bool CW3 { get; set; }

            [DextopFormCheckbox(boxLabel = "100 px", hideEmptyLabel = true)]
			public bool CW4 { get; set; }

            [DextopFormCheckbox(boxLabel = "200 px", hideEmptyLabel = true)]
			public bool CW5 { get; set; }
		}
	}
}