using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Direct;
using System.Reflection;
using System.IO;
using System.Threading;
using Newtonsoft.Json;
using System.Diagnostics;

namespace Codaxy.Dextop.Remoting
{
	/// <summary>
	/// A HTTP handler responsible for Ext.direct requests.
	/// </summary>
    public class DextopRemotingHandler : IHttpHandler
    {
		/// <summary>
		/// Enables processing of HTTP Web requests by a custom HttpHandler that implements the <see cref="T:System.Web.IHttpHandler"/> interface.
		/// </summary>
		/// <param name="context">An <see cref="T:System.Web.HttpContext"/> object that provides references to the intrinsic server objects (for example, Request, Response, Session, and Server) used to service HTTP requests.</param>
        public void ProcessRequest(HttpContext context)
        {
            var ajax = context.Request.QueryString["ajax"] == "1";
            if (ajax)
            {
                try
                {
                    var session = GetSession(context);
                    session.HandleAjaxRequest(context);                    
                }
                catch(Exception ex)
                {
                    Debug.WriteLine(ex.ToString());
                }

                return;
            }

            try
            {
                var formSubmit = context.Request.QueryString["formSubmit"] == "1";
                var upload = formSubmit && context.Request.Form["extUpload"] == "true";

                var requests = upload ? GetUploadRequest(context) : GetActionRequest(context);

                IList<Response> result;
                try
                {
                    var session = GetSession(context);					
                    result = session.HandleRemotingRequest(context, requests);
                }
                catch (Exception ex)
                {
                    //Application should handle the request and give a valid result.
                    //Any exception is a sign that session is not valid anymore.
                    result = requests.Select(a => new Response
                    {
                        action = a.action,
                        method = a.method,
                        tid = a.tid,
                        type = a.type,
                        result = new DextopRemoteMethodCallResult
                        {
                            success = false,
                            result = new DextopRemoteMethodCallException
                            {
                                exception = ex.Message,
                                type = "session"
                            }
                        }
                    }).ToArray();
                }

                context.Response.ContentType = upload ? "text/html" : "application/json";
                DextopUtil.Encode(result, context.Response.Output);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                DextopUtil.Encode(new DextopRemoteMethodCallResult
                {
                    success = false,
                    result = new DextopRemoteMethodCallException
                    {
                        exception = ex.Message
                    }
                }, context.Response.Output);
            }
        }

        public bool IsReusable { get { return true; } }

        Request[] GetUploadRequest(HttpContext context)
        {
            var files = new Dictionary<String, DextopFile>();
            for (var i = 0; i < context.Request.Files.Count; i++)
            {
                if (context.Request.Files[i].ContentLength > 0)
                {
                    var fi = new FileInfo(context.Request.Files[i].FileName);
                    files.Add(context.Request.Files.AllKeys[i], new DextopFile
                    {
                        FileStream = context.Request.Files[i].InputStream,
                        FileLength = context.Request.Files[i].ContentLength,
                        FileName = fi.Name,
                        FileExtension = fi.Extension,
                        ContentType = context.Request.Files[i].ContentType
                    });
                }
            }

            List<String> parameters = new List<string>();
            parameters.Add(context.Request.Form["_rcpId"]);
            parameters.Add(context.Request.Form["_rcpMethod"]);
            parameters.Add(context.Request.Form["_rcpArguments"]);

            var formSumbit = new DextopFormSubmit
            {
                Files = files,
                Context = context,
                FieldValuesJSON = context.Request["_rcpFieldValues"]
            };

            var request = new Request
            {
                tid = int.Parse(context.Request.Form["extTID"]),
                action = context.Request.Form["extAction"],
                method = context.Request.Form["extMethod"],
                type = context.Request.Form["extType"],
                FormSubmit = formSumbit,
                data = parameters.ToArray(),
                RequestType = RequestType.FormSubmit
            };

            return new[] { request };
        }

        /// <summary>
        /// This method provides an alternative to using the InputStream property. 
        /// The InputStream property waits until the whole request has been received before it returns a Stream object. In contrast, the GetBufferlessInputStream method returns the Stream object immediately. You can use the method to begin processing the entity body before the complete contents of the body have been received.
        /// NOTE: This method has unresolved IE problems.
        /// </summary>
        public static bool UseBufferlessInputStream { get; set; }

        Request[] GetActionRequest(HttpContext context)
        {
            var stream = UseBufferlessInputStream ? context.Request.GetBufferlessInputStream() : context.Request.InputStream;
            using (stream)
            using (var tr = new StreamReader(stream))
            using (var jr = new JsonTextReader(tr))
            {
                var js = new JsonSerializer();
                if (!jr.Read())
                    return new Request[0];
                if (jr.TokenType == JsonToken.StartObject)
                    return new[] { js.Deserialize<Request>(jr) };
                return js.Deserialize<Request[]>(jr);
            }
        }

        DextopSession GetSession(HttpContext context)
        {
            var appKey = context.Request.QueryString["app"];
            var app = DextopApplication.GetApplication(appKey);
            var sessionId = context.Request.QueryString["sid"];
            var session = app.GetSession(sessionId);
            return session;
        }
    }        
}
