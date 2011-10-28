using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;
using System.Web;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Threading;
using Codaxy.Dextop.Data;
using System.Reflection;

namespace Codaxy.Dextop
{
    public partial class DextopSession : IDextopRemotable
    {
		/// <summary>
		/// Gets the remote object used for client-side communication.
		/// </summary>
        public DextopRemote Remote { get; private set; }        

        DextopConfig InitRemoting()
        {
            return Register(null, this);
        }

		/// <summary>
		/// Initializes the remotable object.
		/// </summary>
		/// <param name="remote">Remote object used for communication with the client-side object.</param>
		/// <param name="config">Configuration of the object to be created on the client side.</param>
		public virtual void InitRemotable(DextopRemote remote, DextopConfig config)
		{
			Remote = remote;
			config.Add("direct", GetDirectConfig());

            var appPath = DextopEnvironment.VirtualAppPath;
            if (!appPath.EndsWith("/"))
                appPath += "/";

            config.Add("virtualAppPath", appPath);

			DextopConfig modules = new DextopConfig();
			foreach (var m in DextopApplication.GetModules())
			{
				var r = m.RegisterSession(this);
				if (r != null)
					modules.Add(m.ModuleName, Remote.TrackRemotableComponent(r));
			}
			if (modules.Count > 0)
				config.Add("modules", modules);
		}

        void DisposeRemotables()
        {
            if (Remote != null)
                Unregister(Remote.RemoteId);
            
            foreach (var r in remotables)
            {
                try
                {
                    r.Value.Remotable.Dispose();
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex);
                }
            }
        }

        class RemotableContext
        {
            public IDextopRemotable Remotable;
        }

        ConcurrentDictionary<String, RemotableContext> remotables = new ConcurrentDictionary<string, RemotableContext>();

		internal DextopRemoteMethodCallResult ExecuteMethodCall(DextopRemoteMethodCall call)
		{
			try
			{
				if (call.RemoteId == null)
					throw new InvalidDextopRemoteMethodCallException();

				RemotableContext context;
				if (!remotables.TryGetValue(call.RemoteId, out context))
					throw new InvalidDextopRemoteMethodCallException();

                DextopRemoteMethodInvokeResult result;
				result = DextopApplication.RemoteMethodInvoker.Invoke(context.Remotable, call.MethodName, call.Arguments, call.FormSubmit);
				if (result.Success)
					return new DextopRemoteMethodCallResult
					{
						success = true,
						result = result.Result
					};

				var map = context.Remotable.Remote.OnMapRemotingException ?? MapRemotingException;

				return new DextopRemoteMethodCallResult
				{
					success = false,
					result = map(result.Exception)
				};
			}
			catch (Exception ex)
			{
				object res;
				try
				{
					res = MapRemotingException(ex);
				}
				catch (Exception mex)
				{
					res = new DextopRemoteMethodCallException
					{
						exception = mex.Message,
						stackTrace = mex.StackTrace
					};
				}
				return new DextopRemoteMethodCallResult
				{
					success = false,
					result = res
				};
			}
		}


		/// <summary>
		/// Map any exception to the result which will be returned to the client.
		/// </summary>
		/// <param name="ex">Exception</param>
		/// <returns>Return result.</returns>
		protected virtual object MapRemotingException(Exception ex)
		{
			if (ex is DextopMessageException)
			{
				var mex = (DextopMessageException)ex;
				String type = mex.Type.ToString().ToLower();				
				return new DextopRemoteMethodCallException
				{
					exception = mex.Message,
					type = type
				};
			}
			return new DextopRemoteMethodCallException
			{
				exception = ex.Message,
				stackTrace = ex.StackTrace
			};
		}

        int nextRemoteId = 0;

        internal DextopConfig Register(DextopRemote parent, IDextopRemotable remotable, String remoteId = null, bool subRemote = true)
        {
            if (remotable == null)
                throw new ArgumentNullException("remotable");

            bool isClientInitiated;

            if (remoteId == null)
            {
                remoteId = Interlocked.Increment(ref nextRemoteId).ToString();
                isClientInitiated = parent!=null && parent.IsClientInitiated;
            }
            else if (subRemote)
            {
                if (parent == null)
                    throw new DextopInternalException();
                remoteId = parent.RemoteId + '.' + remoteId;
                isClientInitiated = parent.IsClientInitiated;
            }
            else
                isClientInitiated = true;

            var context = new RemotableContext
            {
                Remotable = remotable
            };

            var remote = new DextopRemote(Context, remoteId, isClientInitiated);           

			var clientTypeName = DextopApplication.MapTypeName(remotable.GetType());

            try
            {
                var config = new DextopConfig();
                remotable.InitRemotable(remote, config);

                if (!remote.IsClientInitiated)
                {
                    DextopConfig remoteProxyConfig;
					var remoteTypeName = remote.RemoteHostType ?? clientTypeName;
                    if (remoteTypeName != null)
                    {
                        config.Add("alias", remoteTypeName);
                        remoteProxyConfig = new DextopConfig();
                        config.Add("remote", remoteProxyConfig);
                    }
                    else
                    {
                        remoteProxyConfig = config;
                    }
                    remoteProxyConfig.Add("remoteId", remoteId);
					remoteProxyConfig.Add("alias", DextopUtil.GetRemotingProxyTypeName(clientTypeName));
                    if (remote.componentsConfig != null)
                    {
                        remoteProxyConfig.Add("components", remote.componentsConfig);

                        //config not needed anymore - free memory
                        remote.componentsConfig = null;
                    }
                }

                if (!remotables.TryAdd(remoteId, context))
                    throw new DextopInternalException();

                return config;
            }
            catch
            {
                remote.Dispose();
                remotable.Dispose();
                throw;
            }

        }

        internal void Unregister(string remoteId)
        {
            if (remoteId != null)
            {
                RemotableContext c;
                remotables.TryRemove(remoteId, out c);
            }
        }

        ManualResetEventSlim serverMessageEvent;
        object serverMessagePopLock = new object();

        IList<DextopServerMessage> PopMessages(int? start, out int nextStart)
        {
            List<DextopServerMessage> res = new List<DextopServerMessage>();
            lock (serverMessagePopLock)
            {
                //if there is large number of messages, split them to chunks
                //in order to start processing on the client side sooner
                var chunkLimit = serverMessages.Count > 100 ? 50 : 100;
                DextopServerMessage sm;
                if (start != null)
                {
                    //Free messages sent in previous turn
                    while (serverMessageOffset < start.Value)
                    {
                        serverMessages.TryDequeue(out sm);
                        serverMessageOffset++;
                    }
                    res.AddRange(serverMessages.Take(chunkLimit));
                    nextStart = start.Value + res.Count;
                }
                else
                {
                    while (serverMessages.TryDequeue(out sm) && res.Count < chunkLimit)
                    {
                        res.Add(sm);
                    }
                    serverMessageOffset += res.Count;
                    nextStart = serverMessageOffset;
                }
            }            
            return res;
        }

        IList<DextopServerMessage> PopMessagesOrWait(int? start, out int nextStart, TimeSpan waitTimeout)
        {
            if (serverMessages.Count <= start - serverMessageOffset)
            {
                if (serverMessageEvent == null)
                    serverMessageEvent = new ManualResetEventSlim();
                if (serverMessageEvent.Wait(waitTimeout))
                    serverMessageEvent.Reset();
            }
            var msgs = PopMessages(start, out nextStart);
            return msgs;
        }

        ConcurrentQueue<DextopServerMessage> serverMessages = new ConcurrentQueue<DextopServerMessage>();
        int serverMessageOffset = 0;

        internal void SendServerMessage(string remoteId, object[] msgs)
        {
            foreach (var msg in msgs)
            {
                serverMessages.Enqueue(new DextopServerMessage
                {
                    remoteId = remoteId,
                    message = msg
                });
            }
            if (serverMessageEvent!=null)
                serverMessageEvent.Set();
        }        
    }
}
