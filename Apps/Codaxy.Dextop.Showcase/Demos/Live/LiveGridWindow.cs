using System;
using System.Collections.Generic;
using System.Threading;
using Codaxy.Dextop.Data;
using System.Diagnostics;


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
        Random r;

        public LiveGridWindow()
        {
            store = new DextopObservableStore<string, LiveGridModel>(a => a.Ticker);
            r = new Random();
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
                var changes = new List<LiveGridModel>();
                var n = r.Next(100) + 1;
                for (var i = 0; i < n; i++)
                {
                    changes.Add(new LiveGridModel
                    {
                        Ticker = "Ticker " + r.Next(200),
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
            Remote.AddLookupData("Type", new [] {
                new object[] { Type.Security, "Security"},
                new object[] { Type.Bond, "Bond"},
            });
        }

        public enum Type { Security, Bond }

        [DextopModel]
        [DextopGrid]
        class LiveGridModel
        {
            [DextopModelId]
            [DextopGridColumn(flex=1)]
            public String Ticker { get; set; }
            
            [DextopGridColumn(width = 100)]            
            public double Price { get; set; }

            [DextopGridLookupColumn()]
            public Type Type { get; set; }

            
        }
    }
}