using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using Codaxy.Common.IO;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Class for manipulation of uploaded files.
	/// </summary>
    public class DextopFile
    {
        byte[] fileContent;

		/// <summary>
		/// Gets the content of the file. Calling this property will cause the stream to be read to the end.
		/// </summary>		
        public byte[] FileContent { get { return fileContent ?? (fileContent = FileStream.ReadToEnd()); } }
		
		/// <summary>
		/// Gets or sets the file stream.
		/// </summary>		
        public Stream FileStream { get; set; }

		/// <summary>
		/// Gets or sets the name of the file.
		/// </summary>		
		public String FileName { get; set; }

		/// <summary>
		/// Gets or sets the file extension.
		/// </summary>		
		public String FileExtension { get; set; }

		/// <summary>
		/// Gets or sets the type of the content.
		/// </summary>		
		public String ContentType { get; set; }

		/// <summary>
		/// Gets or sets the length of the file.
		/// </summary>		
        public int FileLength { get; set; }
    }
}
