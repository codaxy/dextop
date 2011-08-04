using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Direct;
using System.Collections.Concurrent;

namespace Codaxy.Dextop
{
	/// <summary>
	/// A session object.
	/// </summary>
    public partial class DextopSession : IDisposable
    {
        
		/// <summary>
		/// Unique identifier associated with the session.
		/// </summary>
		public String SessionId { get; private set; }
        
		/// <summary>
		/// Gets the Dextop application this session belongs to.
		/// </summary>
		public DextopApplication DextopApplication { get; private set; }

        //public String RootPrefix { get; protected set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopSession"/> class.
		/// </summary>
        public DextopSession()
        {
            
        }

		/// <summary>
		/// Initialize sesssions.
		/// </summary>
		/// <param name="application">The application.</param>
		/// <param name="sessionId">The session id.</param>
		/// <returns></returns>
		protected virtual internal DextopConfig Initialize(DextopApplication application, String sessionId)
		{
			SessionId = sessionId;
			DextopApplication = application;
			Context = new DextopContext
			{
				//Application = session.DextopApplication,
				ModelManager = DextopApplication.ModelManager,
				Session = this,
			};
			RegisterDependencies();
			ExtendSession();
			return InitRemoting();
		}

		/// <summary>
		/// Extends the session. This method is remotable.
		/// </summary>
        [DextopRemotable]
        public void ExtendSession()
        {
            sessionExpiryTime = DateTime.Now.AddMinutes(10);
        }

		/// <summary>
		/// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
		/// </summary>
        public virtual void Dispose()
        {
            DisposeRemotables();
        }

        DateTime sessionExpiryTime;

		/// <summary>
		/// Gets a value indicating whether session has expired.
		/// </summary>
        public bool Expired { get { return sessionExpiryTime <= DateTime.Now; } }

		/// <summary>
		/// Mark that session has expired.
		/// </summary>
        public void SetExpired() { sessionExpiryTime = DateTime.Now; }

		/// <summary>
		/// Gets or sets the session culture.
		/// </summary>
        public CultureInfo Culture { get; set; }

        Dictionary<String, object> sessionVariables;

		/// <summary>
		/// Sets the session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		/// <param name="value">The value.</param>
        public void SetVariable(string sessionVariableName, object value)
        {
            if (sessionVariables == null)
                sessionVariables = new Dictionary<string, object>();
            lock (sessionVariables)
            {
                sessionVariables[sessionVariableName] = value;
            }
        }

		/// <summary>
		/// Gets the session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		/// <returns></returns>
        public object GetVariable(string sessionVariableName)
        {
            if (sessionVariables == null)
                return null;

            lock (sessionVariables)
            {
                object res;
                if (sessionVariables.TryGetValue(sessionVariableName, out res))
                    return res;
                return null;
            }
        }

		/// <summary>
		/// Removes the session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
        public void RemoveVariable(String sessionVariableName)
        {
            if (sessionVariables != null && sessionVariableName != null)
                lock (sessionVariables)
                {
                    sessionVariables.Remove(sessionVariableName);
                }
        }

		/// <summary>
		/// Sets the global session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		/// <param name="value">The value.</param>
		public void SetGlobalVariable(string sessionVariableName, object value)
		{
			DextopApplication.SetGlobalVariable(sessionVariableName, value);
		}

		/// <summary>
		/// Gets the global session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		/// <returns></returns>
		public object GetGlobalVariable(string sessionVariableName)
		{
			return DextopApplication.GetGlobalVariable(sessionVariableName);
		}

		/// <summary>
		/// Removes the global session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		public void RemoveGlobalVariable(String sessionVariableName)
		{
			DextopApplication.RemoveGlobalVariable(sessionVariableName);
		}

		/// <summary>
		/// Sets the localized session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		/// <param name="value">The value.</param>
        public void SetLocalizedVariable(string sessionVariableName, object value)
        {
			if (Culture == null)
				throw new DextopException("Session culture not set.");
			DextopApplication.SetLocalizedVariable(Culture, sessionVariableName, value);
        }

		/// <summary>
		/// Gets the localized session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		/// <returns></returns>
        public object GetLocalizedVariable(string sessionVariableName)
        {
			if (Culture == null)
				return null;
			return DextopApplication.GetLocalizedVariable(Culture, sessionVariableName);
        }

		/// <summary>
		/// Removes the localized session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
        public void RemoveLocalizedVariable(String sessionVariableName)
        {
			DextopApplication.RemoveLocalizedVariable(Culture, sessionVariableName);
        }

		/// <summary>
		/// Sets the session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		/// <param name="value">The value.</param>
		/// <param name="sharing">The sharing mode.</param>
        public void SetVariable(string sessionVariableName, object value, DextopSessionVariableSharing sharing)
        {
            switch (sharing)
            {
                case DextopSessionVariableSharing.Global:
                    SetGlobalVariable(sessionVariableName, value);
                    break;
                case DextopSessionVariableSharing.Culture:
                    SetLocalizedVariable(sessionVariableName, value);
                    break;
                case DextopSessionVariableSharing.None:
                    SetVariable(sessionVariableName, value);
                    break;
            }
        }

		/// <summary>
		/// Gets the session variable.
		/// </summary>
		/// <param name="sessionVariableName">Name of the session variable.</param>
		/// <param name="checkGlobal">if set to <c>true</c> globals variables are included.</param>
		/// <returns></returns>
        public object GetVariable(string sessionVariableName, bool checkGlobal)
        {
            if (checkGlobal)
            {
                var res = GetGlobalVariable(sessionVariableName);
                if (res == null)
                    res = GetLocalizedVariable(sessionVariableName);
                return res ?? GetVariable(sessionVariableName);
            }
            return GetVariable(sessionVariableName);
        }

        class LookupData
        {
            public object[] Data { get; set; }

            public int ServerVersion { get; set; }
        }

        ConcurrentDictionary<String, int> ClientLookupDataVersion;

        internal class ClientLookupData
        {
            public String name { get; set; }

            public object[] data { get; set; }

            public int version { get; set; }
        }

        string GetLookupDataKey(String name) { return "#ld_" + name; }

        void SetLookupData(String name, LookupData data, DextopSessionVariableSharing sharing)
        {
            SetVariable(GetLookupDataKey(name), data, sharing);
        }

        LookupData GetLookupData(String name)
        {
            return GetVariable(GetLookupDataKey(name), true) as LookupData;
        }

        int? GetLookupDataClientVersion(String name)
        {
            int a;
            return ClientLookupDataVersion == null ? null : ClientLookupDataVersion.TryGetValue(name, out a) ? a : (int?)null;
        }

        bool TryGetLookupData(String name, out LookupData data)
        {
            data = GetLookupData(name);
            return data != null;
        }

		internal List<ClientLookupData> PrepareLookupData(params String[] names)
		{
			var res = new List<ClientLookupData>();
			LookupData d;
			foreach (var name in names)
			{
				var clientVersion = GetLookupDataClientVersion(name);
				if (!TryGetLookupData(name, out d) || d.ServerVersion != clientVersion)
				{
					if (d == null)
					{
						int version = DextopApplication.GetNextSharedLookupVersionNumber();
						DextopSessionVariableSharing sharing;
						var data = BuildLookupData(name, out sharing);
						d = new LookupData { Data = data, ServerVersion = version };
						SetLookupData(name, d, sharing);
					}
					res.Add(new ClientLookupData
					{
						name = name,
						data = d.Data,
						version = d.ServerVersion
					});
				}
				else
					res.Add(new ClientLookupData { name = name, version = d.ServerVersion });
			}
			return res;
		}

		/// <summary>
		/// Builds the lookup data.
		/// </summary>
		/// <param name="lookupName">The lookup name.</param>
		/// <param name="sharing">The sharing mode.</param>
		/// <returns>The lookup data.</returns>
		protected virtual object[] BuildLookupData(String lookupName, out DextopSessionVariableSharing sharing)
		{
			throw new DextopException("Shared lookup data '{0}' is not registered.", lookupName);
		}

		/// <summary>
		/// Invalidate shared lookup data with the given name.
		/// </summary>		
		public void InvalidateLookupData(String lookupName)
		{
			RemoveVariable(GetLookupDataKey(lookupName));
		}

		/// <summary>
		/// Registers the lookup data version recieved by the client side. After successfull
		/// registration same lookup data is not sent to the client.
		/// </summary>
		/// <param name="lookupName">The lookup name.</param>
		/// <param name="version">The version.</param>
		[DextopRemotableAttribute]
		protected void RegisterLookupDataVersion(String lookupName, int version)
		{
			if (ClientLookupDataVersion == null)
				ClientLookupDataVersion = new ConcurrentDictionary<string, int>();

			ClientLookupDataVersion[lookupName] = version;
		}

		/// <summary>
		/// Gets the Dextop context.
		/// </summary>
        public DextopContext Context { get; private set; }
    }
}