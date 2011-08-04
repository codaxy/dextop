using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common.Text
{
    public class StringFormatHelper
    {
        /// <summary>
        /// Converts string format with named parameters to format to use with String.Format. 
        /// e.g. "{Name} {LastName} {Date:d}" => format = "{0} {1} {2:d}" ,paramNames = {"Name", "LastName", "Date"}
        /// 
        /// </summary>
        /// <param name="formatWithNames"></param>
        /// <param name="format"></param>
        /// <param name="paramNames"></param>
        public static void PrepareFormatWithNames(String formatWithNames, out String format, out String[] paramNames)
        {
            if (String.IsNullOrEmpty(formatWithNames))
            {
                format = formatWithNames;
                paramNames = null;
                return;
            }
            StringBuilder sb = new StringBuilder();
            int nameStartInd = -1;
            int param = 0;
            List<String> names = new List<string>();
            for (int i = 0; i < formatWithNames.Length; i++)
            {
                switch (formatWithNames[i])
                {
                    case '{':
                        if (i + 1 < formatWithNames.Length && formatWithNames[i + 1] == '{')
                        {
                            sb.Append("{{");
                            i += 1;
                            break;
                        }
                        else
                        {
                            sb.Append('{');
                            nameStartInd = i + 1;
                        }
                        break;

                    case ':':
                    case '}':
                        if (nameStartInd != -1)
                        {
                            names.Add(formatWithNames.Substring(nameStartInd, i - nameStartInd));
                            nameStartInd = -1;
                            sb.Append(param.ToString());
                            param++;
                        }
                        //else if (i + 1 < formatWithNames.Length && formatWithNames[i + 1] == '}' && formatWithNames[i] == '}')
                        //    i += 1;
                        sb.Append(formatWithNames[i]);
                        break;
                    default:
                        if (nameStartInd == -1)
                            sb.Append(formatWithNames[i]);
                        break;
                }
            }
            format = sb.ToString();
            paramNames = names.Count > 0 ? names.ToArray() : null;
        }
    }

    public delegate object NamedValueGetter(String name);

    public class StringTemplate
    {
        String[] paramNames;
        String format;

        private StringTemplate() { }

        public StringTemplate(String formatWithNames)
        {            
            StringFormatHelper.PrepareFormatWithNames(formatWithNames, out format, out paramNames);
        }

        public String Apply(NamedValueGetter valueGetter)
        {
            if (String.IsNullOrEmpty(format) || paramNames == null)
                return format;
            return String.Format(format, paramNames.Select(a => valueGetter(a)).ToArray());
        }

        public String Apply(IDictionary<String, object> data)
        {
            if (String.IsNullOrEmpty(format) || paramNames == null)
                return format;
            return String.Format(format, paramNames.Select(a => data.ContainsKey(a) ? data[a] : null).ToArray());
        }

        public static String Apply(String formatWithNames, NamedValueGetter valueGetter)
        {
            var tpl = new StringTemplate(formatWithNames);
            return tpl.Apply(valueGetter);
        }

        public static String Apply(String formatWithNames, IDictionary<String, object> data)
        {
            var tpl = new StringTemplate(formatWithNames);
            return tpl.Apply(data);
        }
    }

}
