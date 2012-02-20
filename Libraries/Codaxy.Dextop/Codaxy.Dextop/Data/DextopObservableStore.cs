using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Concurrent;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// A store supporting IDextopObservableStore interface. 
	/// Convinient for live stores.
	/// </summary>
	/// <typeparam name="Id">The type of the id field.</typeparam>
	/// <typeparam name="Model">The model type</typeparam>
    public class DextopObservableStore<Id, Model> : IDextopObservableStore where Model : class
    {
        Func<Model, Id> GetId;
        ConcurrentDictionary<Id, Model> data;

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopObservableStore&lt;Id, Model&gt;"/> class.
		/// </summary>
		/// <param name="id">The id getter.</param>
        public DextopObservableStore(Func<Model, Id> id)
        {
            data = new ConcurrentDictionary<Id, Model>();
            GetId = id;
        }

        object lockObject = new object();

		/// <summary>
		/// Adds or updates the specified records.
		/// </summary>
		/// <param name="records">The records.</param>
        public void SetMany(IEnumerable<Model> records)
        {
            List<object> add = new List<object>();
            List<object> update = new List<object>();

            lock (lockObject)
            {
                foreach (var d in records)
                {
                    var id = GetId(d);
                    if (data.TryAdd(id, d))
                        add.Add(d);
                    else
                    {
                        data[id] = d;
                        update.Add(d);
                    }
                }

                if (add.Count > 0 || update.Count > 0)
                    RaiseEvent(new DextopStoreEvent { Update = update, Create = add });
            }
        }

		/// <summary>
		/// Adds or updates the specified records.
		/// </summary>
		/// <param name="records">The records.</param>
        public void Set(params Model[] records)
        {
            SetMany(records);
        }

		/// <summary>
		/// Removes the specified records.
		/// </summary>
		/// <param name="records">The records.</param>
        public void Remove(params Model[] records)
        {
            RemoveMany(records);
        }

		/// <summary>
		/// Removes the specified records.
		/// </summary>
		/// <param name="records">The records.</param>
        public void RemoveMany(IEnumerable<Model> records)
        {
            List<object> remove = new List<object>();

            lock (lockObject)
            {
                foreach (var d in records)
                {
                    var id = GetId(d);
                    Model value;
                    if (data.TryRemove(id, out value))
                        remove.Add(value);
                }
                if (remove.Count > 0)
                    RaiseEvent(new DextopStoreEvent { Destroy = remove });
            }
        }


		/// <summary>
		/// Removes the records with specified ids.
		/// </summary>		
        public void Remove(params Id[] id)
        {
            List<object> remove = new List<object>();

            lock (lockObject)
            {
                foreach (var _id in id)
                {
                    Model value;
                    if (data.TryRemove(_id, out value))
                        remove.Add(value);
                }
                if (remove.Count > 0)
                    RaiseEvent(new DextopStoreEvent { Destroy = remove });
            }
        }

        private void RaiseEvent(DextopStoreEvent ed)
        {
            var handler = DextopObservableStoreDataChanged;
            if (handler != null)
                handler(this, new DextopStoreEventArgs { Event = ed });
        }

        IList<object> IDextopObservableStore.Load()
        {
            return data.Values.ToArray();
        }

        event EventHandler<DextopStoreEventArgs> IDextopObservableStore.DataChanged
        {
            add { DextopObservableStoreDataChanged += value; }
            remove { DextopObservableStoreDataChanged -= value; }
        }

        event EventHandler<DextopStoreEventArgs> DextopObservableStoreDataChanged;

        /// <summary>
        /// Gets the record by Id. 
        /// Returns false if record is not found in the store.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public bool TryGetRecordById(Id id, out Model result)
        {
            return data.TryGetValue(id, out result);
        }

        /// <summary>
        /// Number of records in the store.
        /// </summary>
        public int Count { get { return data.Count; } }
    }
}
