using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Diagnostics;
using System.Threading;

namespace Codaxy.Dextop.Remoting
{
    class LongPollingResult : PollingResult
    {
        public int nextStart { get; set; }
    }

	/// <summary>
	/// An HTTP handler responsible for long-polling results.
	/// </summary>
    public class DextopLongPollingHandler : IHttpAsyncHandler
    {
        DextopSession session;
        HttpContext context;
        Action<HttpContext, Exception> errorHandler;
        int start;

        IAsyncResult IHttpAsyncHandler.BeginProcessRequest(HttpContext context, AsyncCallback cb, object extraData)
        {            
            try
            {                
                if (!int.TryParse(context.Request["start"], out start))
                    start = 0;

                this.context = context;
                this.session = GetSession(context);
                var ar = session.BeginHandleLongPollingRequest(start, cb, extraData);
                return ar;
            }
            catch (Exception ex)
            {
                errorHandler = WriteException;
                return errorHandler.BeginInvoke(context, ex, cb, extraData);
            }
        }

        void IHttpAsyncHandler.EndProcessRequest(IAsyncResult asyncResult)
        {
            if (errorHandler != null)
            {
                errorHandler.EndInvoke(asyncResult);
            }
            else
            {
                LongPollingResult result;
                try
                {
                    result = session.EndHandlingLongPollingRequest(asyncResult, start);
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Long polling exception.", ex);
                    //Application should handle the request and give a valid result.
                    //Any exception is a sign that session is not valid anymore.
                    result = new LongPollingResult
                    {
                        type = "rpc",
                        name = "message",
                        success = false,
                        data = new DextopRemoteMethodCallException
                        {
                            exception = ex.Message,
                            type = "session"
                        }
                    };
                }

                context.Response.ContentType = "application/json";
                DextopUtil.Encode(result, context.Response.Output);
            }
        }

        void WriteException(HttpContext context, Exception ex)
        {
            //Application should handle the request and give a valid result.
            //Any exception is a sign that session is not valid anymore.
            var result = new LongPollingResult
            {
                type = "rpc",
                name = "message",
                success = false,
                data = new DextopRemoteMethodCallException
                {
                    exception = ex.Message,
                    type = "session"
                }
            };

            context.Response.ContentType = "application/json";
            DextopUtil.Encode(result, context.Response.Output);
        }

        DextopSession GetSession(HttpContext context)
        {
            var appKey = context.Request.QueryString["app"];
            var app = DextopApplication.GetApplication(appKey);
            var sessionId = context.Request.QueryString["sid"];
            var session = app.GetSession(sessionId);
            return session;
        }

        void IHttpHandler.ProcessRequest(HttpContext context)
        {
            throw new NotImplementedException();
        }

        bool IHttpHandler.IsReusable { get { return false; } }
    }
}
