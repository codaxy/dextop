using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// 
	/// </summary>
    public class DextopStoreEvent
    {
		/// <summary>
		/// Gets or sets a value indicating whether store data is cleard;
		/// </summary>
        public IList<object> Load { get; set; }

		/// <summary>
		/// List of updated records.
		/// </summary>
        public IList<object> Update { get; set; }
        
		/// <summary>
		/// List of created records.
		/// </summary>
		public IList<object> Create { get; set; }

		/// <summary>
		/// List of destroyed records.
		/// </summary>
        public IList<object> Destroy { get; set; }
    }

	/// <summary>
	/// 
	/// </summary>
    public class DextopStoreEventArgs : EventArgs
    {
		/// <summary>
		/// Gets or sets the event.
		/// </summary>		
        public DextopStoreEvent Event { get; set; }
    }

	/// <summary>
	/// Observable store interface. Any store which implements this interface 
	/// can be used with as a source for Dextop live stores.
	/// </summary>
    public interface IDextopObservableStore
    {
		/// <summary>
		/// Occurs when a store data changes.
		/// </summary>
        event EventHandler<DextopStoreEventArgs> DataChanged;

		/// <summary>
		/// Loads the store data.
		/// </summary>
		/// <returns></returns>
        IList<object> Load();
    }


}
