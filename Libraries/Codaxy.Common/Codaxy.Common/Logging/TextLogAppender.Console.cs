using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Codaxy.Common.Logging
{
	public class ConsoleLogAppender : TextLogAppender
	{
		class ConsoleWriterHandle : IWriterHandle
		{
			public TextWriter Writer
			{
				get { return Console.Out; }
			}

			public void Dispose()
			{

			}
		}

		protected override IWriterHandle GetWriterHandle()
		{
			return new ConsoleWriterHandle();
		}
	}    
}
