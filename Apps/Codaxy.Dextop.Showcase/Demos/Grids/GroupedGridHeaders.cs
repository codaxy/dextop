using System;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("GroupedGridHeaders",
        Title = "Grouped Grid Headers",
        Description = "Dextop supports generation of grouped grid headers.",
        Path = "~/Demos/Grids"
    )]
    [LevelAdvanced]
    [TopicDextopGrid]
    [CategoryFeature]
    public class GroupedGridHeadersWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.demos.GroupedGridHeadersWindow";
            Remote.AddStore<MarketDepth>("model", new Crud());
        }

        class Crud : DextopDataProxy<MarketDepth>
        {
            public override DextopReadResult<MarketDepth> Read(DextopReadFilter filter)
            {
                return DextopReadResult.Create(new MarketDepth[0]);
            }            
        }        

        [DextopModel]
        [DextopGrid]
        class MarketDepth
        {
            [DextopModelId]
            public int Id { get; set; }

            [DextopGridColumn(Group=1, text="Bid")]
			[DextopGridColumn(width = 100, text = "Volume")]
            public String BidVolume { get; set; }

			[DextopGridColumn(width = 100, text = "Price")]
            public String BidPrice { get; set; }

			[DextopGridColumn(Group = 1, text = "Ask")]
			[DextopGridColumn(width = 100, text = "Volume")]
            public String AskVolume { get; set; }

			[DextopGridColumn(width = 100, text = "Price")]
            public String AskPrice { get; set; }
        }
    }
}