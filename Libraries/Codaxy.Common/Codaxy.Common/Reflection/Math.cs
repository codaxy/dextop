using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Linq.Expressions;
using System.ComponentModel;

namespace Common.Reflection
{
    public class Math
    {
        public delegate object BinOp(object a, object b);

        public BinOp Min { get; set; }
        public BinOp Max { get; set; }
        public BinOp Multiply { get; set; }
        public BinOp Sum { get; set; }
        public BinOp MultiplyNullAsOne { get; set; }
        public BinOp SumNullAsZero { get; set; }
        public object Zero { get; set; }
        public object One { get; set; }

        private Math(Type valueType)
        {
            if (!TypeInfo.IsNumericType(valueType))
                throw new Exception("Numeric type is required for math!");

            Min = MathExpressionHelper.GetMinDelegate<BinOp>(valueType, typeof(object));
            Max = MathExpressionHelper.GetMaxDelegate<BinOp>(valueType, typeof(object));

            Sum = MathExpressionHelper.GetSumDelegate<BinOp>(valueType, typeof(object));
            Multiply = MathExpressionHelper.GetMultiplyDelegate<BinOp>(valueType, typeof(object));            

            if (TypeInfo.IsNullableType(valueType))
            {
                var nc = new NullableConverter(valueType);
                Zero = nc.ConvertFrom(Convert.ChangeType(0, Nullable.GetUnderlyingType(valueType)));
                One = nc.ConvertFrom(Convert.ChangeType(1, Nullable.GetUnderlyingType(valueType)));
                SumNullAsZero = MathExpressionHelper.GetSumIsNullDelegate<BinOp>(valueType, typeof(object), Zero);
                MultiplyNullAsOne = MathExpressionHelper.GetMultiplyIsNullDelegate<BinOp>(valueType, typeof(object), One);
            }
            else
            {
                Zero = Convert.ChangeType(0, valueType);
                One = Convert.ChangeType(1, valueType);
                SumNullAsZero = Sum;
                MultiplyNullAsOne = Multiply;
            }            
        }

        static Dictionary<Type, Math> cache = new Dictionary<Type, Math>();

        public static Math Create(Type valueType)
        {
            Math m;
            if (cache.TryGetValue(valueType, out m))
                return m;
            return cache[valueType] = new Math(valueType);
        }
    }
}
