using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// A form field object.
	/// </summary>
    public class DextopFormField : DextopFormObject
    {
		/// <summary>
		/// Gets the name of the item.
		/// </summary>
        public override String ItemName
        {
			get { return name + NameSuffix; }
        }

		/// <summary>
		/// Gets or sets the name suffix.
		/// </summary>		
		public String NameSuffix { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
        public String name { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
        public String fieldLabel { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public String xtype { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public String tooltip { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public String boxLabel { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public String anchor { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public String emptyText { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public string inputType { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public string vtype { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public string vtypeText { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public bool? readOnly { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public bool? allowBlank { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public bool? disabled { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public double? flex { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public string labelAlign { get; set; }

		/// <summary>
		/// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
		/// </summary>		
		public string margin { get; set; }


        /// <summary>
        /// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
        /// </summary>		
        public int width { get; set; }

        /// <summary>
        /// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
        /// </summary>	
        public string style { get; set; }

        /// <summary>
        /// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
        /// </summary>	
        public string fieldStyle { get; set; }

        /// <summary>
        /// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
        /// </summary>	
        public string fieldCls { get; set; }

        /// <summary>
        /// See <c ref="Codaxy.Dextop.Forms.DextopFormFieldAttribute">DextopFormFieldAttribute</c> for more details.
        /// </summary>	
        public string cls { get; set; }

		/// <summary>
		/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
		/// </summary>
		/// <param name="jw">The writer.</param>
        protected override void WriteProperties(DextopJsWriter jw)
        {
            jw.AddProperty("name", name);
			jw.AddLocalizationProperty("fieldLabel", fieldLabel, ItemName + "FieldLabelText");
            jw.DefaultProperty("xtype", xtype);
			jw.AddLocalizationProperty("boxLabel", boxLabel, ItemName + "BoxLabelText");
            jw.DefaultProperty("anchor", anchor);
			jw.AddLocalizationProperty("emptyText", emptyText, ItemName + "EmptyText");
            jw.DefaultProperty("readOnly", readOnly);
            jw.DefaultProperty("allowBlank", allowBlank);
            jw.DefaultProperty("inputType", inputType);
            jw.DefaultProperty("vtype", vtype);
			jw.DefaultProperty("vtypeText", vtypeText);
            jw.DefaultProperty("flex", flex);
            jw.DefaultProperty("labelAlign", labelAlign);
            jw.DefaultProperty("margin", margin);
            jw.DefaultProperty("width", width);
            jw.DefaultProperty("style", style);
            jw.DefaultProperty("fieldStyle", fieldStyle);
            jw.DefaultProperty("cls", cls);
            jw.DefaultProperty("fieldCls", fieldCls);

			jw.AddRawProperty(xtype == "checkboxfield" ? "checked" : "value", String.Format("options.data['{0}']", name));

            base.WriteProperties(jw);
        }





        
    }
}
