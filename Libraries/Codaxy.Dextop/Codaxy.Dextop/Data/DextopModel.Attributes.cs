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
    ///Override some of the default values to field or property.
    /// </summary>
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
    public class DextopModelFieldAttribute : Attribute
    {
        /// <summary>
        /// 
        /// </summary>
        public DextopModelFieldAttribute()
        {
            persist = true;
        }

        /// <summary>
		/// Gets or sets the default value.
		/// </summary>	
        public object defaultValue { get; set; }

        /// <summary>
        /// A function which converts the value provided by the Reader into an object that will be stored in the Model.
        /// </summary>
        public string convert { get; set; }

        /// <summary>
        /// Used when converting received data into a Date when the type is specified as "date".
        /// </summary>
        public string dateFormat { get; set; }

        /// <summary>
        /// A path expression for use by the Ext.data.reader.Reader implementation that is creating the Model to extract the Field value from the data object. If the path expression is the same as the field name, the mapping may be omitted.
        /// </summary>
        public string mapping { get; set; }

        /// <summary>
        /// False to exclude this field from the Ext.data.Model.modified fields in a model. This will also exclude the field from being written using a Ext.data.writer.Writer. This option is useful when model fields are used to keep state on the client but do not need to be persisted to the server. Defaults to true.
        /// </summary>
        public bool persist { get; set; }

        /// <summary>
        /// Initial direction to sort ("ASC" or "DESC"). Defaults to "ASC".
        /// </summary>
        public string sortDir { get; set; }

        /// <summary>
        /// A function which converts a Field's value to a comparable value in order to ensure correct sort ordering. 
        /// </summary>
        public string sortType { get; set; }

        /// <summary>
        /// The data type for automatic conversion from received data to the stored value if convert has not been specified. 
        /// </summary>
        public string type { get; set; }        

        /// <summary>
        /// Use when converting received data into a Number type (either int or float). If the value cannot be parsed, null will be used if useNull is true, otherwise the value will be 0. Defaults to false.
        /// </summary>
        public bool useNotNull { get; set; }
    }  

}
