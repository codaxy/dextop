using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaTest;
using System.Threading;
using System.Diagnostics;

namespace Codaxy.Dextop.Tests.Tests
{   
    [TestFixture]
    class LongPollingQueueTests
    {
        [Test]
        public void TakeWorks()
        {
            var q = new Util.LongPollingQueue<int>();
            q.Add(new[] { 1 });
            var ar = q.BeginTake(5000, null, null);
            var data = q.EndTake(ar);
            Assert.AreEqual(1, data.Count);
        }

        [Test]
        public void TimerWorks()
        {
            var q = new Util.LongPollingQueue<int>();
            DateTime start = DateTime.Now;                        
            var secs = 1.0;
            var ar = q.BeginTake((int)(secs * 1000), null, null);
            ar.AsyncWaitHandle.WaitOne();            
            var data = q.EndTake(ar);
            DateTime end = DateTime.Now;
            Assert.AreEqual(0, data.Count);
            Assert.IsTrue((end - start).TotalSeconds > secs - 0.5);
            Assert.IsTrue((end - start).TotalSeconds < secs + 0.5);
        }

        [Test]
        public void ThreadCountIsLowTest()
        {
            var queues = new List<Util.LongPollingQueue<int>>();            

            AsyncCallback callback = (ar) =>
            {
                var index = (int)ar.AsyncState;
                var data = queues[index].EndTake(ar);
            };

            var initialThreadCount = Process.GetCurrentProcess().Threads.Count;

            for (var i = 0; i < 10000; i++)
            {
                var q = new Util.LongPollingQueue<int>();
                queues.Add(q);
                var ar = q.BeginTake(1000, callback, i);
            }
            var threadCount = Process.GetCurrentProcess().Threads.Count;
            Assert.IsTrue(threadCount - initialThreadCount < 5);                        
        }

        [Test(Active=false)]
        public void DelayTest()
        {
            var q = new Util.LongPollingQueue<DateTime>();            

            int N = 100;

            ThreadPool.QueueUserWorkItem((s)=> {
                for (var i = 0; i<N; i++) {
                    q.Add(new [] { DateTime.Now });
                    Thread.Sleep(10);
                }                
            });

            int beginEndDiff = 0;

            List<TimeSpan> diff = new List<TimeSpan>();
            AsyncCallback callback = (ar) =>
            {                
                var data = q.EndTake(ar);
                Interlocked.Decrement(ref beginEndDiff);
                var now = DateTime.Now;
                foreach (var item in data)
                    diff.Add(now - item);
                if (diff.Count < N)
                {
                    var readAction = (Action)ar.AsyncState;
                    readAction();
                }
            };

            Action read = null;
            read = () =>
            {
                q.BeginTake(1000, callback, read);
                Interlocked.Increment(ref beginEndDiff);
            };

            read();

            while (diff.Count < N)
                Thread.Sleep(100);

            Assert.AreEqual(N, diff.Count);
            Assert.AreEqual(beginEndDiff, 0);
            var avgDelay = diff.Average(a => a.TotalMilliseconds);

            Assert.IsTrue(avgDelay < 10);
        }
    }
}
