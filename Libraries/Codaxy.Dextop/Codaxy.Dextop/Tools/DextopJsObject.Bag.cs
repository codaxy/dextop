using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Tools
{
	/// <summary>
	/// Expando JS object
	/// </summary>
    public class DextopJsBag : IDextopJsObject
    {
        readonly Dictionary<String, object> data;


		/// <summary>
		/// Initializes a new instance of the <see cref="DextopJsBag"/> class.
		/// </summary>
        public DextopJsBag()
        {
            data = new Dictionary<string, object>();
        }

		/// <summary>
		/// Determines whether this instance is empty.
		/// </summary>
		/// <returns>
		///   <c>true</c> if this instance is empty; otherwise, <c>false</c>.
		/// </returns>
		public bool IsEmpty() { return data.Count == 0; }

		/// <summary>
		/// Gets the properties in the bag.
		/// </summary>
		public Dictionary<String, object> Properties { get { return data; } }

		/// <summary>
		/// Gets or sets the value with the specified property name.
		/// </summary>
        public object this[string propertyName]
        {
            get { object v; if (data.TryGetValue(propertyName, out v)) return v; return null; }
            set { data[propertyName] = value; }
        }

		/// <summary>
		/// Gets the value of the specified property name. If specified, create delegate is used when value is not present.
		/// </summary>
		/// <typeparam name="T">Return type.</typeparam>
		/// <param name="propertyName">Name of the property.</param>
		/// <param name="create">Create mising value delegate.</param>
		/// <returns>Property value.</returns>
        public T Get<T>(String propertyName, Func<String, T> create = null)
        {
            var v = this[propertyName];
            if (v == null)
                if (create != null)
                {
                    var res = create(propertyName);
                    this[propertyName] = res;
                    return res;
                }
                else
                    return default(T);
            return (T)v;
        }

		/// <summary>
		/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
		/// </summary>
		/// <param name="jw">The writer.</param>
        protected virtual void WriteProperties(DextopJsWriter jw)
        {
            foreach (var item in data)
				if (item.Value != null)
				{
					jw.AddProperty(item.Key, item.Value);
				}
        }


		/// <summary>
		/// Writes the JS representation of the object to the writer.
		/// </summary>
		/// <param name="jw">The writer.</param>
        public virtual void WriteJs(DextopJsWriter jw)
        {
            jw.StartBlock();
            WriteProperties(jw);
            jw.CloseBlock();
        }
    }
}
