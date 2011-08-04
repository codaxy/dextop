using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// This class represents the data filter sent by the remote store.
	/// </summary>
	public class DextopReadFilter
    {
		/// <summary>
		/// Start field used for data paging.
		/// </summary>
		public int? start { get; set; }

		/// <summary>
		/// Page field used for data paging.
		/// </summary>
		public int? page { get; set; }

		/// <summary>
		/// Limit field used for data paging. Indicates the number the records to be returned.
		/// </summary>
		public int? limit { get; set; }

		/// <summary>
		/// Gets the limit value sent by the store. If limit is not set exception is thrown.
		/// </summary>
		/// <returns>The limit.</returns>
        public int GetLimit()
        {
			var l = limit;
			if (!l.HasValue)
                throw new DextopException("Paging limit not specified.");
			return l.Value;
        }

		/// <summary>
		/// Indicates the number of the record to be skipped.
		/// </summary>
		/// <returns>The start value.</returns>
        public int GetStart()
        {
            return start ?? 0;
        }

		/// <summary>
		/// Sort instructions.
		/// </summary>
        public Sorter[] sort { get; set; }

        /// <summary>
        /// Store filters.
        /// </summary>
        public Filter[] filter { get; set; }

		DextopConfig _params;

		/// <summary>
		/// Custom params sent by the store.
		/// </summary>
		public DextopConfig Params
		{
			get { return _params ?? (_params = new DextopConfig()); }
			set { _params = value; }
		}

        /// <summary>
        /// This class represents sort instructions sent by the store.
        /// </summary>
        public class Sorter
        {
            /// <summary>
            /// Property to be sorted by.
            /// </summary>
            public String property { get; set; }

            /// <summary>
            /// Sort direction. 
            /// </summary>
            public String direction { get; set; }
        }

        /// <summary>
        /// This class represents filter instructions sent by the store.
        /// </summary>
        public class Filter
        {
            /// <summary>
            /// Property to be filtered by.
            /// </summary>
            public String property { get; set; }

            /// <summary>
            /// Filter value. 
            /// </summary>
            public String value { get; set; }
        }

    }

	/// <summary>
	/// Data proxy used to load data by the client
	/// </summary>
    public interface IDextopReadProxy
    {
		/// <summary>
		/// Read records using the specified filter.
		/// </summary>
        DextopReadResult Read(DextopReadFilter filter);
    }

	/// <summary>
	/// Data proxy used by the client data proxy to load and manipulate the data.
	/// </summary>
    public interface IDextopDataProxy : IDextopReadProxy
    {
		/// <summary>
		/// Create records with the specified data.
		/// </summary>
		/// <param name="records">The records to be created.</param>
		/// <returns>
		/// List of created records.
		/// </returns>
		IList<object> Create(IList<object> records);

		/// <summary>
		/// Destroys the specified records.
		/// </summary>
		/// <param name="records">The records to be destroyed.</param>
		/// <returns>
		/// List of modified records.
		/// </returns>
		IList<object> Destroy(IList<object> records);

		/// <summary>
		/// Updates the specified records.
		/// </summary>
		/// <param name="records">The records to be changed.</param>
		/// <returns>List of modified records in their final state.</returns>
		IList<object> Update(IList<object> records);       
    }

	/// <summary>
	/// Data proxy used to load data by the client
	/// </summary>
	/// <typeparam name="Model">Model type.</typeparam>
    public interface IDextopReadProxy<Model> where Model:class
    {

		/// <summary>
		/// Read records using the specified filter.
		/// </summary>
		/// <param name="filter">The filter.</param>
		/// <returns>Read result.</returns>
        DextopReadResult<Model> Read(DextopReadFilter filter);
    }

	/// <summary>
	/// Data proxy used by the client data proxy to load and manipulate the data.
	/// </summary>
	/// <typeparam name="Model">Model type.</typeparam>
    public interface IDextopDataProxy<Model> : IDextopReadProxy<Model> where Model : class
    {
		/// <summary>
		/// Create records with the specified data.
		/// </summary>
		/// <param name="records">The records to be created.</param>
		/// <returns>
		/// List of created records.
		/// </returns>
        IList<Model> Create(IList<Model> records);


		/// <summary>
		/// Destroys the specified records.
		/// </summary>
		/// <param name="records">The records to be destroyed.</param>
		/// <returns>
		/// List of modified records.
		/// </returns>
		IList<Model> Destroy(IList<Model> records);


		/// <summary>
		/// Updates the specified records.
		/// </summary>
		/// <param name="records">The records to be changed.</param>
		/// <returns>List of modified records in their final state.</returns>
		IList<Model> Update(IList<Model> records);
    }

    
}
