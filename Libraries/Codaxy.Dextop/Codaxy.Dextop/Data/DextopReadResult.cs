using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Linq.Expressions;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Result of the Read operation.
	/// </summary>
    public class DextopReadResult
    {
		/// <summary>
		/// Gets or sets the rows.
		/// </summary>
        public IList<object> Rows { get; set; }


		/// <summary>
		/// Gets or sets the total number of records matching the filter.
		/// </summary>		
		public int TotalCount { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopReadResult"/> class.
		/// </summary>
        public DextopReadResult()
        {
            Rows = new object[0];
        }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopReadResult"/> class.
		/// </summary>
		/// <param name="rows">The rows.</param>
        public DextopReadResult(IList<object> rows)
        {
            Rows = rows;
            TotalCount = rows.Count;
        }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopReadResult"/> class.
		/// </summary>
		/// <param name="rows">The rows.</param>
		/// <param name="total">The total.</param>
        public DextopReadResult(IList<object> rows, int total)
        {
            Rows = rows;
            TotalCount = total;
        }

		/// <summary>
		/// Create the result using the records specified as method arguments.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="result">The result.</param>
		/// <returns></returns>
        public static DextopReadResult<T> Params<T>(params T[] result) where T : class
        {
            return new DextopReadResult<T>(result);
        }

		/// <summary>
		/// Create the result by joining multiple results.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="source"></param>
		/// <returns></returns>
		public static DextopReadResult<T> Union<T>(params IEnumerable<T>[] source) where T : class
		{
			return Create<T>(source.SelectMany(a => a));
		}

		/// <summary>
		/// Creates the result with specified total number of records.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="result">The result.</param>
		/// <param name="total">The total.</param>
		/// <returns></returns>
        public static DextopReadResult<T> Create<T>(IEnumerable<T> result, int total) where T : class
        {
            return new DextopReadResult<T>(result.ToArray(), total);
        }

		/// <summary>
		/// Creates the result by enumeration the collection.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="result">The result.</param>
		/// <returns></returns>
        public static DextopReadResult<T> Create<T>(IEnumerable<T> result) where T : class
        {
            return new DextopReadResult<T>(result.ToArray());
        }

        static bool IsAscendingDirection(String direction)
        {
            return direction.Length == 0 || (direction[0] != 'D' && direction[0] != 'd');
        }

		static IQueryable<T> ApplySort<T>(IQueryable<T> source, DextopReadFilter filter) where T : class
		{
			if (filter == null)
				return source;

			if (filter.sort != null && filter.sort.Length > 0)
			{
				var sorter = filter.sort[0];
				bool asc = IsAscendingDirection(sorter.direction);
				source = source.OrderBy(sorter.property, asc);
				for (var i = 1; i < filter.sort.Length; i++)
				{
					sorter = filter.sort[i];
					asc = IsAscendingDirection(sorter.direction);
					source = source.ThenBy(sorter.property, asc);
				}				
			}

			return source;
		}

		/// <summary>
		/// Creates the result by sorting end enumerating the specified source.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="source">The source.</param>
		/// <param name="filter">The filter.</param>
		/// <returns></returns>
		public static DextopReadResult<T> Sort<T>(IQueryable<T> source, DextopReadFilter filter) where T : class
		{
			if (filter == null)
				throw new ArgumentNullException("filter");
			source = ApplySort(source, filter);
			return Create(source.ToArray());
		}

		/// <summary>
		/// Creates the paged result by reading the IQueryable source.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="source">The source.</param>
		/// <param name="filter">The filter.</param>
		/// <param name="fastTotal">Indicates that N+1 paging is used.</param>
		/// <returns></returns>
        public static DextopReadResult<T> CreatePage<T>(IQueryable<T> source, DextopReadFilter filter, bool fastTotal = false) where T : class
        {
            if (filter == null)
                throw new ArgumentNullException("filter");

			source = ApplySort(source, filter);

            if (filter.limit.HasValue)
            {
                int limit = filter.GetLimit();
                int start = filter.GetStart();
                if (fastTotal)
                {
                    var data = source.Skip(start).Take(limit + 1).ToArray();
                    return Create(data.Take(limit).ToArray(), start + data.Length);
                }
                else
                    return Create(source.Skip(start).Take(limit).ToArray(), source.Count());
            }
            return Create(source.ToArray());
        }
    }

	/// <summary>
	/// Typed read result.
	/// </summary>
	/// <typeparam name="T"></typeparam>
    public class DextopReadResult<T> : DextopReadResult where T:class
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopReadResult&lt;T&gt;"/> class.
		/// </summary>
        public DextopReadResult() {}

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopReadResult&lt;T&gt;"/> class.
		/// </summary>
		/// <param name="rows">The rows.</param>
        public DextopReadResult(IList<T> rows) : base(rows.ToArray()) { }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopReadResult&lt;T&gt;"/> class.
		/// </summary>
		/// <param name="rows">The rows.</param>
		/// <param name="total">The total.</param>
        public DextopReadResult(IList<T> rows, int total) : base(rows.ToArray(), total) { }
    }

	/// <summary>
	/// Extensions for parametric ordering of queryable sources.
	/// </summary>
    public static class DextopQueryableExtensions
    {
		/// <summary>
		/// Appends OrderBy expresssion for given property.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="source">The source.</param>
		/// <param name="propertyName">Name of the property.</param>
		/// <param name="ascending">if set to <c>true</c> [ascending].</param>
		/// <returns></returns>
        public static IQueryable<T> OrderBy<T>(this IQueryable<T> source, string propertyName, bool ascending)
        {
            var type = typeof(T);
            var property = type.GetProperty(propertyName);
            var parameter = Expression.Parameter(type, "p");
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExp = Expression.Lambda(propertyAccess, parameter);
            MethodCallExpression resultExp = Expression.Call(typeof(Queryable), ascending ? "OrderBy" : "OrderByDescending",
                                new Type[] { type, property.PropertyType },
                                 source.Expression, Expression.Quote(orderByExp));
            return source.Provider.CreateQuery<T>(resultExp);
        }

		/// <summary>
		/// Appends ThenBy expresssion for given property.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="source">The source.</param>
		/// <param name="propertyName">Name of the property.</param>
		/// <param name="ascending">if set to <c>true</c> [ascending].</param>
		/// <returns></returns>
        public static IQueryable<T> ThenBy<T>(this IQueryable<T> source, string propertyName, bool ascending)
        {
            var type = typeof(T);
            var property = type.GetProperty(propertyName);
            var parameter = Expression.Parameter(type, "p");
            var propertyAccess = Expression.MakeMemberAccess(parameter, property);
            var orderByExp = Expression.Lambda(propertyAccess, parameter);
            MethodCallExpression resultExp = Expression.Call(typeof(Queryable), ascending ? "ThenBy" : "ThenByDescending",
                                new Type[] { type, property.PropertyType },
                                 source.Expression, Expression.Quote(orderByExp));
            return source.Provider.CreateQuery<T>(resultExp);
        }

		/// <summary>
		/// Appends OrderBy expresssion for given property.
		/// </summary>
        public static IQueryable<T> OrderBy<T>(this IQueryable<T> source, string propertyName)
        {
            return OrderBy(source, propertyName, true);
        }

		/// <summary>
		/// Appends OrderByDescending expresssion for given property.
		/// </summary>
        public static IQueryable<T> OrderByDescending<T>(this IQueryable<T> source, string propertyName)
        {
            return OrderBy(source, propertyName, false);
        }

		/// <summary>
		/// Appends ThenBy expresssion for given property.
		/// </summary>
        public static IQueryable<T> ThenBy<T>(this IQueryable<T> source, string propertyName)
        {
            return ThenBy(source, propertyName, true);
        }

		/// <summary>
		/// Appends ThenByDescending expresssion for given property.
		/// </summary>
        public static IQueryable<T> ThenByDescending<T>(this IQueryable<T> source, string propertyName)
        {
            return ThenBy(source, propertyName, false);
        }
    }
}
