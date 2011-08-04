using System;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
    [Demo("ComplexFormWindow",
        Title = "Complex Dextop Form",
        Description = "Learn how to generate complex layouts and form fields using Dextop.",
        Path="~/Demos/Forms"
    )]
    [LevelAdvanced]
    [TopicDextopForms]
    [CategoryDemo]
    public class ComplexFormWindow : DextopWindow
    {
        [DextopForm]
        class ComplexForm
        {
            // Tab 1 (FieldSet)
			[DextopFormTabPanelAttribute(0, border = false)]
			[DextopFormContainer(1, title = "FieldSet Examples", bodyStyle = "padding: 5px;", border=false)]
			[DextopFormFieldSet(2, title = "Checkbox FieldSet", checkboxToggle = true)]
			[DextopFormField(Dummy = true)] //This field is used by the field set
			public bool Enabled { get; set; }

            [DextopFormField]
            public String FirstName { get; set; }
            
            [DextopFormField]
            public String LastName { get; set; }

            [DextopFormFieldSet(2, title = "Collapsible FieldSet", collapsible = true)]
            [DextopFormDateField(showToday=false)]
            public DateTime Birth { get; set; }
        
            [DextopFormTimeField( format = "H:i", minValue = "8:00", maxValue = "16:00" )]
            public DateTime Time { get; set; }

            [DextopFormNumberField(step = 2, allowDecimals = true, minValue = 0, maxValue = 10)]
            public double Number { get; set; }

            // Tab 2
			[DextopFormContainer(1, title = "Checkboxes", bodyStyle = "padding: 5px;", border=false)]
			[DextopFormCheckboxGroup(2, vertical=true, columns=3)]
            [DextopFormCheckbox(boxLabel="Checkbox 1")]
            public bool Checkbox1 { get; set; }

			[DextopFormCheckbox(boxLabel = "Checkbox 2")]
			public bool Checkbox2 { get; set; }

			[DextopFormCheckbox(boxLabel = "Checkbox 3")]
			public bool Checkbox3 { get; set; }
        }

		[DextopRemotable]
		void Send(ComplexForm form)
		{

		}
    }
}