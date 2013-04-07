using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Direct;
using System.Web;
using System.IO;
using Codaxy.Common.Globalization;
using System.Threading;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop
{
    public partial class DextopSession
    {
        internal void HandleAjaxRequest(System.Web.HttpContext context)
        {
            var remoteId = context.Request.QueryString["remoteId"];
            RemotableContext rc;
            if (remotables.TryGetValue(remoteId, out rc))
            {
                var handler = rc.Remotable.Remote.OnProcessAjaxRequest;
                if (handler != null)
                    handler(context);
            }
        }

        int lastTid = 0;

        internal IList<Response> HandleRemotingRequest(HttpContext context, Request[] requests)
        {
            if (Culture != null)
                Thread.CurrentThread.CurrentCulture = Culture;

			HttpContext = context;

            var responses = new List<Response>();
            foreach (var request in requests)
            {

                /* This part blocks out of order processing of direct transactions for 2 seconds.
                 * This is important as two sequential http request can come in different order than sent.
                 * Luckily Ext.direct has tid field.
                 */
                int waitCounter = 20;
                while (request.tid > lastTid + 1 && --waitCounter>0)
                {
                    Thread.Sleep(100);
                }

                if (request.tid > lastTid)
                    lastTid = request.tid;

                var call = new DextopRemoteMethodCall
                {
                    FormSubmit = request.FormSubmit,
                    RemoteId = request.data[0],
                    Arguments = DextopUtil.Decode<String[]>(request.data[2]),
                    MethodName = request.data[1]
                };
                var response = new Response
                {
                    type = "rpc",
                    method = request.method,
                    tid = request.tid,
                    action = request.action
                };
                responses.Add(response);
                try
                {
                    response.result = ExecuteMethodCall(call);
                }
                catch (Exception ex)
                {
                    response.result = new DextopRemoteMethodCallResult
                    {
                        success = false,
                        result = new DextopRemoteMethodCallException
                        {
                            type = "rpc",
                            exception = ex.Message,
                            stackTrace = ex.StackTrace
                        }
                    };
                }
            }

			HttpContext = null;

            return responses;
        }        
        
        LongPollingResult previousLongPollingResult;

        internal IAsyncResult BeginHandleLongPollingRequest(int start, AsyncCallback callback, object state)
        {
            //If, for some reason, last package was not recieved by the client, send same package again...
            if (previousLongPollingResult != null && start < previousLongPollingResult.nextStart)
                return ((Func<LongPollingResult>)GetPreviousLongPollingResult).BeginInvoke(callback, state);

            return messageQueue.BeginTake(20000, callback, state);
        }

        LongPollingResult GetPreviousLongPollingResult()
        {
            return previousLongPollingResult;
        }

        internal LongPollingResult EndHandlingLongPollingRequest(IAsyncResult asyncResult, int start) {

            var result = new LongPollingResult
            {
                type = "rpc",
                name = "message"
            };
            try
            {                
                if (previousLongPollingResult != null && start < previousLongPollingResult.nextStart)
                {
                    result = ((Func<LongPollingResult>)GetPreviousLongPollingResult).EndInvoke(asyncResult);                    
                }
                else
                {
                    var msgs = messageQueue.EndTake(asyncResult);                    
                    result.nextStart = start + msgs.Count;
                    result.data = msgs;
                    result.success = true;
                    previousLongPollingResult = result;                    
                }
            }
            catch (Exception ex)
            {
                result.success = false;
                result.data = new DextopRemoteMethodCallException
                {
                    type = "rpc",
                    exception = ex.Message,
                    stackTrace = ex.StackTrace
                };                
            }            
            return result;
        }

        internal PollingResult HandlePollingRequest(HttpContext context)
        {
            var result = new PollingResult
            {
                type = "rpc",
                name = "message"
            };
            try
            {
                int nextStart;
                var msgs = PopMessages(null, out nextStart);
                result.success = true;
                result.data = msgs;
            }
            catch (Exception ex)
            {
                result.data = new DextopRemoteMethodCallException
                {
                    type = "message",
                    exception = ex.Message,
                    stackTrace = ex.StackTrace
                };
            }
            return result;
        }



		/// <summary>
		/// Gets a value indicating whether long-polling handler should be used.
		/// </summary>		
        protected virtual bool UseLongPolling { get { return true; } }

		/// <summary>
		/// Gets a value indicating whether polling handler should be used.
		/// </summary>		
		protected virtual bool UsePolling { get { return false; } }

        /// <summary>
        /// Gets a value indicating whether api handler is used.
        /// </summary>		
        protected virtual bool UseApi { get { return false; } }

		/// <summary>
		/// Gets the polling interval.
		/// </summary>
		protected virtual int PollingInterval { get { return 20000; } }

		/// <summary>
		/// Gets the direct config.
		/// </summary>
		/// <returns></returns>
        protected DextopConfig GetDirectConfig()
        {
            if (DextopApplication == null)
                throw new DextopSessionNotInitializedException();
            
			var urlFormat = DextopUtil.AbsolutePath(String.Format("{{0}}.ashx?sid={0}", SessionId));
            
			if (!String.IsNullOrEmpty(DextopApplication.AppKey))
				urlFormat += "&app=" + DextopApplication.AppKey;
            
            var res = new DextopConfig();
            res["remotingUrl"] = String.Format(urlFormat, "rpc");
            if (UseLongPolling) 
                res["longPollingUrl"] = String.Format(urlFormat, "lpoll");
            else if (UsePolling)
            {
                res["pollingUrl"] = String.Format(urlFormat, "poll");
                res["pollingInterval"] = PollingInterval;
            }

            if (UseApi)
            {
                res["apiUrl"] = "api.ashx";
            }

            return res;
        }       

		/// <summary>
		/// Current HttpContext
		/// </summary>
		public HttpContext HttpContext { get; private set; }
	}
}
