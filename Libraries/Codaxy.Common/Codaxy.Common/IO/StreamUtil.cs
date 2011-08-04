using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Codaxy.Common.IO
{
    public static class StreamUtil
    {
        public static  void Copy(Stream input, Stream output)
        {
            byte[] buffer = new byte[32768];
            int read;
            while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                output.Write(buffer, 0, read);
        }

        public static void CopyFromFile(this Stream output, String inputFilePath)
        {
            using (var fs = File.Open(inputFilePath, FileMode.Open))
                Copy(fs, output);
        }

        public static void CopyTo(this Stream input, Stream output)
        {
            Copy(input, output);
        }

        public static void CopyFrom(this Stream output, Stream input)
        {
            Copy(input, output);
        }

        public static byte[] ReadToEnd(this Stream input)
        {
            using (var ms = new MemoryStream())
            {
                Copy(input, ms);
                return ms.ToArray();
            }
        }
    }
}
