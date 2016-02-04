using System;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("GridWindow",
        Title = "Basic Grid",
        Description = "Dextop helps you with the Grid.",
        Path = "~/Demos/Grids"
    )]
    [LevelBeginner]
    [TopicDextopGrid]
    [CategoryFeature]
    public class GridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
			Remote.AddStore("model", Read);
        }

		GridModel[] Read(DextopReadFilter filter)
		{
			return new[] {
                new GridModel { Id = 1, Name = "Bill", Age = 30, Height=180 },
                new GridModel { Id = 2, Name = "Bob", Age = 26, Height=175 }               
            };
		}       

        [DextopModel]
        [DextopGrid]
        class GridModel
        {
            [DextopModelId]
            public int Id { get; set; } 
            
            [DextopGridColumn(flex=1)]
            public String Name { get; set; }
            
            [DextopGridColumn(width = 70)]            
            public int Age { get; set; }

            [DextopGridColumn(width = 70, text="Height (cm)", tooltip="Height in centimeters", sortable = false)]
            public int Height { get; set; }
        }
    }
}