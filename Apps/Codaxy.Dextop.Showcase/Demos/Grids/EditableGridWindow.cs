using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("EditableGridWindow",
        Title = "Editable Grid",
        Description = "Editable Grid",
        Path = "~/Demos/Grids"
    )]
    [LevelMedium]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
    public class EditableGridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);                      
            Remote.AddStore("model", new Crud());
            Remote.AddLookupData("Gender", new[] {
                new object[] { Gender.Male, "Male" },
                new object[] { Gender.Female, "Female" }
            });
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

        enum Gender { Male, Female };

        [DextopModel]
        [DextopGrid]
        class GridModel
        {
            [DextopModelId]
            [DextopGridColumn(width = 50, readOnly=true)] 
            public int Id { get; set; }
            
            [DextopGridColumn(flex=1)]
            public String Name { get; set; }

            [DextopGridLookupColumn()]
            public Gender Gender { get; set; }
            
            [DextopGridColumn(width = 50)]            
            public int Age { get; set; }

            [DextopGridColumn(width = 50)]
            public int Height { get; set; }
			
			[DextopGridColumn]
			public bool Basketball { get; set; }

			[DextopGridColumn]
			public bool Football { get; set; }
        }
    }
}