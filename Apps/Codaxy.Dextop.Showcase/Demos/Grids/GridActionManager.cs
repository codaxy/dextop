using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
	[Demo("GridActionManager",
		Title = "Grid Action Manager",
        Description = "This plugin enables/disables grid actions based on selection and adds context menu to the grid.",
        Path = "~/Demos/Grids"
    )]
    [LevelMedium]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
    public class GridActionsWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);			
            Remote.AddStore("model", new Crud());
        }

        class Crud : DextopDataProxy<GridActionModel>
        {
            SortedDictionary<int, GridActionModel> list = new SortedDictionary<int, GridActionModel>();
            int id = 0;

            public override IList<GridActionModel> Create(IList<GridActionModel> data)
            {
                foreach (var row in data)
                {
                    row.Id = ++id;
                    list.Add(row.Id, row);
                }
                return data;
            }

            public override IList<GridActionModel> Update(IList<GridActionModel> data)
            {
                foreach (var d in data)
                    list[d.Id] = d;
                return data;
            }

            public override IList<GridActionModel> Destroy(IList<GridActionModel> data)
            {
                foreach (var d in data)
                    list.Remove(d.Id);
                return new GridActionModel[0];
            }

            public override DextopReadResult<GridActionModel> Read(DextopReadFilter filter)
            {
                return DextopReadResult.Create(list.Values.ToArray());                
            }            
        }        

        [DextopModel]
        [DextopGrid]
        class GridActionModel
        {
            [DextopModelId]
            [DextopGridColumn(width = 50, readOnly=true)] 
            public int Id { get; set; }
            
            [DextopGridColumn(flex=1)]
            public String Name { get; set; }
            
            [DextopGridColumn(width = 50, text="Admin")]            
            public bool IsAdministrator { get; set; }
        }
    }
}