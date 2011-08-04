using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace Codaxy.Common.Timers
{
    public class TimeoutTimer : IDisposable
    {
        Timer timer;
        TimerCallback callback;        

        public TimeoutTimer(TimerCallback callback, object state, int timeout = Timeout.Infinite)
        {
            this.callback = callback;
            timer = new Timer(Callback, state, timeout, Timeout.Infinite);
        }

        protected virtual void Callback(object state)
        {
            callback.Invoke(state);            
        }

        public void Reset(int timeout)
        {
            if (timer != null)
                timer.Change(timeout, Timeout.Infinite);
        }

        public void Dispose()
        {
            if (timer != null)
            {
                timer.Dispose();
                timer = null;
            }
        }
    }
    
}
