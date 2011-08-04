using System;
using System.Linq;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
	[Demo("AllFormFieldsWindow",
        Title = "Form Fields",
        Description = "Explore various form field types, supported by Dextop.",
        Path="~/Demos/Forms"
    )]
    [LevelMedium]
    [TopicDextopForms]
    [CategoryDemo]
	public class AllFormFieldsWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);

			Remote.AddLookupData("Lookup", new[] {
				new object[] { "1", "Item 1" },
				new object[] { "2", "Item 2" },
			});

			Remote.AddStore("RemoteLookup", RemoteLookup);

			config["data"] = new Form
			{
				Date = DateTime.Today,
				Time = DateTime.Now.TimeOfDay,
				Checkbox = true,
				Text = "Some text",
				TextArea = "Some multiline\r\ntext",
				Lookup = "2",
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
			// Tab 1 (FieldSet)
			[DextopFormTabPanelAttribute(0, border = false)]
			[DextopFormContainer(1, title = "Standard Fields", bodyStyle = "padding: 5px;")]
			[DextopFormField(anchor = "0")]
			public String Text { get; set; }

			[DextopFormTextArea(fieldLabel = "Text Area", grow = true, anchor = "0")]
			public String TextArea { get; set; }

			[DextopFormDateField()]
			public DateTime? Date { get; set; }

			[DextopFormTimeField()]
			public TimeSpan? Time { get; set; }

			[DextopFormNumberField(step = 2, minValue = -10, maxValue = 10)]
			public double? Number { get; set; }

			[DextopFormCheckbox(boxLabel = "Checkbox")]
			public bool Checkbox { get; set; }

			[DextopFormContainer(1, title = "Lookup Fields", bodyStyle = "padding: 5px;")]
			[DextopFormLookupCombo]
			public string Lookup { get; set; }			

			[DextopFormRemoteLookupCombo("Code", "Description", valueNotFoundField = "RemoteLookupDescription", disableKeyFilter=true)]
			public string RemoteLookup { get; set; }

			public string RemoteLookupDescription { get; set; }
		}
    }
}