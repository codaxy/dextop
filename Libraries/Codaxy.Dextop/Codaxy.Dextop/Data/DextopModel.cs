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
			jw.AddProperty("extend", "Ext.data.Model");
            if (Fields != null)
                jw.AddProperty("fields", Fields);
            if (Validations != null && Validations.Count > 0)
                jw.AddProperty("validations", Validations);
            jw.DefaultProperty("idProperty", idProperty);
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
			public bool? useNull { get; set; }

			/// <summary>
			/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
			/// </summary>
			/// <param name="jw">The writer.</param>
            protected override void WriteProperties(DextopJsWriter jw)
            {
                jw.AddProperty("name", name);
                jw.DefaultProperty("type", type);
                jw.DefaultProperty("defaultValue", defaultValue);
                if (useNull == true)
                    jw.AddProperty("useNull", useNull);
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
