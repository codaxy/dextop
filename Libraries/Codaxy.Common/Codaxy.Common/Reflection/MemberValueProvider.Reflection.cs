using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Codaxy.Common.Reflection
{
    class ReflectionMemberValueProvider : IMemberValueProvider
    {
        MemberInfo memberInfo;
        public ReflectionMemberValueProvider(MemberInfo info)
        {
            memberInfo = info;
        }

        #region IMemberValueProvider Members

        public object GetValue(object target)
        {
            switch (memberInfo.MemberType)
            {
                case MemberTypes.Property:
                    return ((PropertyInfo)memberInfo).GetValue(target, null);
                case MemberTypes.Field:
                    return ((FieldInfo)memberInfo).GetValue(target);
                default:
                    throw new NotSupportedException();
            }
        }

        public void SetValue(object target, object value)
        {
            switch (memberInfo.MemberType)
            {
                case MemberTypes.Property:
                    ((PropertyInfo)memberInfo).SetValue(target, value, null);
                    break;
                case MemberTypes.Field:
                    ((FieldInfo)memberInfo).SetValue(target, value);
                    break;
                default:
                    throw new NotSupportedException();
            }
        }

        #endregion
    }
}
