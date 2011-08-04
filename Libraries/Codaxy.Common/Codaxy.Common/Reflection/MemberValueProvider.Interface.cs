using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common.Reflection
{
    interface IMemberValueProvider
    {
        object GetValue(object target);
        void SetValue(object target, object value);
    }


}
