using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Data proxy which gets called when the data is manipulated on the client side.
	/// </summary>
	/// <typeparam name="T">Model type.</typeparam>
    public abstract class DextopDataProxy<T> : IDextopDataProxy<T> where T:class
    {
		/// <summary>
		/// Create records with the specified data.
		/// </summary>
		/// <param name="records">The records to be created.</param>
		/// <returns>
		/// List of created records.
		/// </returns>
		public virtual IList<T> Create(IList<T> records)
        {
            throw new NotSupportedException();
        }

		/// <summary>
		/// Destroys the specified records.
		/// </summary>
		/// <param name="records">The records to be destroyed.</param>
		/// <returns>
		/// List of modified records.
		/// </returns>
		public virtual IList<T> Destroy(IList<T> records)
        {
            throw new NotSupportedException();
        }

		/// <summary>
		/// Updates the specified records.
		/// </summary>
		/// <param name="records">The records to be changed.</param>
		/// <returns>List of modified records in their final state.</returns>
		public virtual IList<T> Update(IList<T> records)
        {
            throw new NotSupportedException();
        }

		/// <summary>
		/// Read records using the specified filter.
		/// </summary>
		/// <param name="filter">The filter.</param>
		/// <returns>Read result.</returns>
        public abstract DextopReadResult<T> Read(DextopReadFilter filter);
    }
}
