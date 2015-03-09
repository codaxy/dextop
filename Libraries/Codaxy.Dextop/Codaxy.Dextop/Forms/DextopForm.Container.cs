using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Base class for Ext containers (panels, tabs, etc.)
	/// </summary>
    public class DextopFormContainer : DextopFormObject
    {
		/// <summary>
		/// An itemId can be used as an alternative way to get a reference to a component when no object reference is available.
		/// </summary>
        public String itemId { get; set; }

        internal int Level { get; set; }
		internal bool Hollow { get; set; }

		/// <summary>
		/// Gets the name of the item.
		/// </summary>
        public override string ItemName
        {
            get { return itemId; }
        }

		/// <summary>
		/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
		/// </summary>
		/// <param name="jw">The writer.</param>
        protected override void WriteProperties(DextopJsWriter jw)
        {
            jw.DefaultProperty("itemId", itemId);
            jw.DefaultProperty("xtype", xtype);
            if (itemId != null)
            {
                jw.AddLocalizationProperty("title", title, itemId + "TitleText");
                jw.AddLocalizationProperty("fieldLabel", fieldLabel, itemId + "FieldLabelText");
            }
            else
            {
                jw.DefaultProperty("title", title);
                jw.DefaultProperty("fieldLabel", fieldLabel);
            }
            if (layout != null)
            {
                jw.AddProperty("layout", layout);
            }
            jw.DefaultRawProperty("defaults", defaults);
            jw.DefaultRawProperty("fieldDefaults", fieldDefaults);
            jw.DefaultProperty("margin", margin);
            jw.DefaultProperty("style", style);
            jw.DefaultProperty("bodyStyle", bodyStyle);
            jw.DefaultProperty("border", border);
            jw.DefaultProperty("autoHeight", autoHeight);
            jw.DefaultProperty("anchor", anchor);
            jw.DefaultProperty("width", width);
            jw.DefaultProperty("columnWidth", columnWidth);
            jw.DefaultProperty("flex", flex);

            base.WriteProperties(jw);
        }
        /// <summary>
        /// 
        /// </summary>
        public string[] PrependItems { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string[] AppendItems { get; set; }

		/// <summary>
		/// Writes the children to the items property.
		/// </summary>
		/// <param name="jw">The jw.</param>
        protected override void WriteItems(DextopJsWriter jw)
        {
            if (Items.Count > 0)
            {
                jw.WritePropertyName("items");
                jw.Write("[");
                bool first = true;
                if (PrependItems != null)
                    foreach (var item in PrependItems)
                    {
                        if (first)
                            first = false;
                        else
                            jw.Write(", ");
                        jw.Write("dict['{0}']", item);
                    }
                for (var i = 0; i < Items.Count; i++)
                {
                    if (first)
                        first = false;
                    else
                        jw.Write(", ");
                    if (Items[i].ItemName != null)
                        jw.Write("dict['{0}']", Items[i].ItemName);
                    else
                        jw.WriteObject(Items[i]);
                }
                if (AppendItems != null)
                    foreach (var item in AppendItems)
                    {
                        if (first)
                            first = false;
                        else
                            jw.Write(", ");
                        jw.Write("dict['{0}']", item);
                    }
                jw.Write("]");
            }
        }

		/// <summary>
		/// Gets or sets the xtype.
		/// </summary>		
        public string xtype { get; set; }
		
		/// <summary>
		/// Gets or sets the title.
		/// </summary>
        public string title { get; set; }

        /// <summary>
        /// Gets or sets the fieldLabel.
        /// </summary>
        public string fieldLabel { get; set; }
		
		/// <summary>
		/// Gets or sets the layout.
		/// </summary>
        public string layout { get; set; }
		
		/// <summary>
		/// Gets or sets the margins.
		/// </summary>
        public string margin { get; set; }
		
		/// <summary>
		/// Gets or sets the field defaults.
		/// </summary>
        public string fieldDefaults { get; set; }
		
		/// <summary>
		/// Gets or sets the defaults.
		/// </summary>
        public string defaults { get; set; }
		
		/// <summary>
		/// Gets or sets the style.
		/// </summary>
        public string style { get; set; }
		
		/// <summary>
		/// Gets or sets the body style.
		/// </summary>
        public string bodyStyle { get; set; }

		/// <summary>
		/// Gets or sets the border.
		/// </summary>		
        public bool? border { get; set; }

		/// <summary>
		/// Gets or sets the autoHeight.
		/// </summary>		
		public bool autoHeight { get; set; }

        /// <summary>
        /// This value is what tells the layout how an item should be anchored to the container. 
        /// </summary>
        public String anchor { get; set; }

        /// <summary>
        /// This configuration option is to be applied to child items of the container managed by this layout. Each child item with a flex property will be flexed horizontally according to each item's relative flex value compared to the sum of all items with a flex value specified. 
        /// </summary>
        public double? flex { get; set; }

        /// <summary>
        /// Percentage width for column layout.
        /// </summary>
        public double? columnWidth { get; set; }

        /// <summary>
        /// Width of the field.
        /// </summary>
        public int? width { get; set; }
	}
}
