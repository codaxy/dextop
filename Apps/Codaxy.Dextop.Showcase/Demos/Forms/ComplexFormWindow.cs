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
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            config["data"] = new ComplexForm
            {
                Time = DateTime.Now,
                Number = 2,
                Date = DateTime.Today
            };
        }
        [DextopForm]
        class ComplexForm
        {
            // Tab 1 (FieldSet)
			[DextopFormTabPanel(0, border = false)]
			[DextopFormContainer(1, title = "FieldSet Examples", bodyStyle = "padding: 5px;", border=false)]
			[DextopFormFieldSet(2, title = "Checkbox FieldSet", checkboxToggle = true)]
			[DextopFormField(Dummy = true)] //This field is used by the field set
			public bool Enabled { get; set; }

            [DextopFormField(anchor="0")]
            public String FirstName { get; set; }
            
            [DextopFormField(anchor="0")]
            public String LastName { get; set; }

            [DextopFormFieldSet(2, title = "Collapsible FieldSet", collapsible = true, itemId="fs1")]
            [DextopFormDateField(showToday=false)]
            public DateTime? Date { get; set; }
        
            [DextopFormTimeField( format = "H:i", minValue = "8:00", maxValue = "16:00" )]
            public DateTime Time { get; set; }

            [DextopFormNumberField(step = 2, allowDecimals = true, minValue = 0, maxValue = 10)]
            public double Number { get; set; }

            // Tab 2
			[DextopFormContainer(1, title = "Checkboxes", bodyStyle = "padding: 5px;", border=false, layout="anchor")]
			[DextopFormCheckboxGroup(2, vertical=true, columns=3)]
            [DextopFormCheckbox(boxLabel = "Checkbox 1", hideLabel = true)]
            public bool Checkbox1 { get; set; }

            [DextopFormCheckbox(boxLabel = "Checkbox 2", hideLabel = true)]
			public bool Checkbox2 { get; set; }

            [DextopFormCheckbox(boxLabel = "Checkbox 3", hideLabel = true)]
			public bool Checkbox3 { get; set; }

            [DextopFormCheckbox(boxLabel = "Checkbox 4", hideLabel = true)]
            public bool Checkbox4 { get; set; }

            [DextopFormCheckbox(boxLabel = "Checkbox 5", hideLabel = true)]
            public bool Checkbox5 { get; set; }
        }

		[DextopRemotable]
		void Send(ComplexForm form)
		{

		}
    }
}