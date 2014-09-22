using Codaxy.Dextop.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Codaxy.Dextop.Api
{
    public interface IDextopApiActionInvoker
    {        
        DextopApiInvocationResult Invoke(String action, String[] arguments, DextopFormSubmit form);
    }

    public class DextopApiInvocationResult
    {
        public bool success { get; set; }
        public object result { get; set; }

        public static DextopApiInvocationResult Success(object result = null) { return new DextopApiInvocationResult { success = true, result = result }; }
        public static DextopApiInvocationResult Exception(Exception ex) { return new DextopApiInvocationResult { success = false, result = new DextopApiInvocationError(ex) }; }
    }

    public class DextopApiInvocationError
    {
        public string type { get; set; }
        public string exception { get; set; }
        public string stackTrace { get; set; }

        public DextopApiInvocationError(Exception ex)
        {
            while (ex is TargetInvocationException && ex.InnerException != null)
                ex = ex.InnerException;

            exception = ex.Message;
            if (ex is DextopMessageException)
            {
                type = ((DextopMessageException)ex).Type.ToString().ToLower();
            }
            else
                stackTrace = ex.StackTrace;
        }
    }

    class StandardActionInvoker : IDextopApiActionInvoker
    {
        DextopApiController controller;
        
        public StandardActionInvoker(DextopApiController controller)
        {
            this.controller = controller;
        }

        public DextopApiInvocationResult Invoke(string action, string[] arguments, DextopFormSubmit form)
        {
            var method = controller.GetType().GetMethod(action);
            if (method == null)
                throw new DextopException("Cannot find method '{0}' in controller type '{1}'.", action, controller.GetType());

            var parameters = method.GetParameters();
            var p = new object[parameters.Length];

            int offset = form == null ? 0 : 1;
            
            if (form != null)
                p[0] = form;
            
            for (var i = 0; i < Math.Min(p.Length, arguments.Length); i++)
                p[i + offset] = DextopUtil.DecodeValue(arguments[i], parameters[i + offset].ParameterType);

            try
            {
                var value = method.Invoke(controller, p);
                return DextopApiInvocationResult.Success(value);
            }            
            catch (Exception ex)
            {
                return DextopApiInvocationResult.Exception(ex);
            }
        }
    }
}
