using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{

	/// <summary>
	/// Mark that member should be mapped to form field.
	/// </summary>
	[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
	public class DextopFormFieldAttribute : System.Attribute, IDextopFormLabelable
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopFormFieldAttribute"/> class.
		/// </summary>
		public DextopFormFieldAttribute()
		{
			allowBlank = true; //defaults
			hideEmptyLabel = true;
		}

		/// <summary>
		/// Gets or sets the field order.
		/// </summary>		
		public int Order { get; set; }

		/// <summary>
		/// Dummy fields are ignored.
		/// </summary>		
		public bool Dummy { get; set; }

		/// <summary>
		/// The field's HTML name attribute.
		/// </summary>		
		public String name { get; set; }
		
		/// <summary>
		/// The registered xtype to create.
		/// </summary>		
		public String xtype { get; set; }
		
		/// <summary>
		/// An optional text label that will appear next to the checkbox. Whether it appears before or after the checkbox is determined by the boxLabelAlign config (defaults to after).
		/// </summary>
		public String boxLabel { get; set; }
		
		/// <summary>
		/// This value is what tells the layout how an item should be anchored to the container. 
		/// </summary>
		public String anchor { get; set; }

		/// <summary>
		/// TODO: Missing Ext documentation. Not sure if supported.
		/// </summary>
		public string tooltip { get; set; }
		
		/// <summary>
		/// The default text to place into an empty field (defaults to undefined).
		/// Note that normally this value will be submitted to the server if this field is enabled; to prevent this you can set the submitEmptyText option of Ext.form.Basic.submit to false.
		/// </summary>
		public String emptyText { get; set; }
		
		/// <summary>
		/// ReadOnly true to mark the field as readOnly in HTML.
		/// </summary>
		public bool readOnly { get; set; }
		
		/// <summary>
		/// Specify false to validate that the value's length is > 0 (defaults to true).
		/// </summary>		
		public bool allowBlank { get; set; }
		
		/// <summary>
		/// True to disable the field (defaults to false). 
		/// Be aware that conformant with the HTML specification, disabled Fields will not be submitted.
		/// </summary>
		public bool disabled { get; set; }		

		/// <summary>
		/// This configuration option is to be applied to child items of the container managed by this layout. Each child item with a flex property will be flexed horizontally according to each item's relative flex value compared to the sum of all items with a flex value specified. 
		/// </summary>
		public double flex { get; set; }
		
		/// <summary>
		/// The type attribute for input fields -- e.g. radio, text, password, file (defaults to 'text'). The extended types supported by HTML5 inputs (url, email, etc.) may also be used, though using them will cause older browsers to fall back to 'text'.
		/// </summary>
		public string inputType { get; set; }
		
		/// <summary>
		/// A validation type name as defined in Ext.form.field.VTypes
		/// </summary>
		public string vtype { get; set; }

		/// <summary>
		/// A custom error message to display in place of the default message provided for the vtype currently set for this field (defaults to undefined). Note: only applies if vtype is set, else ignored.
		/// </summary>
		public string vtypeText { get; set; }
		
		/// <summary>
		/// Specifies the margin for this component. The margin can be a single numeric value to apply to all sides or it can be a CSS style specification for each style, for example: '10 5 3 10'.
		/// </summary>
		public string margin { get; set; }

		/// <summary>
		/// Set to true to completely hide the label element (fieldLabel and labelSeparator).
		/// </summary>
		public bool hideLabel { get; set; }

		/// <summary>
		/// When set to true, the label element (fieldLabel and labelSeparator) will be automatically hidden if the fieldLabel is empty. Setting this to false will cause the empty label element to be rendered and space to be reserved for it; this is useful if you want a field without a label to line up with other labeled fields in the same form.
		/// </summary>
		public bool hideEmptyLabel { get; set; }

		/// <summary>
		/// The label for the field. It gets appended with the labelSeparator, and its position and sizing is determined by the labelAlign, labelWidth, and labelPad configs.
		/// </summary>
		public string fieldLabel { get; set; }

		/// <summary>
		/// The CSS class to use when marking the component invalid (defaults to 'x-form-invalid')
		/// </summary>
		public string invalidCls { get; set; }

		/// <summary>
		/// Controls the position and alignment of the fieldLabel. Valid values are:
		/// - "left" (the default) - The label is positioned to the left of the field, with its text aligned to the left. Its width is determined by the labelWidth config.
		/// - "top" - The label is positioned above the field.
		/// - "right" - The label is positioned to the left of the field, with its text aligned to the right. Its width is determined by the labelWidth config.
		/// </summary>
		public string labelAlign { get; set; }

		/// <summary>
		/// The CSS class to be applied to the label element. Defaults to 'x-form-item-label'.
		/// </summary>
		public string labelCls { get; set; }

		/// <summary>
		/// The amount of space in pixels between the fieldLabel and the input field. Defaults to 5.
		/// </summary>
		public int labelPad { get; set; }

		/// <summary>
		/// Character(s) to be inserted at the end of the label text.
		/// </summary>
		public string labelSeparator { get; set; }

		/// <summary>
		/// A CSS style specification string to apply directly to this field's label.
		/// </summary>
		public string labelStyle { get; set; }

		/// <summary>
		/// The width of the fieldLabel in pixels. Only applicable if the labelAlign is set to "left" or "right". Defaults to 100.
		/// </summary>
		public int labelWidth { get; set; }

        /// <summary>
        /// A custom style specification to be applied to this component.
        /// </summary>
        public string style { get; set; }

        /// <summary>
        /// Optional CSS style(s) to be applied to the field input element.
        /// </summary>
        public string fieldStyle { get; set; }

        /// <summary>
        /// The default CSS class for the field input (defaults to 'x-form-field').
        /// </summary>
        public string fieldCls { get; set; }

        /// <summary>
        /// An optional extra CSS class that will be added to this component.
        /// </summary>
        public string cls { get; set; }

		/// <summary>
		/// The location where the error message text should display. Must be one of the following values:
		/// - qtip - Display a quick tip containing the message when the user hovers over the field. This is the default.
		/// Ext.tip.QuickTipManager.init must have been called for this setting to work.
		/// - title - Display the message in a default browser title attribute popup.
		/// under Add a block div beneath the field containing the error message.
		/// - side - Add an error icon to the right of the field, displaying the message in a popup on hover.
		/// - none - Don't display any error message. This might be useful if you are implementing custom error display.
		/// - [element id] - Add the error message directly to the innerHTML of the specified element.
		/// </summary>
		public string msgTarget { get; set; }

		/// <summary>
		/// true to disable displaying any error message set on this object. Defaults to false.
		/// </summary>		
		public bool preventMark { get; set; }

        /// <summary>
        /// Width of the field.
        /// </summary>
        public int width { get; set; }

        /// <summary>
        /// Raw JS code to be injected in the field configuration.
        /// </summary>
        public String RawJS { get; set; }

		/// <summary>
		/// Converts this attribute to a form field.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">The type of the member.</param>
		/// <returns></returns>
        public virtual DextopFormField ToField(String memberName, Type memberType)
        {
            if (this.fieldLabel == null && this.boxLabel == null)
                fieldLabel = memberName;
            var res = new DextopFormField
            {
                allowBlank = NullableUtil.DefaultNull(allowBlank, true),
                anchor = anchor,
                boxLabel = boxLabel,
                disabled = NullableUtil.DefaultNull(disabled, false),
                emptyText = emptyText,
                name = name ?? memberName,
                readOnly = NullableUtil.DefaultNull(readOnly, false),
                tooltip = tooltip,
                xtype = xtype ?? GetXType(memberType),
                flex = NullableUtil.DefaultNull(flex, 0.0),
                inputType = inputType,
                vtype = vtype,
                vtypeText = vtypeText,
                margin = margin,
                width = width,
                Raw = RawJS,
                style = style,
                fieldStyle = fieldStyle,
                fieldCls = fieldCls,
                cls = cls
            };
            res.ApplyLabelable(this, name);
            return res;
        }

		/// <summary>
		/// Converts this attribute to a list of form fields. Usually attributes 
		/// are mapped to a single form field, but sometimes single attribute
		/// is mapped to multiple fields (e.g. DextopFormRadio).
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">Type of the member.</param>
		/// <returns></returns>
		public virtual DextopFormField[] ToFields(String memberName, Type memberType)
		{
			return new[] { ToField(memberName, memberType) };
		}

		/// <summary>
		/// Map the member type to Ext xtype.
		/// </summary>
		/// <param name="memberType">Type of the member.</param>
		/// <returns>xtype</returns>
		protected virtual String GetXType(Type memberType)
		{
			if (memberType.IsGenericType && memberType.GetGenericTypeDefinition() == typeof(Nullable<>))
				memberType = Nullable.GetUnderlyingType(memberType);

			if (memberType == typeof(bool))
				return "checkboxfield";

			if (memberType.IsAssignableFrom(typeof(int)))
				return "numberfield";

            if (memberType.IsAssignableFrom(typeof(double)))
                return "numberfield";

            if (memberType.IsAssignableFrom(typeof(decimal)))
                return "numberfield";

			if (memberType == typeof(DateTime))
				return "datefield";

			if (memberType == typeof(TimeSpan))
				return "timefield";

            if (memberType == typeof(DextopFile))
                return "filefield";

			return "textfield";
		}
	}
}
