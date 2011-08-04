using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace Codaxy.Common.Timers
{
	/// <summary>
	/// Non re-entrant timer implementation.
	/// </summary>
    public class SingleEntryTimer : TimeoutTimer
    {
        int period;

        public SingleEntryTimer(TimerCallback callback, object state, int dueTime, int period) : base(callback, state, dueTime)
        {            
            this.period = period;            
        }
        protected override void Callback(object state)
        {
            try
            {
                base.Callback(state);
            }
            finally
            {
                Reset(period);
            }
        }        
    }
}
