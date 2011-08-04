using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Codaxy.Common.Reflection
{
    class DynamicMemberValueProvider : IMemberValueProvider
    {
        private readonly MemberInfo memberInfo;
        private Func<object, object> getter;
        private Action<object, object> setter;


        public DynamicMemberValueProvider(MemberInfo memberInfo)
        {
            this.memberInfo = memberInfo;
        }


        public void SetValue(object target, object value)
        {
            if (setter == null)
                setter = LateBoundDelegateFactory.CreateSet<object>(memberInfo);
            setter(target, value);

        }

        public object GetValue(object target)
        {            
            if (getter == null)
                getter = LateBoundDelegateFactory.CreateGet<object>(memberInfo);

            return getter(target);
        }
    }
}
