using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("PagingGridWindow",
        Title = "Paging Grid",
        Description = "Grid with paging and remote sorting.",
        Path = "~/Demos/Grids"
    )]
    [LevelMedium]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
    public class PagingGridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.demos.PagingGridWindow";
            Remote.AddStore("model", new Crud());
        }

        class Crud : DextopDataProxy<PagingGridModel>
        {
            List<PagingGridModel> data;

            public Crud()
            {
                var r = new Random();
                data = new List<PagingGridModel>();
                for (var i = 1; i < 100; i++)
                    data.Add(new PagingGridModel
                    {
                        Id = i,
                        Name = "User " + i,
                        Age = r.Next(20, 60),
                        Height = r.Next(160, 200)
                    });
            }

            public override DextopReadResult<PagingGridModel> Read(DextopReadFilter filter)
            {
                return DextopReadResult.CreatePage(data.AsQueryable(), filter);
            }            
        }        

        [DextopModel]
        [DextopGrid]
        class PagingGridModel
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