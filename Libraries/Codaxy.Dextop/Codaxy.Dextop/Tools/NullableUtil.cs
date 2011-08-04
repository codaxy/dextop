using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Tools
{
    class NullableUtil
    {
        public static T? DefaultNull<T>(T value, T defaultValue) where T : struct, IEquatable<T>
        {
            if (value.Equals(defaultValue))
                return null;
            return value;
        }
    }
}
