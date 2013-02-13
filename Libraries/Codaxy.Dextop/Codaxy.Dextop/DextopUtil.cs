using System;
using System.IO;
using System.Web;
using Newtonsoft.Json;
using System.Globalization;

namespace Codaxy.Dextop
{
    /// <summary>
    /// Dextop utilities for path and Json manipulation.
    /// </summary>
    public static class DextopUtil
    {
        /// <summary>
        /// Maps virtual path to physical path on the disk.
        /// </summary>
        /// <param name="path">Use '~' for root. e.g. ~/images/</param>
        /// <returns>Path on the disk</returns>
        public static String MapPath(String path)
        {
            if (!path.StartsWith("~"))
                path = "~/" + path;
            var slash = Path.DirectorySeparatorChar.ToString();
			var doubleSlash = slash + slash;
            return path.Replace("~", DextopEnvironment.PhysicalAppPath).Replace("/", slash).Replace(doubleSlash, slash);
        }

		/// <summary>
		/// Converts the relative path to the absolute path by prepending the virtual application path.
		/// </summary>
		/// <param name="path">The path.</param>
		/// <returns></returns>
        public static String AbsolutePath(String path)
        {
            if (path == null)
                return DextopEnvironment.VirtualAppPath;
            if (path.StartsWith(DextopEnvironment.VirtualAppPath))
                return path;
            if (path.StartsWith("http", StringComparison.InvariantCultureIgnoreCase))
                return path;
            return CombinePaths(DextopEnvironment.VirtualAppPath, path);
        }

        static Formatting jsonFormatting;
        static JsonSerializer jsonSerializer;

        internal static JsonSerializer JsonSerializer { get { return jsonSerializer; } }

        static DextopUtil()
        {
            jsonSerializer = new JsonSerializer() 
            {
                DefaultValueHandling = DefaultValueHandling.Include,
                NullValueHandling = NullValueHandling.Ignore                
            };

            jsonSerializer.Converters.Add(new TimeSpanConverter());            

			var dateConverter = new DextopDateTimeConverter();
            jsonSerializer.Converters.Add(dateConverter);
			
#if DEBUG
            jsonFormatting = Formatting.Indented;
#else
			jsonFormatting = Formatting.None;
#endif
        }

        /// <summary>
        /// Encodes given object in JSON.
        /// </summary>
        /// <param name="o">Instance to be encoded</param>
        /// <returns>JSON representation of the given object</returns>
        public static String Encode(object o)
        {
            using (var swriter = new StringWriter())
            {
                Encode(o, swriter);                
                return swriter.ToString();
            }
        }

        /// <summary>
        /// Encodes given object in JSON to given output writer.
        /// </summary>
        /// <param name="o">Instance to be encoded</param>
        /// <param name="output">Output</param>
        public static void Encode(object o, TextWriter output)
        {
            using (var jw = new JsonTextWriter(output) { Formatting = jsonFormatting })
                jsonSerializer.Serialize(jw, o);
        }

        /// <summary>
        /// Decode JSON text to object of given type.
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        /// <param name="s">JSON text</param>
        /// <returns>Object of type T</returns>
        public static T Decode<T>(string s) { return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(s); }

        /// <summary>
        /// Decode JSON text to object of given type.
        /// </summary>        
        /// <param name="s">JSON text</param>
		/// <param name="type">Return type</param>
        /// <returns>Object of type T</returns>
        public static object Decode(string s, Type type)
        {
            if (s == null)
                return null;
            using (var sr = new StringReader(s))
                return jsonSerializer.Deserialize(sr, type);
        }

		/// <summary>
		/// Decodes the JSON string to a value of given type.
		/// </summary>
		/// <param name="value">JSON text.</param>
		/// <param name="type">The type.</param>
		/// <returns></returns>
        public static object DecodeValue(String value, Type type)
        {
            if (type == typeof(String))
                return value;

            if (String.IsNullOrEmpty(value))
                return type.IsValueType ? Activator.CreateInstance(type) : null;            
            
            value = value.Trim('"');
			if (type == typeof(DateTime))
				return DecodeDate(value);
			if (type == typeof(DateTime?))
				return (DateTime?)DecodeDate(value);			
			if (type == typeof(TimeSpan))
				return DecodeTime(value);					
			if (type == typeof(TimeSpan?))
				return (TimeSpan?)DecodeTime(value);
            if (type == typeof(Guid))
                return new Guid(value);
            if (type == typeof(Guid?))
                return (Guid?)(new Guid(value));
            if (type.IsValueType)
                return Codaxy.Common.Convert.ChangeTypeInvariant(value, type);
            return DextopUtil.Decode(value, type);
        }
        

		static DateTime DecodeDate(string value)
		{
			return DateTime.Parse(value,  CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal);
		}

		static TimeSpan DecodeTime(string value)
		{
			//TimeSpan ts;
			//if (TimeSpan.TryParse(value, out ts))
			//    return ts;
			return DecodeDate(value).TimeOfDay;
		}

        /// <summary>
        /// Combine virtual path segments.
        /// </summary>
        /// <param name="basePath"></param>
        /// <param name="path"></param>
        /// <returns>Combined path</returns>
        public static string CombinePaths(string basePath, string path)
        {
            return (String.IsNullOrEmpty(basePath) ? "" : (basePath.TrimEnd('/') + "/")) + (String.IsNullOrEmpty(path) ? "" : path.TrimStart('/'));
        }

		internal static string GetRemotingProxyTypeName(String name)
		{
			return name + ".remoting.Proxy";
		}		


        /// <summary>
        /// Add Content-Disposition: attachment header to the HttpResponse.
        /// </summary>
        /// <param name="response"></param>
        /// <param name="filename"></param>
        public static void ForceFileDownload(this HttpResponse response, String filename)
        {
            FileInfo fi = new FileInfo(filename);
            response.ContentType = "application/force-download";
            response.AddHeader("Content-Disposition", "attachment; filename=\"" + fi.Name + "\"");
        }

        /// <summary>
        /// Add Content-Disposition: attachment header to the HttpResponse.
        /// </summary>
        /// <param name="response"></param>
        /// <param name="filename"></param>
        public static void ForceFileDownload(this HttpResponseBase response, String filename)
        {
            FileInfo fi = new FileInfo(filename);
            response.ContentType = "application/force-download";
            response.AddHeader("Content-Disposition", "attachment; filename=\"" + fi.Name + "\"");
        }
	}
}
