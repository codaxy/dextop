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
        class InvokeResult
        {
            public bool success { get; set; }
            public object result { get; set; }
        }

        class InvokeException
        {
            public string type { get; set; }
            public string exception { get; set; }
            public string stackTrace { get; set; }
        }    

        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var requests = GetActionRequest(context);
            var responses = new List<Response>();
            var invoker = DextopApi.Invoker;
            foreach (var request in requests)
            {
                InvokeResult result;

                try
                {
                    if (invoker == null)
                        throw new DextopException("Dextop API not initialized.");

                    var value = invoker.Invoke(request.data[0], request.data[1], request.data.Skip(2).ToArray());

                    result = new InvokeResult
                    {
                        result = value,
                        success = true
                    };
                }
                catch(Exception ex)
                {
                    result = new InvokeResult
                    {
                        success = false,
                        result = new InvokeException
                        {
                            exception = ex.Message,
                            stackTrace = ex.StackTrace
                        }
                    };
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
