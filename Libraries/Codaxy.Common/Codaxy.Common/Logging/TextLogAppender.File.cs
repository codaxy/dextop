using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Codaxy.Common.Logging
{
	public class TextFileLogAppender : TextLogAppender
	{
		String path;

		public TextFileLogAppender(String path)
		{
			this.path = path;
		}

		public TextFileLogAppender(String path, bool clear)
		{
			this.path = path;
			if (clear && File.Exists(path))
				System.IO.File.Delete(path);
		}

		protected override IWriterHandle GetWriterHandle()
		{
			return new FileWriterHandle(path);
		}

		class FileWriterHandle : IWriterHandle
		{
			StreamWriter writer;

			public FileWriterHandle(String path)
			{
				writer = new StreamWriter(path, true);
			}

			public TextWriter Writer
			{
				get { return writer; }
			}

			public void Dispose()
			{
				writer.Dispose();
			}
		}
	}
}
