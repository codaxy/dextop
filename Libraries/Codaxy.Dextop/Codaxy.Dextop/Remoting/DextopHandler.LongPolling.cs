using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Codaxy.Dextop.Remoting
{
    class LongPollingResult : PollingResult
    {
        public int nextStart { get; set; }
    }

	/// <summary>
	/// A HTTP handler responsible for long-polling results.
	/// </summary>
    public class DextopLongPollingHandler : DextopHandlerBase
    {
		/// <summary>
		/// Enables processing of HTTP Web requests by a custom HttpHandler that implements the <see cref="T:System.Web.IHttpHandler"/> interface.
		/// </summary>
		/// <param name="context">An <see cref="T:System.Web.HttpContext"/> object that provides references to the intrinsic server objects (for example, Request, Response, Session, and Server) used to service HTTP requests.</param>
        //public override void ProcessRequest(HttpContext context)
        //{
        //    LongPollingResult result;
        //    try
        //    {
        //        var session = GetSession(context);
        //        result = session.HandleLongPollingRequest(context);
        //    }
        //    catch (Exception ex)
        //    {
        //        //Application should handle the request and give a valid result.
        //        //Any exception is a sign that session is not valid anymore.
        //        result = new LongPollingResult
        //        {
        //            type = "rpc",
        //            name = "message",
        //            success = false,
        //            data = new DextopRemoteMethodCallException
        //            {
        //                exception = ex.Message,
        //                type = "session"
        //            }
        //        };
        //    }

        //    context.Response.ContentType = "application/json";
        //    DextopUtil.Encode(result, context.Response.Output);
        //}
        public override void ProcessRequest(HttpContext context)
        {
            throw new NotImplementedException();
        }

        DextopSession session;
        HttpContext context;
        Action<HttpContext, Exception> errorHandler;

        public override IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, object extraData)
        {
            try
            {
                this.context = context;
                this.session = GetSession(context);
                return session.BeginHandleLongPollingRequest(context, cb, extraData);
            }
            catch (Exception ex)
            {
                errorHandler = WriteException;
                return errorHandler.BeginInvoke(context, ex, cb, extraData);
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

        public override void EndProcessRequest(IAsyncResult asyncResult)
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
                    result = session.EndHandlingLongPollingRequest(asyncResult);
                }
                catch (Exception ex)
                {
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
    }
}
