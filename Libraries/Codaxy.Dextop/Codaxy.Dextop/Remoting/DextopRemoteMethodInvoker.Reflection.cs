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

        enum ConstructorArgments { 
            Default = 1, //priority
            Hash = 0, 
            Array = 2 };

        class RemotableConstructor
        {
            public ConstructorInfo ConstructorInfo { get; set; }
            public ParameterInfo[] Args { get; set; }
            public Func<object, object[]> Delegate { get; set; }
            public int InvokeCount { get; set; }

            ConstructorArgments? _at;

            public ConstructorArgments ArgumentsType
            {
                get { if (!_at.HasValue) _at = DetermineArgumentsType(); return _at.Value; }
            }

            private ConstructorArgments DetermineArgumentsType()
            {
                if (Args == null || Args.Length == 0)
                    return ConstructorArgments.Default;

                if (Args.Length == 1 && typeof(DextopConfig).IsAssignableFrom(Args[0].ParameterType))
                    return ConstructorArgments.Hash;

                return ConstructorArgments.Array;
            }
        }
        
        readonly static ConcurrentDictionary<String, RemotableMethod> methodCache = new ConcurrentDictionary<string, RemotableMethod>();
        readonly static ConcurrentDictionary<String, List<RemotableConstructor>> constructorCache = new ConcurrentDictionary<string, List<RemotableConstructor>>();
        readonly static ConcurrentDictionary<String, String> constructorAliasType = new ConcurrentDictionary<string, string>();

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

            CacheRemotableConstructor(typeName, m);

            var ca = att as DextopRemotableConstructorAttribute;
            if (ca != null && ca.alias != null && ca.alias != typeName)
                CacheRemotableConstructor(ca.alias, m);
        }

        static void CacheRemotableConstructor(String aliasOrTypeName, RemotableConstructor c)
        {
            List<RemotableConstructor> list;
            if (!constructorCache.TryGetValue(aliasOrTypeName, out list))
                constructorCache.TryAdd(aliasOrTypeName, list = new List<RemotableConstructor>());

            if (list.Count > 0 && list[0].ConstructorInfo.DeclaringType != c.ConstructorInfo.DeclaringType)
                throw new DextopException("Remotable constructor clash detected. Constructors for remotable types '{0}' and '{1} have the same alias '{2}'. Change alias for one of the types.", list[0].ConstructorInfo.DeclaringType, c.ConstructorInfo.DeclaringType, aliasOrTypeName);

            list.Add(c);
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
                
                if (options.type == null)
                    throw new InvalidDextopRemoteMethodCallException();

                List<RemotableConstructor> constructors;

                if (!constructorCache.TryGetValue(options.type, out constructors))
                    constructors = LoadRemotableConstructors(options.type);

                if (constructors.Count==0)
                    throw new InvalidDextopRemoteMethodCallException();
                
                object[] args;
                RemotableConstructor c;

                if (config == null)
                {
                    args = new object[0];
                    c = constructors.FirstOrDefault(a => a.ArgumentsType == ConstructorArgments.Default);
                    if (c == null)
                    {
                        c = constructors.FirstOrDefault(a => a.ArgumentsType == ConstructorArgments.Hash);
                        args = new object[1];
                    }
                }
                else if (config.StartsWith("["))
                {
                    var argss = DextopUtil.Decode<String[]>(config);
                    c = constructors.Where(a => a.ArgumentsType == ConstructorArgments.Array && a.Args.Length >= argss.Length).OrderBy(a => a.Args.Length).FirstOrDefault();
                    if (c == null)
                        c = constructors.Where(a => a.ArgumentsType == ConstructorArgments.Array).OrderByDescending(a => a.Args.Length).FirstOrDefault();
                    if (c == null)
                        c = constructors.FirstOrDefault(a => a.ArgumentsType == ConstructorArgments.Hash);
                    if (c == null)
                        c = constructors.FirstOrDefault(a => a.ArgumentsType == ConstructorArgments.Default);

                    if (c == null)
                        throw new InvalidDextopRemoteMethodCallException();

                    args = new object[c.Args.Length];
                    for (var i = 0; i < c.Args.Length && i < argss.Length; i++)
                        args[i] = DextopUtil.DecodeValue(argss[i], c.Args[i].ParameterType);
                }
                else if (config.StartsWith("{"))
                {
                    c = constructors.FirstOrDefault(a => a.ArgumentsType == ConstructorArgments.Hash);
                    if (c != null)
                    {
                        args = new object[1] { DextopUtil.Decode(config, c.Args[0].ParameterType) };
                    }
                    else
                    {
                        var configs = DextopUtil.Decode<Dictionary<String, String>>(config) ?? new Dictionary<String, String>();
                        var candidates = constructors.Select(a => new
                        {
                            Constructor = a,
                            ArgumentMatch = a.Args.Count(b => configs.ContainsKey(b.Name))
                        }).OrderByDescending(x => x.ArgumentMatch).ToArray();

                        c = null;
                        foreach (var cand in candidates)
                        {
                            if (cand.ArgumentMatch == configs.Count && cand.Constructor.Args.Length == cand.ArgumentMatch)
                            {
                                c = cand.Constructor;
                                break;
                            }
                        }

                        if (c == null) // if we still don't have a match take the candidate with the biggest number of matching arguments, and prefer parameterless constructor if zero
                            c = candidates.OrderByDescending(a => a.ArgumentMatch).ThenBy(a => (int)a.Constructor.ArgumentsType).First().Constructor;

                        args = new object[c.Args.Length];
                        for (var i = 0; i < c.Args.Length; i++)
                        {
                            String argString;
                            if (configs.TryGetValue(c.Args[i].Name, out argString))
                                args[i] = DextopUtil.Decode(argString, c.Args[i].ParameterType);
                        }
                    }
                }
                else
                {
                    c = constructors.Where(a => a.ArgumentsType == ConstructorArgments.Array && a.Args.Length >= 1).OrderBy(a => a.Args.Length).FirstOrDefault();
                    if (c == null)
                        throw new InvalidDextopRemoteMethodCallException();
                    args = new object[c.Args.Length];
                    args[0] = DextopUtil.DecodeValue(config, c.Args[0].ParameterType);
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

        private List<RemotableConstructor> LoadRemotableConstructors(string alias)
        {
            String typeName;
            if (!constructorAliasType.TryGetValue(alias, out typeName))
                throw new InvalidDextopRemoteMethodCallException();
            var type = Type.GetType(typeName);
            foreach (var mi in type.GetConstructors(BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance))
            {
                DextopRemotableAttribute ra;
                if (AttributeHelper.TryGetAttribute<DextopRemotableAttribute>(mi, out ra, false))
                {
                    CacheConstructorInfo(alias, mi, ra);
                }
            }
            String dummy;
            constructorAliasType.TryRemove(alias, out dummy);
            List<RemotableConstructor> res;
            if (constructorCache.TryGetValue(alias, out res))
                return res;
            
            throw new InvalidDextopRemoteMethodCallException();
        }

        internal void RegisterTypeAlias(string alias, string fullTypeName)
        {
            if (!constructorAliasType.TryAdd(alias, fullTypeName))
            {
                String oldTypeName;
                if (constructorAliasType.TryGetValue(alias, out oldTypeName) && oldTypeName != fullTypeName)
                    throw new DextopException("Cannot register types '{0}' and '{1}' under the same alias '{2}'.", oldTypeName, fullTypeName, alias);
            }
        }
    }
}
