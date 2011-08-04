using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using System.Threading;
using Codaxy.Common.Logging;

namespace Codaxy.Common.Queue
{
    public class ItemsEventArgs<T> : EventArgs
    {
        public T[] Items { get; private set; }
        public ItemsEventArgs(T[] items)
        {
            Items = items;
        }
    }

    public class AsyncQueue<T>
    {
        public event EventHandler<ItemsEventArgs<T>> NewItems;
        private Queue<T> queue;
        private ReaderWriterLockSlim rwLock;

        public Logger Logger { get; set; }

        public AsyncQueue()
        {
            queue = new Queue<T>();
            rwLock = new ReaderWriterLockSlim();
        }

        public AsyncQueue(IEnumerable<T> items)
        {
            queue = new Queue<T>(items);
            rwLock = new ReaderWriterLockSlim();
        }

        public void AddRange(IEnumerable<T> items)
        {
            rwLock.EnterWriteLock();
            try
            {
                foreach (var item in items)
                    queue.Enqueue(item);
            }
            finally
            {
                rwLock.ExitWriteLock();
                this.ResetTimer();
            }
        }

        public int Count { get { return queue.Count; } }

        public void Add(T item)
        {
            rwLock.EnterWriteLock();
            try
            {
                queue.Enqueue(item);
            }
            finally
            {
                rwLock.ExitWriteLock();
                this.ResetTimer();
            }
        }

        private void ResetTimer()
        {
            ThreadPool.QueueUserWorkItem(TimerCallback);
        }

        private void TimerCallback(object state)
        {
            Flush();
        }

        public bool IsIdle { get { return queue.Count == 0 && !running; } }

        bool running = false;
        public void Flush()
        {
            if (!running)
                ProcessQueue();
        }

        // Waits for all the processing to complete. Use with care!
        public void FlushSync()
        {
            if (!running)
                ProcessQueue();
            else
                while (running)
                    Thread.Sleep(10);
        }

        private void ProcessQueue()
        {
            running = true;
            try
            {
                while (running)
                {
                    T[] items;
                    rwLock.EnterUpgradeableReadLock();
                    try
                    {
                        if (queue.Count == 0)
                            break;

                        rwLock.EnterWriteLock();
                        try
                        {
                            items = queue.ToArray();
                            queue.Clear();
                        }
                        finally
                        {
                            rwLock.ExitWriteLock();
                        }
                    }
                    finally
                    {
                        rwLock.ExitUpgradeableReadLock();
                    }

                    if (NewItems != null)
                        try
                        {
                            NewItems(this, new ItemsEventArgs<T>(items));
                        }
                        catch (Exception ex)
                        {
                            Logger.Exception(ex);
                        }
                }
            }
            finally
            {
                running = false;
            }
        }        
    }
}
