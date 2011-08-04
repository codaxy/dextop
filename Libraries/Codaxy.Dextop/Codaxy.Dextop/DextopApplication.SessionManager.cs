using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Concurrent;
using System.Diagnostics;

namespace Codaxy.Dextop
{
	/// <summary>
	/// 
	/// </summary>
    public partial class DextopApplication : IDisposable
    {
        ConcurrentDictionary<string, DextopSession> session = new ConcurrentDictionary<string, DextopSession>();
        DateTime nextSessionExpiryCheck = DateTime.Now.AddMinutes(1);


		/// <summary>
		/// Adds given session to the application.
		/// </summary>
		/// <param name="session">The session.</param>
		/// <returns>Session configuration.</returns>
		public DextopConfig AddSession(DextopSession session)
		{
			var config = session.Initialize(this, Guid.NewGuid().ToString());
			if (!this.session.TryAdd(session.SessionId, session))
				throw new DextopInternalException();
			return config;
		}


		/// <summary>
		/// Gets the session with the specified session Id. Exception is thrown if session is not found or exipred.
		/// </summary>
		/// <param name="sessionId">The session id.</param>
		/// <returns>The session.</returns>
        public DextopSession GetSession(String sessionId)
        {
			CheckExpiredSessions();
            DextopSession res;
            if (!session.TryGetValue(sessionId, out res) || res.Expired)
                throw new DextopSessionNotFoundException();
            return res;
        }

        private void CheckExpiredSessions()
        {
            if (nextSessionExpiryCheck < DateTime.Now)
            {
                nextSessionExpiryCheck = DateTime.Now.AddMinutes(1);
                RemoveExpiredSessions();
            }
        }

        private void RemoveSession(String sessionId)
        {            
            DextopSession s;
            if (session.TryRemove(sessionId, out s))
                s.Dispose();     
        }

		/// <summary>
		/// Removes all expired sessions.
		/// </summary>
        public void RemoveExpiredSessions()
        {
            foreach (var s in session.Values.Where(a => a.Expired)) //concurrent dictinary supports enumeration
            {
                RemoveSession(s.SessionId);
            }
        }

		/// <summary>
		/// Returns all sessions.
		/// </summary>
		/// <returns></returns>
        public DextopSession[] GetSessions() { return session.Values.ToArray(); }

		/// <summary>
		/// Disposes and removes all sessions.
		/// </summary>
        protected void DisposeSessions()
        {
            foreach (var s in GetSessions())
            {
                try
                {
                    RemoveSession(s.SessionId);
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex);
                }
            }
            session.Clear();
        }
    }
}
