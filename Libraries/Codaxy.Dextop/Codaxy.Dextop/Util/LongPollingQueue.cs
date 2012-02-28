using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Diagnostics;

namespace Codaxy.Dextop.Util
{
    /// <summary>
    /// A queue which supports async take all method with timeout support.
    /// Timers are used to keep the thread count low.    
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class LongPollingQueue<T>
    {
        Queue<T> data;
        int notifyPending;
        
        /// <summary>
        /// Constructor.
        /// </summary>
        public LongPollingQueue()
        {
            data = new Queue<T>();
        }

        /// <summary>
        /// Add items to the queue.
        /// </summary>
        /// <param name="a"></param>
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

        /// <summary>
        /// Starts an asynchronous opperation of taking the pending items.
        /// </summary>
        /// <param name="timeoutMiliseconds"></param>
        /// <param name="callback"></param>
        /// <param name="state"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Completes the asynchronous opperation of taking pending items.
        /// </summary>
        /// <param name="asyncResult"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Removes all items from the list.
        /// </summary>
        /// <returns></returns>
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
