using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Direct;
using System.Web;
using Newtonsoft.Json;

namespace Codaxy.Dextop.Remoting
{
	/// <summary>
	/// Special class containing the data associated with form submission.
	/// </summary>
    public class DextopFormSubmit
    {
		/// <summary>
		/// Gets or sets the files.
		/// </summary>		        
        public Dictionary<String, DextopFile> Files { get; set; }
		
		/// <summary>
		/// Gets or sets the HTTP context.
		/// </summary>		        
        public HttpContext Context { get; set; }
        
        /// <summary>
        /// Gets the JSON encoded values of form fields.
        /// </summary>
        public String FieldValuesJSON { get; set; }

        /// <summary>
        /// Decode JSON field values to a specified type. Files are also mapped.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T DecodeForm<T>()
        {
            var type = typeof(T);
            var form = DextopUtil.Decode<T>(FieldValuesJSON);
            foreach (var file in Files)
            {
                var property = type.GetProperty(file.Key);
                if (property.PropertyType == typeof(DextopFile))
                    property.SetValue(form, file.Value, null);
            }
            return form;
        }
    }

	/// <summary>
	/// This class represents the result of remote method invocation.
	/// </summary>
	public class DextopRemoteMethodInvokeResult
	{
		/// <summary>
		/// Value indicating whether method invocation finished successfully.
		/// </summary>		
		public bool Success { get; set; }

		/// <summary>
		/// Return value of the method invocation. Used if Success property is set to true.
		/// </summary>
		public object Result { get; set; }

		/// <summary>
		/// Exception thrown by the method. Used if Success property is set to false.
		/// </summary>
		public Exception Exception { get; set; }
	}

	/// <summary>
	/// Custom remotable method invocation mechanism implementation.
	/// Every implementation should support Dispose method call.
	/// Implementation should catch all TargetInvocationExceptions and return inner exceptions.
	/// </summary>
    public interface IDextopRemotableMethodInvoker
    {
        /// <summary>
        /// Invokes the specified method.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <param name="methodName">Name of the method.</param>
        /// <param name="methodArguments">The method arguments.</param>
        /// <param name="form">The form submitted.</param>
        /// <returns>Result of invocation.</returns>
        DextopRemoteMethodInvokeResult Invoke(IDextopRemotable target, String methodName, String[] methodArguments, DextopFormSubmit form);
    }
}
