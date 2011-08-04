using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
	[Demo("PageSizeComboBox",
        Title = "Page Size Combo",
        Description = "Simple way to chagne page size.",
        Path = "~/Demos/Grids"
    )]
    [LevelMedium]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
    public class PageSizeComboBoxWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);            
            Remote.AddStore("model", new Crud());
        }

        class Crud : DextopDataProxy<Model>
        {
            List<Model> data;

            public Crud()
            {
                var r = new Random();
                data = new List<Model>();
                for (var i = 1; i < 100; i++)
                    data.Add(new Model
                    {
                        Id = i,
                        Name = "User " + i,
                        Age = r.Next(20, 60),
                        Height = r.Next(160, 200)
                    });
            }

            public override DextopReadResult<Model> Read(DextopReadFilter filter)
            {
                return DextopReadResult.CreatePage(data.AsQueryable(), filter);
            }            
        }        

        [DextopModel]
        [DextopGrid]
        class Model
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