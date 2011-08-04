using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace Codaxy.Common.Benchmarking
{
    public class BenchmarkResult {

        public String Name { get; set; }        
        public TimeSpan? MinTime { get; set; }
        public TimeSpan? MaxTime { get; set; }
        public TimeSpan? LastTime { get; set; }
        public TimeSpan TotalTime { get; set; }
        public int Counter { get; set; }
       
        public TimeSpan? AvgTime { get { return Counter > 0 ? new TimeSpan(TotalTime.Ticks / Counter) : (TimeSpan?)null; } }


        internal void Accumulate(TimeSpan span, int count)
        {
            if (Counter == 0)
            {
                MinTime = span;
                MaxTime = span;
                TotalTime = span;
                Counter = count;
            }
            else
            {
                if (span < MinTime)
                    MinTime = span;
                if (span > MaxTime)
                    MaxTime = span;
                TotalTime += span;
                Counter += count;
            }
            LastTime = span;
        }

        public override string ToString()
        {
            return String.Format("{0}\t{1}ms", Name, AvgTime.HasValue ? AvgTime.Value.TotalMilliseconds : (double?)null);
        }
    }   

    public class BenchmarkResults
    {
        Dictionary<String, BenchmarkResult> data = new Dictionary<string, BenchmarkResult>();

        public void Reset()
        {
            lock (data)
            {
                data.Clear();
            }
        }

		public BenchmarkResult[] GetResults() { lock (data) { return data.Values.ToArray(); } }

        public void Report(String benchmarkName, TimeSpan span)
        {
            Report(benchmarkName, span, 1);
        }

        public void Report(String benchmarkName, TimeSpan span, int count)
        {
			lock (data)
			{
				Acquire(benchmarkName).Accumulate(span, count);
			}
        }

		BenchmarkResult Acquire(String name)
		{
			BenchmarkResult res;
			if (data.TryGetValue(name, out res))
				return res;
			return data[name] = new BenchmarkResult { Name = name };			
		}

		public BenchmarkStopwatch CreateStopwatch(String name, int repeats = 1)
		{
			return new BenchmarkStopwatch(name, repeats) { Results = this };
		}
    }
}
