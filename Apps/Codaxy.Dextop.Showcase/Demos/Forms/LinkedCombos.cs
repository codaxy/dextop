using System;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Data;
using System.Collections.Generic;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
    [Demo("LinkedCombos",
		Title = "Linked Combos",
		Description = "Combo whose data is filtered based on the form data.",
		Path = "~/Demos/Forms"
	)]
	[LevelMedium]
	[TopicDextopForms]
	[CategoryCodeSnippet]
    public class LinkedCombosWindow : DextopWindow
	{

        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);

            Remote.AddStore("Value2", GetValues2);
            Remote.AddStore("Value3", GetValues3);

        }

        IEnumerable<ComboModel> GetValues2(DextopReadFilter filter)
        {
            var baseValue = filter.Params.SafeGet("Value1", 0);

            for (var i = baseValue+1; i < 10; i++)
                yield return new ComboModel { Id = i };
        }

        IEnumerable<ComboModel> GetValues3(DextopReadFilter filter)
        {
            var baseValue = filter.Params.SafeGet("Value2", 0);

            for (var i = baseValue+1; i < 10; i++)
                yield return new ComboModel { Id = i };
        }

        [DextopModel]
        class ComboModel
        {
            [DextopModelId]
            public int Id { get; set; }
        }

		[DextopForm]
		class Form
		{
			[DextopFormField(allowBlank = false, anchor = "0")]
			public int Value1 { get; set; }

            [DextopFormRemoteFilteredLookupCombo("Id", "Id", anchor = "0", formParams=new[] { "Value1" })]
			public int Value2 { get; set; }

            [DextopFormRemoteFilteredLookupCombo("Id", "Id", anchor = "0", formParams = new[] { "Value2" })]
            public int Value3 { get; set; }
		}
	}
}