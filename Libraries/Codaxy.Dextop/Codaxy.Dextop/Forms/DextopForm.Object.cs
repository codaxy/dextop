using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Base class for all Dextop form objects.
	/// </summary>
    public abstract class DextopFormObject : DextopJsBag
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopFormObject"/> class.
		/// </summary>
        public DextopFormObject()
        {
            Items = new List<DextopFormObject>();
        }

		/// <summary>
		/// Gets the name of the item.
		/// </summary>		
        public abstract String ItemName
        {
            get;
        }

		/// <summary>
		/// Gets or sets the raw JS which wil be appended to the object.
		/// </summary>		
        public String Raw { get; set; }

		/// <summary>
		/// Gets the child items.
		/// </summary>
        public List<DextopFormObject> Items { get; private set; }

		/// <summary>
		/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
		/// </summary>
		/// <param name="jw">The writer.</param>
        protected override void WriteProperties(DextopJsWriter jw)
        {
            base.WriteProperties(jw);
            WriteItems(jw);
            if (!String.IsNullOrEmpty(Raw))
                jw.WriteRawJs(Raw);
        }

		/// <summary>
		/// Writes the children to the items property.
		/// </summary>
		/// <param name="jw">The jw.</param>
        protected virtual void WriteItems(DextopJsWriter jw)
        {
            if (Items.Count > 0)
                jw.AddProperty("items", Items);
        }

        /// <summary>
        /// Applies the labelable data to the form object.
        /// </summary>
        /// <param name="labelable">The labelable.</param>
		internal protected virtual void ApplyLabelable(IDextopFormLabelable labelable, String nameLocalizationPrefix)
		{
            if (labelable.fieldLabel != null || nameLocalizationPrefix != null)
                this["fieldLabel"] = nameLocalizationPrefix != null ? (object)new DextopLocalizedText(nameLocalizationPrefix + "FieldLabelText", labelable.fieldLabel) : labelable.fieldLabel;
			if (!labelable.hideEmptyLabel)
				this["hideEmptyLabel"] = labelable.hideEmptyLabel;
			if (labelable.hideLabel)
				this["hideLabel"] = labelable.hideLabel;
			if (labelable.invalidCls != null)
				this["invalidCls"] = labelable.invalidCls;
			if (labelable.labelAlign != null)
				this["labelAlign"] = labelable.labelAlign;
			if (labelable.labelCls != null)
				this["labelCls"] = labelable.labelCls;
			if (labelable.labelPad > 0)
				this["labelPad"] = labelable.labelPad;
			if (labelable.labelSeparator != null)
				this["labelSeparator"] = labelable.labelSeparator;
			if (labelable.labelStyle != null)
				this["labelStyle"] = labelable.labelStyle;
			if (labelable.labelWidth > 0)
				this["labelWidth"] = labelable.labelWidth;
			if (labelable.msgTarget != null)
				this["msgTarget"] = labelable.msgTarget;
			if (labelable.preventMark)
				this["preventMark"] = labelable.preventMark;
		}
    }
}
