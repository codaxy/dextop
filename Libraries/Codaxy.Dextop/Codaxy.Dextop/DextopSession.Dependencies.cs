using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	public partial class DextopSession : IDextopDependencyResolver
	{
		DextopDependencyResolver _dr;

        /// <summary>
        /// Session's dependency resolver.
        /// </summary>
		protected DextopDependencyResolver DependencyResolver { get { return _dr ?? (_dr = new DextopDependencyResolver()); } }

		/// <summary>
		/// Registers all services on which session depends.
		/// </summary>
		protected virtual void RegisterDependencies()
		{
            
		}

        /// <summary>
        /// Resolves singly registered services that support arbitrary object creation.
        /// </summary>
        public object GetService(Type type)
        {
            return DependencyResolver.GetService(type);
        }

        /// <summary>
        /// Resolves multiply registered services.
        /// </summary>
        public object[] GetServices(Type type)
        {
            return DependencyResolver.GetServices(type);
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
            return GetServices(typeof(T)).Select(a => (T)a).ToArray();
        }
    }
}
