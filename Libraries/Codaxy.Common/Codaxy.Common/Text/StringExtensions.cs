using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common.Text
{
    public static class StringExtensions
    {
        public static String FormatWith(this String format, params object[] p)
        {
            return String.Format(format, p);
        }

        public static String ReplaceNullOrEmptyWith(this String s, String replacement)
        {
            return String.IsNullOrEmpty(s) ? replacement : s;
        }

        public static String AfterLastOf(this String s, char c)
        {
            int index = s.LastIndexOf(c);
            return index == -1 ? s : s.Substring(index + 1);
        }

        public static String AfterLastOfAny(this String s, params char[] c)
        {
            int index = s.LastIndexOfAny(c);
            return index == -1 ? s : s.Substring(index + 1);
        }

        public static bool IsNullOrEmpty(this String s) { return String.IsNullOrEmpty(s); }

        public static bool IsEqualToAnyOf(this String s, params String[] p)
        {
            return p.Contains(s);
        }

        public static bool Contains(this string source, string toCheck, StringComparison comp)
        {
            return source.IndexOf(toCheck, comp) >= 0;
        }

        public static string ToCamelCase(this String source)
        {
            if (string.IsNullOrEmpty(source))
                return source;
            return Char.ToLower(source[0]) + source.Substring(1);
        }

        public static String JoinNonEmpty(String sep, params String[] elements)
        {
            StringBuilder sb = new StringBuilder();
            bool first = true;
            foreach (var p in elements)
                if (!String.IsNullOrEmpty(p))
                {
                    if (first)
                        sb.Append(p);
                    else
                    {
                        sb.Append(sep);
                        sb.Append(p);
                    }
                    first = false;
                }
            return sb.Length == 0 ? null : sb.ToString();
        }

        public static String LeftPart(this String s, int n)
        {
            if (String.IsNullOrEmpty(s))
                return s;

            return s.Substring(0, Math.Min(s.Length, n));
        }

        public static string Replace(this string original, string pattern, string replacement, StringComparison comparisonType)
        {
            if (original == null)
                return null;

            if (String.IsNullOrEmpty(pattern))
                return original;

            int lenPattern = pattern.Length;
            int idxPattern = -1;
            int idxLast = 0;
            StringBuilder result = new StringBuilder();

            while (true)
            {
                idxPattern = original.IndexOf(pattern, idxPattern + 1, comparisonType);
                if (idxPattern < 0)
                {
                    result.Append(original, idxLast, original.Length - idxLast);
                    break;
                }
                result.Append(original, idxLast, idxPattern - idxLast);
                result.Append(replacement);
                idxLast = idxPattern + lenPattern;
            }
            return result.ToString();
        }

        public static string Reverse(this string s)
        {
            char[] arr = s.ToCharArray();
            System.Array.Reverse(arr);
            return new string(arr);
        }

        public static String LeftOf(this string s, char c, bool emptyIfNotFound)
        {
            var index = s.IndexOf(c);
            if (index == -1)
                return emptyIfNotFound ? String.Empty : s;
            return s.Substring(0, index);
        }

        /// <summary>
        /// Split string using given delimiters and keeps delimiters. No empty string are returned.
        /// </summary>
        /// <param name="s">String instance.</param>
        /// <param name="delims">Char delimiters.</param>
        /// <returns>Parts of the string.</returns>
        public static IEnumerable<string> SplitKeep(this string s, params char[] delims)
        {
            int start = 0;
            int index = 0;
            int t;

            while ((index = s.IndexOfAny(delims, start)) != -1)
            {
                t = index;
                index = start;
                start = t;

                if (start > index)
                    yield return s.Substring(index, start - index);
                yield return s.Substring(start, 1);
                start++;
            }
            if (start < s.Length)
                yield return s.Substring(start);
        }

        public static string Enclose(this String s, String left, String right)
        {
            return String.Format("{0}{1}{2}", left, s, right);
        }

        public static string Enclose(this String s, String within)
        {
            return s.Enclose(within, within);
        }

        public static string Enclose(this String s, char within)
        {
            return s.Enclose(within.ToString());
        }

        public static string Quote(this String s)
        {
            return s.Enclose('"');
        }

        public static string QuoteSingle(this String s)
        {
            return s.Enclose("'");
        }

        public static string Indent(this String s, int count)
        {
            return s.PadLeft(s.Length + count);
        }
    }
}
