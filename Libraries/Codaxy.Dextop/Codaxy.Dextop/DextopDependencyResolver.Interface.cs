using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Defines the methods that simplify service location and dependency resolution.
	/// </summary>
	public interface IDextopDependencyResolver
	{
		/// <summary>
		/// Resolves singly registered services that support arbitrary object creation.
		/// </summary>
		/// <param name="type"></param>
		/// <returns></returns>
		object GetService(Type type);


        /// <summary>
        /// Resolves singly registered services that support arbitrary object creation.
        /// </summary>        
        /// <returns></returns>
        T GetService<T>();

		/// <summary>
		/// Resolves multiply registered services.
		/// </summary>
		/// <param name="type"></param>
		/// <returns></returns>
		object[] GetServices(Type type);

        /// <summary>
        /// Resolves multiply registered services.
        /// </summary>                
        T[] GetServices<T>();
	}
}
