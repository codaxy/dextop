using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace Codaxy.Common.Logging
{
    class DebugLogAppender : ILogAppender
    {
        public void Log(LogEntry le)
        {
            Debug.WriteLine(String.Format("{0} {1:-10} {2}: {3}", le.Message.Time, le.Message.Level.ToString(), le.LoggerName, le.Message.Message));
            if (le.Message.StackTrace != null)
            {
                Debug.Write("\t\t\t");
                Debug.WriteLine(le.Message.StackTrace);
            }
        }
    }
}
