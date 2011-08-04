using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Linq.Expressions;

namespace Common.Reflection
{
    public class MathExpressionHelper
    {
        public static BinOp GetSumDelegate<BinOp>(Type valueType) { return GetSumDelegate<BinOp>(valueType, valueType); }        
        public static BinOp GetSumIsNullDelegate<BinOp>(Type valueType, object isNullValue) { return GetSumIsNullDelegate<BinOp>(valueType, isNullValue); }
        public static BinOp GetMinDelegate<BinOp>(Type valueType) { return GetMinDelegate<BinOp>(valueType, valueType); }
        public static BinOp GetMaxDelegate<BinOp>(Type valueType) { return GetMaxDelegate<BinOp>(valueType, valueType); }
        public static BinOp GetMultiplyDelegate<BinOp>(Type valueType) { return GetMultiplyDelegate<BinOp>(valueType, valueType); }
        public static BinOp GetMultiplyIsNullDelegate<BinOp>(Type valueType, object isNullValue) { return GetMultiplyIsNullDelegate<BinOp>(valueType, isNullValue); }

        public static BinOp GetSumDelegate<BinOp>(Type valueType, Type declaredType)
        {
            ParameterExpression a = Expression.Parameter(declaredType, "a");
            ParameterExpression b = Expression.Parameter(declaredType, "b");

            var ca = Convert(a, declaredType, valueType);
            var cb = Convert(b, declaredType, valueType);

            Expression<BinOp> expression =
                Expression<BinOp>.Lambda<BinOp>(
                    Convert(Expression.Add(ca, cb), valueType, declaredType),
                    new ParameterExpression[] { a, b }
                );

            return expression.Compile();
        }

        public static BinOp GetSumIsNullDelegate<BinOp>(Type valueType, Type declaredType, object isNullValue)
        {
            var def = Expression.Constant(isNullValue);
            ParameterExpression a = Expression.Parameter(declaredType, "a");
            ParameterExpression b = Expression.Parameter(declaredType, "b");
            var ca = Convert(a, declaredType, valueType);
            var cb = Convert(b, declaredType, valueType);

            Expression<BinOp> expression =
                Expression<BinOp>.Lambda<BinOp>(
                    Convert(Expression.Convert(Expression.Add(Expression.Coalesce(ca, def), Expression.Coalesce(cb, def)), valueType), valueType, declaredType),
                    new ParameterExpression[] { a, b }
                );

            return expression.Compile();
        }

              

        public static BinOp GetMinDelegate<BinOp>(Type valueType, Type declaredType)
        {
            ParameterExpression a = Expression.Parameter(declaredType, "a");
            ParameterExpression b = Expression.Parameter(declaredType, "b");

            var ca = Convert(a, declaredType, valueType);
            var cb = Convert(b, declaredType, valueType);

            Expression<BinOp> expression =
                Expression<BinOp>.Lambda<BinOp>(Convert(
                    Expression.Condition(
                        Expression.LessThan(ca, cb), ca, cb), valueType, declaredType),
                        new ParameterExpression[] { a, b }
                );

            return expression.Compile();
        }

        public static BinOp GetMaxDelegate<BinOp>(Type valueType, Type declaredType)
        {
            ParameterExpression a = Expression.Parameter(declaredType, "a");
            ParameterExpression b = Expression.Parameter(declaredType, "b");

            var ca = Convert(a, declaredType, valueType);
            var cb = Convert(b, declaredType, valueType);

            Expression<BinOp> expression =
                Expression<BinOp>.Lambda<BinOp>(Convert(
                    Expression.Condition(
                        Expression.LessThan(ca, cb), cb, ca), valueType, declaredType),
                        new ParameterExpression[] { a, b }
                );

            return expression.Compile();
        }

        public static BinOp GetMultiplyDelegate<BinOp>(Type valueType, Type declaredType)
        {
            ParameterExpression a = Expression.Parameter(declaredType, "a");
            ParameterExpression b = Expression.Parameter(declaredType, "b");

            var ca = Convert(a, declaredType, valueType);
            var cb = Convert(b, declaredType, valueType);

            Expression<BinOp> expression =
                Expression<BinOp>.Lambda<BinOp>(
                    Convert(Expression.Multiply(ca, cb), valueType, declaredType),
                    new ParameterExpression[] { a, b }
                );

            return expression.Compile();
        }

        public static BinOp GetMultiplyIsNullDelegate<BinOp>(Type valueType, Type declaredType, object isNullValue)
        {
            var def = Expression.Constant(isNullValue);
            ParameterExpression a = Expression.Parameter(declaredType, "a");
            ParameterExpression b = Expression.Parameter(declaredType, "b");
            var ca = Convert(a, declaredType, valueType);
            var cb = Convert(b, declaredType, valueType);

            Expression<BinOp> expression =
                Expression<BinOp>.Lambda<BinOp>(
                    Convert(Expression.Convert(Expression.Multiply(Expression.Coalesce(ca, def), Expression.Coalesce(cb, def)), valueType), valueType, declaredType),
                    new ParameterExpression[] { a, b }
                );

            return expression.Compile();
        }

        static Expression Convert(Expression e, Type fromType, Type toType)
        {            
            return toType != fromType ? Expression.Convert(e, toType) : e;
        }
    }
}
