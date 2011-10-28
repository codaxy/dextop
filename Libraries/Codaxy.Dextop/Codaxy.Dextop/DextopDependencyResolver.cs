using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Defines the methods that simplify service location and dependency resolution.
	/// </summary>
	public class DextopDependencyResolver : IDextopDependencyResolver
	{
		List<IDextopDependencyResolver> resolvers;
		Dictionary<Type, Func<DextopDependencyResolver, object[]>> factory;

		/// <summary>
		/// Adds a resolver to a list of resolvers.
		/// </summary>
		/// <param name="resolver">The resolver.</param>
		public void RegisterResolver(IDextopDependencyResolver resolver)
		{
			if (resolvers == null)
				resolvers = new List<IDextopDependencyResolver>();
			resolvers.Add(resolver);
		}

		/// <summary>
		/// Register service instance.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="instance"></param>
		public void RegisterInstance<T>(T instance)
		{
            Register<T>((resolver) => { return instance; });
		}

		/// <summary>
		/// Register service resolver callback.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="resolve"></param>
		public void Register<T>(Func<DextopDependencyResolver, T> resolve)
		{
			if (factory == null)
				factory = new Dictionary<Type, Func<DextopDependencyResolver, object[]>>();
			factory.Add(typeof(T), (resolver) => { return new object[] { resolve(this) }; });
		}

		/// <summary>
		/// Resolves singly registered services that support arbitrary object creation.
		/// </summary>
		/// <param name="type"></param>
		/// <returns></returns>
		public object GetService(Type type)
		{
			if (factory != null)
			{
				Func<DextopDependencyResolver, object[]> f;
				if (factory.TryGetValue(type, out f))
					return f(this).First();
			}
			if (resolvers != null)
				foreach (var r in resolvers)
				{
					var service = r.GetService(type);
					if (service != null)
						return service;
				}
			throw new DextopException("Could not resolve service of type '{0}'.", type);
		}

		IEnumerable<object> EnumerateServices(Type type)
		{
			List<object> result = new List<object>();

			if (factory != null)
			{
				Func<DextopDependencyResolver, object[]> f;
				if (factory.TryGetValue(type, out f))
					result.AddRange(f(this));
			}

			if (resolvers != null)
				foreach (var r in resolvers)
				{
					object[] services = r.GetServices(type);
					if (services != null)
						result.AddRange(services);
				}

			return result;
		}


		/// <summary>
		/// Resolves multiply registered services.
		/// </summary>
		/// <param name="type"></param>
		/// <returns></returns>
		public object[] GetServices(Type type)
		{
			return EnumerateServices(type).ToArray();
		}

		/// <summary>
		/// Resolves singly registered services.
		/// </summary>		
		public T GetService<T>()
		{
			return (T)GetService(typeof(T));			
		}

		/// <summary>
		/// Resolves multiply registered services.
		/// </summary>
		public T[] GetServices<T>()
		{
			return EnumerateServices(typeof(T)).Select(a => (T)a).ToArray();
		}
	}
}
