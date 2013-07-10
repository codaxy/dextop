using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Codaxy.Dextop.Direct;
using Newtonsoft.Json;

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
            var requests = GetActionRequest(context);
            var responses = new List<Response>();

            var invoker = DextopApi.Resolve<IDextopApiInvoker>();
            

            foreach (var request in requests)
            {
                DextopApiInvocationResult result;
                try
                {
                    if (invoker == null)
                        throw new DextopException("Dextop API not initialized.");

                    var apiContext = DextopApi.Resolve<DextopApiContext>();

                    var type = Type.GetType(request.data[0]);
                    apiContext.Scope = DextopUtil.Decode<DextopConfig>(request.data[1]);
                    apiContext.HttpContext = new HttpContextWrapper(context);                    

                    var controller = (DextopApiController)apiContext.ResolveScoped(type);

                    controller.OnInitialize();

                    try
                    {
                        result = invoker.Invoke(controller, request.data[2], DextopUtil.Decode<string[]>(request.data[3]));
                    }
                    catch (Exception ex)
                    {
                        controller.OnError(ex);
                        throw;
                    }
                }
                catch(Exception ex)
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
    }
}
