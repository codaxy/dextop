using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// 
	/// </summary>
	/// <typeparam name="T"></typeparam>
    public class DextopFunctionDataProxy<T> : IDextopReadProxy<T> where T : class
    {
        readonly Func<DextopReadFilter, DextopReadResult<T>> d;

		/// <summary>
		/// The constructor.
		/// </summary>
		/// <param name="readFnc">The read method delegate.</param>
        public DextopFunctionDataProxy(Func<DextopReadFilter, DextopReadResult<T>> readFnc)
        {
            if (readFnc == null)
                throw new ArgumentNullException("read");
            d = readFnc;
        }

		/// <summary>
		/// Reads the data using specified filter.
		/// </summary>
		/// <param name="filter">The filter.</param>
		/// <returns></returns>
        public DextopReadResult<T> Read(DextopReadFilter filter)
        {
            return d(filter);
        }
    }
}
