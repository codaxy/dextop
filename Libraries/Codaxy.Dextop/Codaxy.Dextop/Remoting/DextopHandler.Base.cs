using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Codaxy.Dextop.Remoting
{
	/// <summary>
	/// Base class providing utility methods for Dextop HTTP handlers.
	/// </summary>
    public abstract class DextopHandlerBase : IHttpAsyncHandler
    {
		/// <summary>
		/// Enables processing of HTTP Web requests by a custom HttpHandler that implements the <see cref="T:System.Web.IHttpHandler"/> interface.
		/// </summary>
		/// <param name="context">An <see cref="T:System.Web.HttpContext"/> object that provides references to the intrinsic server objects (for example, Request, Response, Session, and Server) used to service HTTP requests.</param>
        public abstract void ProcessRequest(HttpContext context);

		/// <summary>
		/// Gets a value indicating whether another request can use the <see cref="T:System.Web.IHttpHandler"/> instance.
		/// </summary>
		/// <returns>true if the <see cref="T:System.Web.IHttpHandler"/> instance is reusable; otherwise, false.</returns>
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

		/// <summary>
		/// Gets the Dextop session associated with the request.
		/// </summary>
		/// <param name="context">The context.</param>
		/// <returns></returns>
        protected DextopSession GetSession(HttpContext context)
        {
            var appKey = context.Request.QueryString["app"];
            var app = DextopApplication.GetApplication(appKey);
            var sessionId = context.Request.QueryString["sid"];
            var session = app.GetSession(sessionId);
            return session;
        }

        Action<HttpContext> processRequestAction;

		/// <summary>
		/// Initiates an asynchronous call to the HTTP handler.
		/// </summary>
		/// <param name="context">An <see cref="T:System.Web.HttpContext"/> object that provides references to intrinsic server objects (for example, Request, Response, Session, and Server) used to service HTTP requests.</param>
		/// <param name="cb">The <see cref="T:System.AsyncCallback"/> to call when the asynchronous method call is complete. If <paramref name="cb"/> is null, the delegate is not called.</param>
		/// <param name="extraData">Any extra data needed to process the request.</param>
		/// <returns>
		/// An <see cref="T:System.IAsyncResult"/> that contains information about the status of the process.
		/// </returns>
        public IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, object extraData)
        {
            processRequestAction = ProcessRequest;
            return processRequestAction.BeginInvoke(context, cb, extraData);
        }

		/// <summary>
		/// Provides an asynchronous process End method when the process ends.
		/// </summary>
		/// <param name="result">An <see cref="T:System.IAsyncResult"/> that contains information about the status of the process.</param>
        public void EndProcessRequest(IAsyncResult result)
        {
            processRequestAction.EndInvoke(result);
        }
    }
}
