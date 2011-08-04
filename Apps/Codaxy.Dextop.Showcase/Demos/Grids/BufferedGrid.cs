using System;
using Codaxy.Dextop.Data;
using System.Linq;
using System.Collections.Generic;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("BufferedGrid",
        Title = "Buffered Grid",
		Description = "Ext JS 4 brand new grid supports infinite scrolling, which enables you to load any number of records into a grid without paging.",
        Path = "~/Demos/Grids"
    )]
    [LevelAdvanced]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
    public class BufferedGridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
			var rand = new Random();
			data = new List<GridModel>();
			for (var i = 0; i<5000; i++)
				data.Add(new GridModel { Id = i, Name = "Item " + i, Value = rand.Next(1000, 2000) });
			Remote.AddStore("model", Read);
        }

		List<GridModel> data;

		DextopReadResult<GridModel> Read(DextopReadFilter filter)
		{
			return DextopReadResult.CreatePage(data.AsQueryable(), filter);
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
            public int Value { get; set; }            
        }
    }
}