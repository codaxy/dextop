using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("FastPagingGridWindow",
        Title = "Fast Paging Grid",
        Description = "Grid with N+1 paging and remote sorting.",
        Path = "~/Demos/Grids"
    )]
    [LevelAdvanced]
    [TopicDextopGrid]
    [CategoryFeature]
    public class FastPagingGridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);            
            Remote.AddStore("model", new Crud());
        }

        class Crud : DextopDataProxy<GridModel>
        {
            List<GridModel> data;

            public Crud()
            {
                var r = new Random();
                data = new List<GridModel>();
                for (var i = 1; i < 100; i++)
                    data.Add(new GridModel
                    {
                        Id = i,
                        Name = "User " + i,
                        Age = r.Next(20, 60),
                        Height = r.Next(160, 200)
                    });
            }

            public override DextopReadResult<GridModel> Read(DextopReadFilter filter)
            {
                return DextopReadResult.CreatePage(data.AsQueryable(), filter, true);
            }            
        }        

        [DextopModel]
        [DextopGrid]
        class GridModel
        {
            [DextopModelId]
            public int Id { get; set; }
            
            [DextopGridColumn(flex=1)]
            public String Name { get; set; }
            
            [DextopGridColumn(width = 50)]            
            public int Age { get; set; }

            [DextopGridColumn(width = 50)]
            public int Height { get; set; }
        }
    }
}