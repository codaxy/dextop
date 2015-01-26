using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Class supporting generation of Ext.data.Models.
	/// </summary>
    public class DextopModel : DextopJsBag
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopModel"/> class.
		/// </summary>
        public DextopModel()
        {
            Fields = new List<Field>();
            Validations = new List<Validation>();
        }

		/// <summary>
		/// Gets or sets the fields.
		/// </summary>		
        public List<Field> Fields { get; set; }


		/// <summary>
		/// Gets or sets the validations.
		/// </summary>		
		public List<Validation> Validations { get; set; }

		/// <summary>
		/// Gets or sets the id property.
		/// </summary>
		public String idProperty { get; set; }

		/// <summary>
		/// Gets or sets the meta.
		/// </summary>		
        public DextopModelTypeMeta Meta { get; set; }

		/// <summary>
		/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
		/// </summary>
		/// <param name="jw">The writer.</param>
        protected override void WriteProperties(DextopJsWriter jw)
        {            
            if (Meta.IsTreeModel)
                jw.AddProperty("extend", "Ext.data.TreeModel");
            else
			    jw.AddProperty("extend", "Ext.data.Model");
            if (Fields != null)
                jw.AddProperty("fields", Fields);
            if (Validations != null && Validations.Count > 0)
                jw.AddProperty("validators", Validations);
            jw.DefaultProperty("idProperty", idProperty);

            jw.DefaultProperty("identifier", Meta.Identifier);

            base.WriteProperties(jw);
        }

		/// <summary>
		/// Model field.
		/// </summary>
        public class Field : DextopJsBag
        {
            /// <summary>
            /// The name of the field.
            /// </summary>
            public string name { get; set; }

            /// <summary>
            /// Used when converting received data into a Date when the type is specified as "date".
            /// </summary>
            public string dateFormat { get; set; }

            /// <summary>
            /// The type of the field.
            /// </summary>
            public string type { get; set; }

            /// <summary>
            /// The default value of the field.
            /// </summary>
            public object defaultValue { get; set; }

            /// <summary>
            /// Indicates whether null values are allowed.
            /// </summary>
			public bool? allowNull { get; set; }

            /// <summary>
            ///  A path expression for use by the Ext.data.reader.Reader implementation that is creating the Model to extract the Field value from the data object. If the path expression is the same as the field name, the mapping may be omitted.
            /// </summary>
            public string mapping { get; set; }

            /// <summary>
            /// A function which converts a Field's value to a comparable value in order to ensure correct sort ordering. 
            /// </summary>
            public string sortType { get; set; }

            /// <summary>
            /// A function which converts the value provided by the Reader into an object that will be stored in the Model.
            /// </summary>
            public string convert { get; set; }

            /// <summary>
            /// False to exclude this field from the Ext.data.Model.modified fields in a model. This will also exclude the field from being written using a Ext.data.writer.Writer. This option is useful when model fields are used to keep state on the client but do not need to be persisted to the server. Defaults to true.
            /// </summary>
            public bool persist { get; set; }

            /// <summary>
            /// Initial direction to sort ("ASC" or "DESC"). Defaults to "ASC".
            /// </summary>
            public string sortDir { get; set; }

			/// <summary>
			/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
			/// </summary>
			/// <param name="jw">The writer.</param>
            protected override void WriteProperties(DextopJsWriter jw)
            {
                jw.AddProperty("name", name);
                jw.DefaultProperty("type", type);
                jw.DefaultProperty("defaultValue", defaultValue);
                if (allowNull == true)
                    jw.AddProperty("allowNull", allowNull);
                if (persist == false)
                    jw.AddProperty("persist", false);
                jw.DefaultProperty("mapping", mapping);
                jw.DefaultRawProperty("sortType", sortType);
                jw.DefaultRawProperty("convert", convert);
                jw.DefaultProperty("sortDir", sortDir);
                        
                base.WriteProperties(jw);
            }
        }


		/// <summary>
		/// Model validation.
		/// </summary>
        public class Validation : DextopJsBag
        {
			/// <summary>
			/// Gets or sets the field.
			/// </summary>			
            public String field { get; set; }

			/// <summary>
			/// Gets or sets the type.
			/// </summary>			
			public String type { get; set; }

			/// <summary>
			/// Gets or sets the min value.
			/// </summary>
			public int? min { get; set; }

			/// <summary>
			/// Gets or sets the max value.
			/// </summary>			
			public int? max { get; set; }

			/// <summary>
			/// Gets or sets the list of allowed values.
			/// </summary>
			public String[] list { get; set; }

			/// <summary>
			/// Gets or sets the RegEx matcher.
			/// </summary>			
			public String matcher { get; set; }

			/// <summary>
			/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
			/// </summary>
			/// <param name="jw">The writer.</param>
            protected override void WriteProperties(DextopJsWriter jw)
            {
                jw.AddProperty("field", field);
                jw.AddProperty("type", type);
                jw.DefaultProperty("min", min);
                jw.DefaultProperty("max", max);
                if (list!=null)
                    jw.AddRawProperty("list", DextopUtil.Encode(list));
                jw.DefaultProperty("matcher", matcher);
                base.WriteProperties(jw);
            }
        }
    }
}
