using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common
{
    public static class NullableMath
    {
        public static decimal? Abs(decimal? value)
        {
            return value.HasValue ? Math.Abs(value.Value) : value;
        }

        public static decimal? Round(decimal? value, int decimals, MidpointRounding rounding)
        {
            return value.HasValue ? Math.Round(value.Value, decimals, rounding) : value;
        }

        public static decimal? Round(decimal? value, int decimals)
        {
            return value.HasValue ? Math.Round(value.Value, decimals) : value;
        }
    }
}
