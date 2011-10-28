using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Globalization;
using System.Diagnostics;
using Microsoft.Ajax.Utilities;

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
			DateTime dummy;
            return CalculateCacheBuster((IEnumerable<String>)filePath, out dummy);
        }

        /// <summary>
        /// Calculates the cache buster by observing the last write time property of the specified files.
        /// </summary>
        /// <param name="filePaths">List of file paths.</param>
        /// <param name="latestFileWriteTime">The latest file write time.</param>
        /// <returns>
        /// The cache buster value.
        /// </returns>
        public static int CalculateCacheBuster(IEnumerable<String> filePaths, out DateTime latestFileWriteTime)
        {
			latestFileWriteTime = DateTime.MinValue;
            int cacheBuster = 0;
			foreach (var file in filePaths)
			{
				var writeTime = File.GetLastWriteTime(file);
				cacheBuster ^= writeTime.GetHashCode();
				if (writeTime > latestFileWriteTime)
					latestFileWriteTime = writeTime;
			}
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
			try
			{
				if (String.IsNullOrWhiteSpace(js))
					return js;
				var min = new Minifier();
				return min.MinifyJavaScript(js);
				//return Yahoo.Yui.Compressor.JavaScriptCompressor.Compress(js, true, obfuscate, true, true, 80, Encoding.UTF8, CultureInfo.InvariantCulture);				
			}
			catch (Exception ex)
			{
				Trace.WriteLine("JS code that could not be minified:"); //Minification is usually done in Release mode where Debug is not available
				Trace.WriteLine(js);
				throw new DextopException("JS minification failed. See inner exception for details.", ex);
			}
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
			var min = new Minifier();
			return min.MinifyStyleSheet(css);
            //return Yahoo.Yui.Compressor.CssCompressor.Compress(css);
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
