using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Concurrent;
using Codaxy.Dextop.Remoting;
using System.Globalization;
using System.Threading;

namespace Codaxy.Dextop
{

	/// <summary>
	/// Dextop application class provides
	/// - session management
	/// - module registration
	/// - namespace mapping
	///  
	/// </summary>
    public abstract partial class DextopApplication : IDisposable
    {
		/// <summary>
		/// Unique value associatated with the application instance.
		/// </summary>
        public String AppKey { get; set; }


		/// <summary>
		/// Initializes a new instance of the <see cref="DextopApplication"/> class.
		/// </summary>
        public DextopApplication()
        {
            RemoteMethodInvoker = new ReflectionRemoteMethodInvoker();
            ModelManager = new Data.DextopModelManager(this);
        }

		/// <summary>
		/// Initializes this instance. All modules are initialized.
		/// </summary>
        public void Initialize()
        {
            RegisterModules();
            
            foreach (var m in Modules)
                m.Initialize();

            OnModulesInitialized();
            
            RegisterModels();            
        }

		/// <summary>
		/// This method is called when all modules have been successfully initialized.
		/// </summary>
        protected virtual void OnModulesInitialized() { }

		/// <summary>
		/// Gets or sets the remote method invoker.
		/// </summary>		
        protected internal IDextopRemotableMethodInvoker RemoteMethodInvoker { get; set; }

		/// <summary>
		/// Registers the modules.
		/// </summary>
        protected abstract void RegisterModules();

		/// <summary>
		/// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
		/// </summary>
        public virtual void Dispose()
        {
            DisposeSessions();
        }

        static ConcurrentDictionary<String, DextopApplication> applications;

		/// <summary>
		/// Registers the application.
		/// </summary>
		/// <param name="application">The application.</param>
        public static void RegisterApplication(DextopApplication application)
        {
            if (applications == null)
                applications = new ConcurrentDictionary<string, DextopApplication>();

            if (application.AppKey == null)
                application.AppKey = String.Empty;

            if (!applications.TryAdd(application.AppKey, application))
                throw new DextopException("Dextop application with the same key already exists.");
        }

		/// <summary>
		/// Gets the application.
		/// </summary>
		/// <param name="key">The app key.</param>
		/// <returns></returns>
        public static DextopApplication GetApplication(String key = null)
        {
            DextopApplication res;
			if (applications == null || !applications.TryGetValue(key ?? String.Empty, out res))
				throw new DextopApplicationNotFoundException();
            return res;
        }

		/// <summary>
		/// Gets the default language code.
		/// </summary>
        protected virtual String DefaultLanguageCode { get { return "en"; } }

		/// <summary>
		/// Maps the culture object to language code.
		/// </summary>
		/// <param name="culture">The culture.</param>
		/// <returns></returns>
        protected virtual String MapCultureToLanguageCode(CultureInfo culture)
        {
            if (culture == null)
                return DefaultLanguageCode;
            return culture.Name.Substring(0, 2);
        }

		int sharedLookupVersionCounter;
		internal int GetNextSharedLookupVersionNumber()
		{
			return Interlocked.Increment(ref sharedLookupVersionCounter);
		}

		Dictionary<String, object> globalSessionVariables;

		internal void SetGlobalVariable(string sessionVariableName, object value)
		{
			if (globalSessionVariables == null)
				globalSessionVariables = new Dictionary<string, object>();
			lock (globalSessionVariables)
			{
				globalSessionVariables[sessionVariableName] = value;
			}
		}

		internal object GetGlobalVariable(string sessionVariableName)
		{
			if (globalSessionVariables == null)
				return null;

			lock (globalSessionVariables)
			{
				object res;
				if (globalSessionVariables.TryGetValue(sessionVariableName, out res))
					return res;
				return null;
			}
		}

		internal void RemoveGlobalVariable(String sessionVariableName)
		{
			if (globalSessionVariables != null && sessionVariableName != null)
				lock (globalSessionVariables)
				{
					globalSessionVariables.Remove(sessionVariableName);
				}
		}

		Dictionary<String, Dictionary<String, object>> localizedSessionVariables;

		internal Dictionary<String, object> GetLocalizedVariablesStore(CultureInfo culture, bool create)
		{
			if (localizedSessionVariables == null)
				localizedSessionVariables = new Dictionary<string, Dictionary<string, object>>();

			Dictionary<String, object> res = null;
			if (localizedSessionVariables.TryGetValue(culture.Name, out res))
				return res;

			lock (localizedSessionVariables)
			{
				if (create && !localizedSessionVariables.TryGetValue(culture.Name, out res))
				{
					res = new Dictionary<string, object>();
					localizedSessionVariables.Add(culture.Name, res);
				}
			}
			return res;
		}

		internal void SetLocalizedVariable(CultureInfo culture, string sessionVariableName, object value)
		{
			var store = GetLocalizedVariablesStore(culture, true);
			lock (store)
			{
				store[sessionVariableName] = value;
			}
		}

		internal object GetLocalizedVariable(CultureInfo culture, string sessionVariableName)
		{
			var store = GetLocalizedVariablesStore(culture, false);
			if (store == null)
				return null;
			lock (store)
			{
				object res;
				if (store.TryGetValue(sessionVariableName, out res))
					return res;
				return null;
			}
		}

		internal void RemoveLocalizedVariable(CultureInfo culture, String sessionVariableName)
		{
			var store = GetLocalizedVariablesStore(culture, false);
			if (store != null && sessionVariableName != null)
				lock (store)
				{
					store.Remove(sessionVariableName);
				}
		}
    }
}
