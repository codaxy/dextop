using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("RowEditableGridWindow",
        Title = "Row Editable Grid",
        Description = "Row Editable Grid",
        Path = "~/Demos/Grids"
    )]
    [LevelMedium]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
    public class RowEditableGridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);          
            Remote.RemoteHostType = "Showcase.demos.RowEditableGridWindow";
            Remote.AddStore("model", new Crud());
        }

        class Crud : DextopDataProxy<RowEditableGridModel>
        {
            SortedDictionary<int, RowEditableGridModel> records = new SortedDictionary<int, RowEditableGridModel>();
            int id = 0;

            public override IList<RowEditableGridModel> Create(IList<RowEditableGridModel> data)
            {
                foreach (var rec in data)
                {
					if (rec.Name == "Neo")
						throw new DextopErrorMessageException("Internal error.");
                    rec.Id = ++id;
                    records.Add(rec.Id, rec);
                }
                return data;
            }

            public override IList<RowEditableGridModel> Update(IList<RowEditableGridModel> data)
            {
				foreach (var rec in data)
				{
					if (rec.Name == "Neo")
						throw new DextopErrorMessageException("Internal error.");
					records[rec.Id] = rec;
				}
                return data;
            }

            public override IList<RowEditableGridModel> Destroy(IList<RowEditableGridModel> data)
            {
				foreach (var rec in data)
				{
					if (rec.Name == "Delete")
						throw new DextopErrorMessageException("Internal error.");
					records.Remove(rec.Id);
				}
                return new RowEditableGridModel[0];
            }

            public override DextopReadResult<RowEditableGridModel> Read(DextopReadFilter filter)
            {
                return DextopReadResult.Create(records.Values.ToArray());                
            }            
        }        

        [DextopModel]
        [DextopGrid]
        class RowEditableGridModel
        {
            [DextopModelId]
            [DextopGridColumn(width = 50, readOnly=true)] 
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