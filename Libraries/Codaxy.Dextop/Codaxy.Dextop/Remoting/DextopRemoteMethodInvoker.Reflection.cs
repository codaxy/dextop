using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Collections.Concurrent;
using Codaxy.Common.Reflection;

namespace Codaxy.Dextop.Remoting
{
    class ReflectionRemoteMethodInvoker : IDextopRemotableMethodInvoker
    {
        class RemotableMethod
        {
            public MethodInfo MethodInfo { get; set; }
            public Type[] Args { get; set; }
            public Func<object, object[]> Delegate { get; set; }
            public int InvokeCount { get; set; }
        }
        
        readonly static ConcurrentDictionary<String, RemotableMethod> methodCache = new ConcurrentDictionary<string, RemotableMethod>();

        RemotableMethod GetMethod(Type type, String methodName)
        {
            if (methodName == null)
                throw new InvalidDextopRemoteMethodCallException();

            var fullMethodName = type.FullName + "." + methodName;

            RemotableMethod m;
            if (methodCache.TryGetValue(fullMethodName, out m))
                return m;

            MethodInfo method = type.GetMethod(methodName, BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy);
            
            if (method == null)
                throw new InvalidDextopRemoteMethodCallException();
            
            DextopRemotableAttribute ra;
            if (!AttributeHelper.TryGetAttribute<DextopRemotableAttribute>(method, out ra, false))
                throw new InvalidDextopRemoteMethodCallException();
            
            return CacheRemotableMethod(method, ra);
        }

        public static void CacheMethodInfo(MethodInfo methodInfo, DextopRemotableAttribute att)
        {
            CacheRemotableMethod(methodInfo, att);
        }

        static RemotableMethod CacheRemotableMethod(MethodInfo methodInfo, DextopRemotableAttribute att)
        {
            var m = new RemotableMethod
            {
                MethodInfo = methodInfo,
                Args = methodInfo.GetParameters().Select(a => a.ParameterType).ToArray()
            };
            methodCache.TryAdd(methodInfo.ReflectedType.FullName + "." + methodInfo.Name, m);
            return m;
        }

		public DextopRemoteMethodInvokeResult Invoke(IDextopRemotable target, string methodName, string[] arguments, DextopFormSubmit form)
        {
			try
			{                
				var type = target.GetType();
                var method = GetMethod(type, methodName);
                ++method.InvokeCount;
				int offset = form == null ? 0 : 1;
				object[] args = new object[method.Args.Length];
				if (form != null)
					args[0] = form;
				if (arguments.Length + offset != method.Args.Length)
					throw new DextopException("Invalid number of arguments for a remote method call.");
				for (var i = 0; i < arguments.Length; i++)
					args[i + offset] = DextopUtil.DecodeValue(arguments[i], method.Args[i + offset]);
				var result = method.MethodInfo.Invoke(target, args);
				return new DextopRemoteMethodInvokeResult
				{
					Success = true,
					Result = result
				};
			}
			catch (TargetInvocationException tix)
			{
				return new DextopRemoteMethodInvokeResult
				{
					Success = false,
					Exception = tix.InnerException ?? tix
				};
			}
			catch (Exception ex)
			{
				return new DextopRemoteMethodInvokeResult
				{
					Success = false,
					Exception = ex
				};
			}
        }
    }
}
