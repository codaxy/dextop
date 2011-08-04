using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace Codaxy.Common.Benchmarking
{
    public class BenchmarkStopwatch : IDisposable
    {
        String name;
        Stopwatch watch;
        TimeSpan elapsed;
        int n;

		public BenchmarkResults Results { get; set; }		        

        public BenchmarkStopwatch(String name = "", int repeats = 1)
        {
            this.name = name;
            elapsed = new TimeSpan(0);
            n = repeats;
            watch = Stopwatch.StartNew();
        }

        internal void ReportPhaseCompleted(String phaseName)
        {
            watch.Stop();
            var total = watch.Elapsed;
			if (Results != null)
				Results.Report(name + ":" + phaseName, total - elapsed, n);
            elapsed = total;
            watch.Start();
        }

		public void Dispose()
		{
			watch.Stop();
			if (Results != null && name!=null)
				Results.Report(name, watch.Elapsed, n);
		}

        public TimeSpan Elapsed { get { return watch.Elapsed; } }
    }
}
