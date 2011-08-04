using System;
using System.Collections.Generic;
using System.Threading;
using Codaxy.Dextop.Data;


namespace Codaxy.Dextop.Showcase.Demos.Live
{
    [Demo("LiveChartWindow",
        Title = "Live Chart",
        Description = "Chart with live data.",
        Path = "~/Demos/Live"
    )]
    [LevelMedium]
    [TopicDextopLive]
    [CategoryDemo]
    public class LiveChartWindow : DextopWindow
    {
        DextopObservableStore<string, LiveChartModel> store;
        Timer timer;

        public LiveChartWindow()
        {
            store = new DextopObservableStore<string, LiveChartModel>(a => a.CPU);

            for (var i = 0; i < 4; i++)
                store.Set(new LiveChartModel
                {
                    CPU = "CPU " + (i+1),
                    Usage = 0
                });
        }

        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.demos.LiveChartWindow";
            Remote.AddLiveStore("model", store);

#if DEBUG
            timer = new Timer(OnTimer, null, 100, 300);
#else
            timer = new Timer(OnTimer, null, 100, 2000);            
#endif
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

        void OnTimer(object state)
        {
            try
            {
                var r = new Random();
                var changes = new List<LiveChartModel>();
                for (var i = 0; i < 4; i++)
                {
                    changes.Add(new LiveChartModel
                    {
                        CPU = "CPU " + (i+1),
                        Usage = Math.Round(r.NextDouble() * 100, 2)
                    });
                }
                store.SetMany(changes);
            }
            catch { }
        }

        [DextopModel]        
        class LiveChartModel
        {
            [DextopModelId]           
            public String CPU { get; set; }            
            
            public double Usage { get; set; }
        }
    }
}