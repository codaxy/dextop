using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Diagnostics;

namespace Codaxy.Dextop.Util
{
    public class LongPollingQueue<T>
    {
        Queue<T> data;
        int notifyPending;

        public LongPollingQueue()
        {
            data = new Queue<T>();
        }

        public void Add(IEnumerable<T> a)
        {
            lock (data)
            {
                foreach (var item in a)
                    data.Enqueue(item);
            }

            if (0==Interlocked.Exchange(ref notifyPending, 1))            
            {
                if (!ThreadPool.QueueUserWorkItem(Notify))
                    Notify(null);
            }
        }

        void Notify(object state)
        {
            Result[] activeResults;
            lock (results)
            {
                activeResults = results.ToArray();
                results.Clear();
            }

            notifyPending = 0;

            if (activeResults.Length > 0)
            {
                var data = TakeAll();
                if (data.Count > 0)
                {
                    foreach (var r in activeResults)
                        r.SetCompleted(data, false, true);
                }
            }
        }

        List<Result> results = new List<Result>();

        public IAsyncResult BeginTake(int timeoutMiliseconds, AsyncCallback callback, object state)
        {
            var result = new Result
            {
                Callback = callback,
                AsyncState = state
            };
            var data = TakeAll();
            if (data.Count > 0)
                result.SetCompleted(data, true, true);
            else
            {
                lock (results)
                {
                    results.Add(result);
                }
                result.StartTimeoutTimer(timeoutMiliseconds);
            }
            return result;
        }

        public IList<T> EndTake(IAsyncResult asyncResult)
        {            
            var r = asyncResult as Result;
            if (r==null)
                return new T[0];

            using (r)
            {
                lock (r)
                {
                    if (!r.IsCompleted)
                        r.SetCompleted(TakeAll(), true, false);
                    return r.Data;
                }
            }
        }

        public IList<T> TakeAll()
        {
            lock (data)
            {
                var res = data.ToArray();
                data.Clear();
                return res;
            }
        }

        class Result : IAsyncResult, IDisposable
        {
            public IList<T> Data { get; set; }
            Timer Timer { get; set; }

            public void StartTimeoutTimer(int milliseconds)
            {
                Timer = new Timer(OnTimeout, null, milliseconds, Timeout.Infinite);
            }

            public object AsyncState
            {
                get;
                set;
            }

            ManualResetEvent waitHandle;
            public System.Threading.WaitHandle AsyncWaitHandle
            {
                get { lock (this) { return waitHandle ?? (waitHandle = new ManualResetEvent(IsCompleted)); } }
            }

            public bool CompletedSynchronously
            {
                get;
                set;
            }

            public bool IsCompleted
            {
                get;
                set;
            }

            public AsyncCallback Callback { get; set; }

            internal void SetCompleted(IList<T> data, bool sync, bool callback)
            {
                DisposeTimer();
                bool notify = false;
                lock (this)
                {
                    if (!IsCompleted)
                    {
                        Data = data;
                        IsCompleted = true;
                        CompletedSynchronously = sync;
                        notify = callback;
                        if (waitHandle != null)
                            waitHandle.Set();
                    }
                }
                if (notify)
                    DoCallback();
            }

            void DoCallback()
            {
                if (Callback != null)
                    Callback(this);
            }

            void OnTimeout(object state)
            {
                DisposeTimer();

                if (waitHandle != null)
                    waitHandle.Set();

                if (!IsCompleted)
                    DoCallback();
            }

            void DisposeTimer()
            {
                if (Timer != null)
                {
                    Timer.Dispose();
                    Timer = null;
                }
            }

            public void Dispose()
            {
                DisposeTimer();
                if (waitHandle != null)
                {
                    waitHandle.Dispose();
                    waitHandle = null;
                }
            }
        }
    }
}
