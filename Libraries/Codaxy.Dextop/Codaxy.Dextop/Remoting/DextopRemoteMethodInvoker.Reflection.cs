using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Collections.Concurrent;
using Codaxy.Common.Reflection;

namespace Codaxy.Dextop.Remoting
{
    /// <summary>
    /// 
    /// </summary>
    class ReflectionRemoteMethodInvoker : IDextopRemotableMethodInvoker
    {
        class RemotableMethod
        {
            public MethodInfo MethodInfo { get; set; }
            public Type[] Args { get; set; }
            public Func<object, object[]> Delegate { get; set; }
            public int InvokeCount { get; set; }
        }

        class RemotableConstructor
        {
            public ConstructorInfo ConstructorInfo { get; set; }
            public ParameterInfo[] Args { get; set; }
            public Func<object, object[]> Delegate { get; set; }
            public int InvokeCount { get; set; }
        }
        
        readonly static ConcurrentDictionary<String, RemotableMethod> methodCache = new ConcurrentDictionary<string, RemotableMethod>();
        readonly static ConcurrentDictionary<String, RemotableConstructor> constructorCache = new ConcurrentDictionary<string, RemotableConstructor>();        

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

        internal static void CacheMethodInfo(MethodInfo methodInfo, DextopRemotableAttribute att)
        {
            CacheRemotableMethod(methodInfo, att);
        }

        internal static void CacheConstructorInfo(String typeName, ConstructorInfo methodInfo, DextopRemotableAttribute att)
        {
            var m = new RemotableConstructor
            {
                ConstructorInfo = methodInfo,
                Args = methodInfo.GetParameters().ToArray()
            };
            constructorCache.TryAdd(typeName, m);
            var ca = att as DextopRemotableConstructorAttribute;
            if (ca!=null && ca.alias!=null)
            {
                constructorCache.TryAdd(ca.alias, m);
            }
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
            if (methodName == "Instantiate" && arguments.Length>0)            
                return Instantiate(target, arguments);

            if (methodName == "Dispose")
            {
                try
                {
                    target.Dispose();
                    return new DextopRemoteMethodInvokeResult { Success = true };
                }
                catch (Exception ex)
                {
                    return new DextopRemoteMethodInvokeResult { Success = false, Exception = ex };
                }
            }
            
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

        class InstantiateOptions
        {
            public bool? subRemote { get; set; }
            public string type { get; set; }
            public string remoteId { get; set; }
            public bool? own { get; set; }
        }

        DextopRemoteMethodInvokeResult Instantiate(IDextopRemotable target, String[] arguments)
        {
            try
            {
                if (arguments.Length<1)
                    throw new InvalidDextopRemoteMethodCallException();
                InstantiateOptions options;               
                if (arguments[0]!=null && arguments[0].StartsWith("{"))
                    options = DextopUtil.Decode<InstantiateOptions>(arguments[0]);
                else
                    options = new InstantiateOptions
                    {
                        subRemote = true,
                        type = arguments[0]
                    };

                if (options.type == null)
                    throw new InvalidDextopRemoteMethodCallException();                

                String config = null;
                if (arguments.Length > 1)
                    config = arguments[1];

                RemotableConstructor c;
                if (options.type == null || !constructorCache.TryGetValue(options.type, out c))
                    throw new InvalidDextopRemoteMethodCallException();
                object[] args;
                if (c.Args == null || c.Args.Length == 0)
                    args = new object[0];
                else if (c.Args.Length == 1 && c.Args[0].ParameterType == typeof(DextopConfig))
                {
                    var rc = DextopUtil.Decode(config, c.Args[0].ParameterType);
                    args = new object[] { rc };
                }
                else
                {
                    args = new object[c.Args.Length];
                    if (config == null)
                    {

                    }
                    else if (config.StartsWith("["))
                    {
                        var argss = DextopUtil.Decode<String[]>(config);
                        for (var i = 0; i < c.Args.Length && i < argss.Length; i++)
                            args[i] = DextopUtil.DecodeValue(argss[i], c.Args[i].ParameterType);
                    }
                    else
                    {
                        var configs = DextopUtil.Decode<Dictionary<String, String>>(config) ?? new Dictionary<String, String>();
                        for (var i = 0; i < c.Args.Length; i++)
                        {
                            String argString;
                            if (configs.TryGetValue(c.Args[i].Name, out argString))
                                args[i] = DextopUtil.Decode(argString, c.Args[i].ParameterType);
                        }
                    }
                }

                var remotable = (IDextopRemotable)c.ConstructorInfo.Invoke(args);

                try
                {
                    return new DextopRemoteMethodInvokeResult
                    {
                        Success = true,
                        Result = target.Remote.TrackRemotableComponent(remotable, 
                            remoteId: options.remoteId, 
                            subRemote: options.subRemote ?? true, 
                            own : options.own ?? true
                        )               
                    };
                }
                catch
                {
                    remotable.Dispose();
                    throw;
                }                
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
