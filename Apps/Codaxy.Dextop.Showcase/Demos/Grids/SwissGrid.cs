using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("SwissGrid",
        Title = "Swiss Army Grid",
        Description = "Grid panel with predefined plugins",
        Path = "~/Demos/Grids"
    )]
    [LevelAdvanced]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
    public class SwissGridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
			var crud = new Crud();
			crud.Create(new[] { new GridModel { Name = "Player", Age = 30, Basketball = true, Football = true, Gender = Gender.Male, Height = 180 } });
            Remote.AddStore("model", crud);
            Remote.AddLookupData("Gender", new[] {
                new object[] { Gender.Male, "Male" },
                new object[] { Gender.Female, "Female" }
            });
        }

        enum Gender { Male, Female };

        [DextopModel]
        [DextopGrid]
        class GridModel
        {
            [DextopGridColumn(width = 50, readOnly = true)]
            public int Id { get; set; }
            
            [DextopGridColumn(flex=1, tooltipTpl="{Name}")]
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
                return DextopReadResult.CreatePage(list.Values.AsQueryable(), filter);
            }
        }
    }
}