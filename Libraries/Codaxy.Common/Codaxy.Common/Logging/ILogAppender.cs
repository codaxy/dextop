using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common.Logging
{
	public interface ILogAppender
	{
		void Log(LogEntry entry);
	}    
}
