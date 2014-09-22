using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Codaxy.Dextop.Direct;
using Newtonsoft.Json;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Api
{
    public class DextopApiHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var ajaxRequest = context.Request.QueryString["ajax"] == "1";
            if (ajaxRequest)
            {
                ProcessAjaxRequest(context);
                return;
            }

            var formSubmit = context.Request.QueryString["formSubmit"] == "1";
            var upload = formSubmit && context.Request.Form["extUpload"] == "true";

            var requests = upload ? GetUploadRequest(context) : GetActionRequest(context);

            var responses = new List<Response>();

            foreach (var request in requests)
            {
                DextopApiInvocationResult result;
                try
                {
                    using (var apiContext = DextopApi.Resolve<DextopApiContext>())
                    {
                        var controllerType = Type.GetType(request.data[0]);
                        apiContext.Scope = DextopUtil.Decode<DextopConfig>(request.data[1]);
                        apiContext.HttpContext = new HttpContextWrapper(context);
                        var controller = apiContext.ResolveController(controllerType);
                        controller.OnInitialize();

                        try
                        {
                            controller.OnExecuting();
                            result = controller.Invoke(request.data[2], request.FormSubmit, DextopUtil.Decode<string[]>(request.data[3]));
                            controller.OnExecuted();
                        }
                        catch (Exception ex)
                        {
                            controller.OnError(ex);
                            throw;
                        }
                    }
                }
                catch (Exception ex)
                {
                    result = DextopApiInvocationResult.Exception(ex);
                }

                var response = new Response
                {
                    action = request.action,
                    method = request.method,
                    type = request.type,
                    tid = request.tid,
                    result = result
                };

                responses.Add(response);
            }

            DextopUtil.Encode(responses, context.Response.Output);
        }

        public void ProcessAjaxRequest(HttpContext context)
        {
            var controllerTypeString = context.Request.QueryString["_apiControllerType"];
            var controllerType = Type.GetType(controllerTypeString);
            try
            {
                using (var apiContext = DextopApi.Resolve<DextopApiContext>())
                {
                    if (context.Request.QueryString["_apiScope"] != null)
                        apiContext.Scope = DextopUtil.Decode<DextopConfig>(context.Request.QueryString["_apiScope"]);

                    apiContext.HttpContext = new HttpContextWrapper(context); 
                    var controller = apiContext.ResolveController(controllerType);
                    try
                    {
                        controller.OnProcessAjaxRequest(context);
                    }
                    catch (Exception ex)
                    {
                        controller.OnError(ex);
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
            }

        }

        public static bool UseBufferlessInputStream { get; set; }

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
            parameters.Add(context.Request.Form["_apiControllerType"]);
            parameters.Add(context.Request.Form["_apiScope"]);
            parameters.Add(context.Request.Form["_apiMethod"]);
            parameters.Add(context.Request.Form["_apiArguments"]);

            var formSumbit = new DextopFormSubmit
            {
                Files = files,
                Context = context,
                FieldValuesJSON = context.Request["_apiFieldValues"]
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
    }
}
