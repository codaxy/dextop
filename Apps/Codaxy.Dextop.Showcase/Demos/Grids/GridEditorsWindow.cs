using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("GridEditorsWindow",
        Title = "Grid Editors",
        Description = "All types of grid editors at one place.",
        Path = "~/Demos/Grids"
    )]
    [LevelMedium]
    [TopicDextopGrid]
    [CategoryCodeSnippet]
	public class GridEditorsWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
			Remote.RemoteHostType = "Showcase.demos.GridEditorsWindow";
            Remote.AddStore("model", new Crud());
			Remote.AddLookupData("Lookup", new[] {
                new object[] { Lookup.L1, "Item 1" },
                new object[] { Lookup.L2, "Item 2" },
				new object[] { Lookup.L3, "Item 3" },
            });
			Remote.AddStore("RemoteLookup", RemoteLookup);

			if (remoteData == null)
				remoteData = new List<RemoteLookupModel>
				{
					new RemoteLookupModel { Code = "USA", Description = "United States of America" },
					new RemoteLookupModel { Code = "BIH", Description = "Bosnia and Herzegowina" },
					new RemoteLookupModel { Code = "CRO", Description = "Croatia" },
					new RemoteLookupModel { Code = "SRB", Description = "Serbia" },
					new RemoteLookupModel { Code = "CHN", Description = "China" }
				};
        }

		static List<RemoteLookupModel> remoteData;

		IEnumerable<RemoteLookupModel> RemoteLookup(DextopReadFilter filter)
		{
			String query;
			if (!filter.Params.TryGet<String>("query", out query) || String.IsNullOrEmpty(query))
				return remoteData;

			return remoteData.Where(a => a.Code.StartsWith(query, StringComparison.InvariantCultureIgnoreCase) || a.Description.Contains(query));
		}

        enum Lookup { L1, L2, L3 };

		[DextopModel]
		class RemoteLookupModel
		{
			[DextopModelId]
			public String Code { get; set; }
			public String Description { get; set; }
		}

        [DextopModel]
        [DextopGrid]
        class GridEditorsModel
        {
			[DextopModelId]
			public int Id { get; set; }

            [DextopGridColumn(flex=1)]
            public String Text { get; set; }

			[DextopGridColumn(width = 50)]
			public int Integer { get; set; }

			[DextopGridColumn]
			[DextopModelDefaultValue(true)]
			public bool Check { get; set; }

			[DextopGridColumn]
			public DateTime? Date { get; set; }

			[DextopGridColumn]
			public TimeSpan? Time { get; set; }

            [DextopGridLookupColumn(tooltipTpl="{Text}")]
			public Lookup Lookup { get; set; }

			[DextopGridRemoteLookupColumn("Code", "Description", 
				valueNotFoundDataIndex = "RemoteLookupDescription", 
				width=150, 
				listItemTpl = "<div>{Description} ({Code})</div>"
			)]
			public String RemoteLookup { get; set; }

			[DextopGridRemoteLookupColumn("Code", "Code",
				lookupId = "RemoteLookup",
				width = 100,
				listItemTpl = "<div>{Code} - {Description}</div>",
				listWidth = 300
			)]
			public String RemoteLookupCode { get; set; }

			public String RemoteLookupDescription { get; set; }			
        }

		class Crud : DextopDataProxy<GridEditorsModel>
		{
			SortedDictionary<int, GridEditorsModel> list = new SortedDictionary<int, GridEditorsModel>();
			int id = 0;

			public override IList<GridEditorsModel> Create(IList<GridEditorsModel> data)
			{
				foreach (var row in data)
				{
					row.Id = ++id;
					row.RemoteLookupDescription = String.IsNullOrEmpty(row.RemoteLookup) ? null : remoteData.Single(a => a.Code == row.RemoteLookup).Description;
					list.Add(row.Id, row);
				}
				return data;
			}

			public override IList<GridEditorsModel> Update(IList<GridEditorsModel> data)
			{
				foreach (var row in data)
				{
					list[row.Id] = row;
					row.RemoteLookupDescription = String.IsNullOrEmpty(row.RemoteLookup) ? null : remoteData.Single(a => a.Code == row.RemoteLookup).Description;
				}
				return data;
			}

			public override IList<GridEditorsModel> Destroy(IList<GridEditorsModel> data)
			{
				foreach (var d in data)
					list.Remove(d.Id);
				return new GridEditorsModel[0];
			}

			public override DextopReadResult<GridEditorsModel> Read(DextopReadFilter filter)
			{
				return DextopReadResult.Create(list.Values.ToArray());
			}
		}
    }
}