using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Diagnostics;
using Codaxy.Common.Queue;

namespace Codaxy.Common.Logging
{
    public abstract class TextLogAppender : ILogAppender
    {
        public TextLogAppender()
        {
			messageQueue = new Codaxy.Common.Queue.AsyncQueue<LogEntry>();
			messageQueue.NewItems += new EventHandler<ItemsEventArgs<LogEntry>>(messageQueue_NewItems);			
        }        
        
		AsyncQueue<LogEntry> messageQueue;       

		public interface IWriterHandle : IDisposable
		{
			TextWriter Writer { get; }
		}

        protected abstract IWriterHandle GetWriterHandle();

		void messageQueue_NewItems(object sender, ItemsEventArgs<LogEntry> e)
        {
            try
            {
				using (var wh = GetWriterHandle())
				{
					var writer = wh.Writer;

					foreach (var le in e.Items)
					{
						writer.WriteLine(String.Format("{0} {1:-10} {2}: {3}", le.Message.Time, le.Message.Level.ToString(), le.LoggerName, le.Message.Message));
						if (le.Message.StackTrace != null)
						{
							writer.Write("\t\t\t");
							writer.WriteLine(le.Message.StackTrace);
						}
					}
					writer.Flush();
				}
            }
            catch
            {

            }
        }		

        public void Log(LogEntry entry)
        {
			messageQueue.Add(entry);
        }
    }

    

    
}
