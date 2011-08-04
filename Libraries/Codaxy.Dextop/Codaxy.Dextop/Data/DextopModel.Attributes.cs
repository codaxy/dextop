using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Mark that class is a model class.
	/// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple=false)]
    public class DextopModelAttribute : Attribute
    {
        /// <summary>
        /// Name of the id field. Alternatively, use DextopModelId attribute.
        /// </summary>
        public String Id { get; set; }

        /// <summary>
        /// Optinal custom model name
        /// </summary>
        public String Name { get; set; }
    }

    /// <summary>
    /// Mark field or property as Id.
    /// </summary>
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
    public class DextopModelIdAttribute : Attribute { }

    /// <summary>
    /// Exclude field or property from the model.
    /// </summary>
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
    public class DextopModelExcludeAttribute : Attribute { }

    

    /// <summary>
    /// Add model validation to field or property.
    /// </summary>
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
    public class DextopModelDefaultValueAttribute : Attribute
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopModelDefaultValueAttribute"/> class.
		/// </summary>
		/// <param name="value">The value.</param>
        public DextopModelDefaultValueAttribute(object value)
        {
            DefaultValue = value;
        }

		/// <summary>
		/// Gets or sets the default value.
		/// </summary>	
        public object DefaultValue { get; set; }
    }

}
