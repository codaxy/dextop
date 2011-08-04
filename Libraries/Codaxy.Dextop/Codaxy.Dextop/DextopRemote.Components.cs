using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Data;
using System.Diagnostics;

namespace Codaxy.Dextop
{
    public partial class DextopRemote
    {
        List<IDisposable> disposeComponentList;
        internal DextopConfig componentsConfig;

		/// <summary>
		/// Tracks the disposable object. Tracked objects will be disposed after this instance is disposed.
		/// </summary>
		/// <param name="disposable">The disposable.</param>
        public void TrackDisposable(IDisposable disposable)
        {
            if (disposeComponentList == null)
                disposeComponentList = new List<IDisposable>();
            disposeComponentList.Add(disposable);
        }

		/// <summary>
		/// Adds the remotable component. Remotable component configuration will be available on the client side.
		/// </summary>
		/// <param name="name">The name.</param>
		/// <param name="remotable">The remotable.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
		/// <param name="own">if set to <c>true</c> [own].</param>
        public void AddRemotableComponent(String name, IDextopRemotable remotable, String remoteId = null, bool subRemote = true, bool own = true)
        {            
            if (componentsConfig == null)
                componentsConfig = new DextopConfig();
			componentsConfig.Add(name, TrackRemotableComponent(remotable, remoteId, subRemote, own));
        }

		/// <summary>
		/// Register remotable object without registering it's config.
		/// </summary>
		/// <param name="remotable"></param>
		/// <param name="remoteId"></param>
		/// <param name="subRemote"></param>
		/// <param name="own"></param>
		/// <returns></returns>
		public DextopConfig TrackRemotableComponent(IDextopRemotable remotable, String remoteId = null, bool subRemote = true, bool own = true)
		{
			if (own)
				TrackDisposable(remotable);
			return Register(remotable, remoteId, subRemote);
		}

		/// <summary>
		/// Adds the component.
		/// </summary>
		/// <param name="name">The name.</param>
		/// <param name="o">The o.</param>
		/// <param name="own">if set to <c>true</c> component will be disposed.</param>
        public void AddComponent(String name, object o, bool own = true)
        {
            if (own && o is IDisposable)
                TrackDisposable((IDisposable)o);
            if (componentsConfig == null)
                componentsConfig = new DextopConfig();
            componentsConfig.Add(name, o);
        }

		/// <summary>
		/// Adds the store.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="name">The name.</param>
		/// <param name="crud">The crud.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
		/// <param name="own">if set to <c>true</c> [own].</param>
        public void AddStore<T>(String name, IDextopDataProxy<T> crud, String remoteId = null, bool subRemote = true, bool own = true) where T : class
        {
            var meta = Context.ModelManager.GetModelMeta(typeof(T));
            var proxy = new DextopDataProxyAdapter<T>(crud);
            AddRemotableComponent(name + "Proxy", new DextopProxy(proxy, meta), remoteId, subRemote, own);
        }

		/// <summary>
		/// Adds the store.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="name">The name.</param>
		/// <param name="crud">The crud.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
		/// <param name="own">if set to <c>true</c> [own].</param>
        public void AddStore<T>(String name, IDextopReadProxy<T> crud, String remoteId = null, bool subRemote = true, bool own = true) where T : class
        {
            var meta = Context.ModelManager.GetModelMeta(typeof(T));
            var proxy = new DextopReadProxyAdapter<T>(crud);
            AddRemotableComponent(name + "Proxy", new DextopProxy(proxy, meta), remoteId, subRemote, own);
        }

		/// <summary>
		/// Adds the store.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="name">The name.</param>
		/// <param name="read">The read.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
        public void AddStore<T>(String name, Func<DextopReadFilter, DextopReadResult<T>> read, String remoteId = null, bool subRemote = true) where T : class
        {
            AddStore(name, new DextopFunctionDataProxy<T>(read), remoteId, subRemote);
        }

		/// <summary>
		/// Adds the store.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="name">The name.</param>
		/// <param name="read">The read.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
		public void AddStore<T>(String name, Func<DextopReadFilter, IEnumerable<T>> read, String remoteId = null, bool subRemote = true) where T : class
		{
			AddStore(name, a => DextopReadResult.Create(read(a)), remoteId, subRemote);
		}

		/// <summary>
		/// Adds the store.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="name">The name.</param>
		/// <param name="read">The read.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
        public void AddStore<T>(String name, Func<DextopReadFilter, IList<T>> read, String remoteId = null, bool subRemote = true) where T : class
        {
            AddStore(name, (filter) => { return DextopReadResult.Create(read(filter)); }, remoteId, subRemote);
        }

		/// <summary>
		/// Adds the store.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="name">The name.</param>
		/// <param name="data">The data.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
        public void AddStore<T>(String name, IList<T> data, String remoteId = null, bool subRemote = true) where T : class
        {
            AddStore(name, (filter) => { return DextopReadResult.Create(data); }, remoteId, subRemote);
        }

		/// <summary>
		/// Adds the grid columns.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="name">The name.</param>
        public void AddGridColumns<T>(String name)
        {
            var meta = Context.ModelManager.GetModelMeta(typeof(T));
            AddComponent(name + "GridColumns", meta.ModelName);
        }

		/// <summary>
		/// Adds the lookup data.
		/// </summary>
		/// <param name="name">The name.</param>
		/// <param name="data">The data.</param>
        public void AddLookupData(String name, params object[] data)
        {
            AddComponent(name + "LookupData", data);
        }

		/// <summary>
		/// Adds the shared lookup data.
		/// </summary>
		/// <param name="name">The name.</param>
        public void AddSharedLookupData(params String[] name)
        {
			var data = Session.PrepareLookupData(name);
			foreach (var d in data)
			{
				AddComponent(d.name + "SharedLookupData", d);
			}
        }

		/// <summary>
		/// Disposes the components.
		/// </summary>
        void DisposeComponents()
        {
            if (disposeComponentList != null)
            {
                foreach (var d in disposeComponentList)
                    try
                    {
                        d.Dispose();
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine(ex);
                    }
                disposeComponentList = null;
            }
        }

		/// <summary>
		/// Adds the live store.
		/// </summary>
		/// <typeparam name="Id">The type of the d.</typeparam>
		/// <typeparam name="T"></typeparam>
		/// <param name="name">The name.</param>
		/// <param name="store">The store.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
        public void AddLiveStore<Id, T>(String name, DextopObservableStore<Id, T> store, String remoteId = null, bool subRemote = true) where T : class
        {
            var meta = Context.ModelManager.GetModelMeta(typeof(T));            
            var liveStore = new DextopLiveStore(meta, store);
            AddLiveStore(name, liveStore, remoteId, subRemote);            
        }

		/// <summary>
		/// Adds the live store.
		/// </summary>
		/// <param name="name">The name.</param>
		/// <param name="liveStore">The live store.</param>
		/// <param name="remoteId">The remote id.</param>
		/// <param name="subRemote">if set to <c>true</c> [sub remote].</param>
        public void AddLiveStore(String name, DextopLiveStore liveStore, String remoteId = null, bool subRemote = true)
        {            
            AddRemotableComponent(name + "LiveStore", liveStore, remoteId, subRemote, true);
        }
	}
}
