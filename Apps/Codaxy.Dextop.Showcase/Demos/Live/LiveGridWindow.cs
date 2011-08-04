using System;
using System.Collections.Generic;
using System.Threading;
using Codaxy.Dextop.Data;


namespace Codaxy.Dextop.Showcase.Demos.Live
{
    [Demo("LiveGridWindow",
        Title = "Live Grid",
        Description = "Grid with live data.",
        Path = "~/Demos/Live"
    )]
    [LevelMedium]
    [TopicDextopLive]
    [CategoryCodeSnippet]
    public class LiveGridWindow : DextopWindow
    {
        DextopObservableStore<string, LiveGridModel> store;
        Timer timer;

        public LiveGridWindow()
        {
            store = new DextopObservableStore<string, LiveGridModel>(a => a.Ticker);
#if DEBUG
            timer = new Timer(OnTimer, null, 100, 300);            
#else
            timer = new Timer(OnTimer, null, 100, 2000);            
#endif
        }

        void OnTimer(object state)
        {
            try
            {
                var r = new Random();
                var changes = new List<LiveGridModel>();
                for (var i = 0; i < r.Next(5); i++)
                {
                    changes.Add(new LiveGridModel
                    {
                        Ticker = "Ticker " + r.Next(10),
                        Price = Math.Round(r.NextDouble() * 1000, 2)
                    });
                }
                store.SetMany(changes);
            }
            catch { }
        }

        public override void Dispose()
        {
            if (timer != null)
            {
                timer.Dispose();
                timer = null;
            }
            base.Dispose();
        }

        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);          
            Remote.RemoteHostType = "Showcase.demos.LiveGridWindow";
            Remote.AddLiveStore("model", store);
        }

        [DextopModel]
        [DextopGrid]
        class LiveGridModel
        {
            [DextopModelId]
            [DextopGridColumn(flex=1)]
            public String Ticker { get; set; }
            
            [DextopGridColumn(width = 100)]            
            public double Price { get; set; }
        }
    }
}