using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.IO;

namespace Codaxy.Common.Logging
{
    public enum LogLevel
    {
        Trace, Debug, Info, Warning, Error
    }

    public class LogMessage
    {
        public DateTime Time { get; internal set; }
        public LogLevel Level { get; set; }
        public String Message { get; set; }
        public String StackTrace { get; set; }
    }

    public class LogEntry
    {
        public String LoggerName { get; set; }
        public LogMessage Message { get; set; }
    }
   

	public class LogEntryEventArgs : EventArgs
	{
		public LogEntry LogEntry { get; set; }
	}

    public class Logger
    {		
		ILogAppender LogAppender { get; set; }
		
		public Logger(ILogAppender appender, String name)
		{			
			Enabled = true;
			LogAppender = appender;
			LogName = name;			
		}
        
		public String LogName { get; private set; }

		internal Logger CreateLogger(String childLogName)
		{
		    return new Logger(LogAppender, LogName + "/" + childLogName);            
		}
		
		public Boolean Enabled { get; set; }

		public event EventHandler<LogEntryEventArgs> OnLogEntry;

		internal void Log(LogMessage lm)
		{
			if (!Enabled)
				return;

			if (lm.Time == default(DateTime))
				lm.Time = DateTime.Now;

			var le = new LogEntry
			{
				Message = lm,
				LoggerName = LogName
			};		

			LogEntry(le);

			if (OnLogEntry != null)
				OnLogEntry(this, new LogEntryEventArgs { LogEntry = le });
		}

		internal void LogFormat(LogLevel level, String format, params object[] args)
		{
			try
			{
				Log(new LogMessage
				{
					Level = level,
					Message = String.Format(format, args)
				});
			}
			catch
			{
				Log(new LogMessage
				{
					Level = LogLevel.Error,
					Message = String.Format("Log entry '{0}' formatting failed.", format)
				});
			}
		}

		protected virtual void LogEntry(LogEntry le)
		{
			LogAppender.Log(le);
		}
    }

	public static class LoggerExtensions
	{
		public static void LogMessage(this Logger logger, LogMessage lm)
		{
			if (logger != null)
				logger.Log(lm);
		}

		public static void Trace(this Logger logger, string message)
		{
			if (logger != null)
				logger.Log(new LogMessage { Message = message, Level = LogLevel.Trace });
		}

		public static void Info(this Logger logger, string message)
		{
			if (logger != null)
				logger.Log(new LogMessage { Message = message, Level = LogLevel.Info });
		}

		[Conditional("DEBUG")]
		public static void Debug(this Logger logger, string message)
		{
			if (logger != null)
				logger.Log(new LogMessage { Message = message, Level = LogLevel.Debug });
		}

		public static void Warning(this Logger logger, string message)
		{
			if (logger != null)
				logger.Log(new LogMessage { Message = message, Level = LogLevel.Warning });
		}

		public static void Error(this Logger logger, string message)
		{
			if (logger != null)
				logger.Log(new LogMessage { Message = message, Level = LogLevel.Error });
		}

		public static void Error(this Logger logger, string message, String stackTrace)
		{
			if (logger != null)
				logger.Log(new LogMessage { Message = message, Level = LogLevel.Error, StackTrace = stackTrace });
		}

		public static void TraceFormat(this Logger logger, string format, params object[] par)
		{
			if (logger != null)
				logger.LogFormat(LogLevel.Trace, format, par);
		}

		public static void WarningFormat(this Logger logger, string format, params object[] par)
		{
			if (logger != null)
				logger.LogFormat(LogLevel.Warning, format, par);
		}

		public static void InfoFormat(this Logger logger, string format, params object[] par)
		{
			if (logger != null)
				logger.LogFormat(LogLevel.Info, format, par);
		}

		[Conditional("DEBUG")]
		public static void DebugFormat(this Logger logger, string format, params object[] par)
		{
			if (logger != null)
				logger.LogFormat(LogLevel.Debug, format, par);
		}

		public static void ErrorFormat(this Logger logger, string format, params object[] par)
		{
			if (logger != null)
				logger.LogFormat(LogLevel.Error, format, par);
		}

		public static void Exception(this Logger logger, Exception ex)
		{
			if (logger != null)
				logger.Log(new LogMessage { Message = ex.Message, StackTrace = ex.StackTrace, Level = LogLevel.Error });
		}

		public static void Exception(this Logger logger, String message, Exception ex)
		{
			if (logger != null)
				logger.Log(GetExceptionMessage(message, ex));
		}

		public static LogMessage GetExceptionMessage(String message, Exception ex)
		{
			StringBuilder stackTrace = new StringBuilder();
			var cex = ex;
			int nest = 5;
			while (cex != null && --nest >= 0)
			{
				stackTrace.AppendLine(ex.StackTrace);
				cex = ex.InnerException != ex ? ex.InnerException : null;
			}
			return new LogMessage { Message = message + " (" + ex.Message + ")", StackTrace = stackTrace.ToString(), Level = LogLevel.Error };
		}

		public static Logger ChildLogger(this Logger logger, String childLoggerName)
		{
			if (logger != null)
				return logger.CreateLogger(childLoggerName);
			return null;
		}
	}
}
