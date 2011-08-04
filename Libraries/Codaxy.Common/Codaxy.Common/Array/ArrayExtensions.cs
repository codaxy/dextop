using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common.Array
{
    public static class ArrayExtensions
    {
        public static bool IsNullOrEmpty<T>(this T[] a) { return a == null || a.Length == 0; }

        public static T[] NullIfEmpty<T>(this T[] a) { return a.IsNullOrEmpty() ? null : a; } 
    }
}
