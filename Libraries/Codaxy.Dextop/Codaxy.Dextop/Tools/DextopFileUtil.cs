using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Globalization;

namespace Codaxy.Dextop.Tools
{
	/// <summary>
	/// Set of useful file utilites.
	/// </summary>
    public class DextopFileUtil
    {

		/// <summary>
		/// Concates the files with given paths.
		/// </summary>
		/// <param name="filePaths">List of file paths.</param>
		/// <returns>Concatenated content of the files.</returns>
        public static String ConcateFiles(IEnumerable<String> filePaths)
        {
            var sb = new StringBuilder();
            foreach (var file in filePaths)
                sb.AppendLine(File.ReadAllText(file));
            return sb.ToString();
        }

		/// <summary>
		/// Calculates the cache buster by observing the last write time property of the specified files.
		/// </summary>
		/// <param name="filePath">List of file paths.</param>
		/// <returns>The cache buster value.</returns>
        public static int CalculateCacheBuster(params String[] filePath)
        {
            return CalculateCacheBuster((IEnumerable<String>)filePath);
        }

		/// <summary>
		/// Calculates the cache buster by observing the last write time property of the specified files.
		/// </summary>
		/// <param name="filePaths">List of file paths.</param>
		/// <returns>The cache buster value.</returns>
        public static int CalculateCacheBuster(IEnumerable<String> filePaths)
        {
            int cacheBuster = 0;
            foreach (var file in filePaths)
                cacheBuster ^= File.GetLastWriteTime(file).GetHashCode();
            return Math.Abs(cacheBuster);
        }

		/// <summary>
		/// Minifies the JS.
		/// </summary>
		/// <param name="js">The js.</param>
		/// <param name="obfuscate">if set to <c>true</c> [obfuscate].</param>
		/// <returns></returns>
        public static String MinifyJs(String js, bool obfuscate)
        {
            if (String.IsNullOrWhiteSpace(js))
                return js;
            return Yahoo.Yui.Compressor.JavaScriptCompressor.Compress(js, true, obfuscate, true, true, 80, Encoding.UTF8, CultureInfo.InvariantCulture);
        }

		/// <summary>
		/// Minifies the CSS.
		/// </summary>
		/// <param name="css">The CSS.</param>
		/// <returns></returns>
        public static String MinifyCss(String css)
        {
            if (String.IsNullOrWhiteSpace(css))
                return css;
            return Yahoo.Yui.Compressor.CssCompressor.Compress(css);
        }

		/// <summary>
		/// Writes the text file.
		/// </summary>
		/// <param name="filePath">The file path.</param>
		/// <param name="fileContent">Content of the file.</param>
        public static void WriteTextFile(String filePath, String fileContent)
        {
            File.WriteAllText(filePath, fileContent, Encoding.UTF8);
        }
    }
}
