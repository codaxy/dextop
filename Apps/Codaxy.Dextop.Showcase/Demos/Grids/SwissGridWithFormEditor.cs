using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Forms;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("SwissGridWithFormEditor",
        Title = "Swiss Army Grid + Form Editor",
        Description = "Use specialized form for editing grid records.",
        Path = "~/Demos/Grids"
    )]
    [LevelAdvanced]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
    public class SwissGridWithFormEditorWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
			var crud = new Crud();
			crud.Create(new[] { new GridModel { 
				Name = "Player 1", 
				Age = 30, 
				Basketball = true, 
				Football = true, 
				Gender = Gender.Male, 
				Height = 180, 
				Weight = 100
			}, new GridModel { 
				Name = "Player 2", 
				Age = 29, 
				Basketball = true, 
				Football = true, 
				Gender = Gender.Male, 
				Height = 175, 
				Weight = 90
			} });
            Remote.AddStore("model", crud);
            Remote.AddLookupData("Gender", new[] {
                new object[] { Gender.Male, "Male" },
                new object[] { Gender.Female, "Female" }
            });
        }

        enum Gender { Male, Female };

        [DextopModel]
        [DextopGrid]
		[DextopForm]
        class GridModel
        {
            [DextopModelId]
            [DextopGridColumn(width = 50, readOnly=true)] 			
            public int Id { get; set; }            
			
			[DextopFormField(anchor="0", allowBlank=false)]
            [DextopGridColumn(flex=1)]
            public String Name { get; set; }

			[DextopFormFieldSet(0, title = "Athletics")]
			[DextopFormLookupCombo()]
            [DextopGridLookupColumn()]
            public Gender Gender { get; set; }

			[DextopFormField()]
            [DextopGridColumn(width = 50)]            
            public int Age { get; set; }

			[DextopFormField()] //not in the column model
			public int Weight { get; set; }

			[DextopFormField()]
            [DextopGridColumn(width = 50)]
            public int Height { get; set; }

			[DextopFormFieldSet(0, title = "Sports")]
			[DextopFormCheckboxGroup(1)]
			[DextopFormField(boxLabel = "Basketball")]
			[DextopGridColumn(width=100)]
			public bool Basketball { get; set; }

			[DextopFormField(boxLabel = "Football")]
			[DextopGridColumn(width=100)]
			public bool Football { get; set; }

			[DextopFormField(boxLabel = "Volleyball")]
			public bool Volleyball { get; set; }
        }

        class Crud : DextopDataProxy<GridModel>
        {
            SortedDictionary<int, GridModel> list = new SortedDictionary<int, GridModel>();
            int id = 0;

            public override IList<GridModel> Create(IList<GridModel> data)
            {
                foreach (var row in data)
                {
                    row.Id = ++id;
                    list.Add(row.Id, row);
                }
                return data;
            }

            public override IList<GridModel> Update(IList<GridModel> data)
            {
                foreach (var d in data)
                    list[d.Id] = d;
                return data;
            }

            public override IList<GridModel> Destroy(IList<GridModel> data)
            {
                foreach (var d in data)
                    list.Remove(d.Id);
                return new GridModel[0];
            }

            public override DextopReadResult<GridModel> Read(DextopReadFilter filter)
            {
                return DextopReadResult.Create(list.Values.ToArray());
            }
        }
    }
}