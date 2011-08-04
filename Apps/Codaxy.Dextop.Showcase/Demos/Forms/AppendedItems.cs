using System;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
    [Demo("AppendedItems",
        Title = "Appended Items Form",
        Description = "Learn how to generate complex forms by appending items on the client side.",
        Path="~/Demos/Forms"
    )]
    [LevelAdvanced]
    [TopicDextopForms]
    [CategoryDemo]
    public class AppendedItemsWindow : DextopWindow
    {
        [DextopForm]
        class ComplexForm
        {
            [DextopFormContainer(border = false, layout = "hbox", AppendItems = new[] { "LocateButton" }, anchor="0")]
            [DextopFormField(fieldLabel = "Map Position", flex = 1)]
            public String MapPosition { get; set; }
        }

		[DextopRemotable]
		void Send(ComplexForm form)
		{

		}
    }
}