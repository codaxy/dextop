using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Interface describing Ext.form.Labelable mixin.
	/// </summary>
	public interface IDextopFormLabelable
	{
		/// <summary>
		/// Set to true to completely hide the label element (fieldLabel and labelSeparator).
		/// </summary>
		bool hideLabel { get; set; }

		/// <summary>
		/// When set to true, the label element (fieldLabel and labelSeparator) will be automatically hidden if the fieldLabel is empty. Setting this to false will cause the empty label element to be rendered and space to be reserved for it; this is useful if you want a field without a label to line up with other labeled fields in the same form.
		/// </summary>
		bool hideEmptyLabel { get; set; }

		/// <summary>
		/// The label for the field. It gets appended with the labelSeparator, and its position and sizing is determined by the labelAlign, labelWidth, and labelPad configs.
		/// </summary>
		string fieldLabel { get; set; }

		/// <summary>
		/// The CSS class to use when marking the component invalid (defaults to 'x-form-invalid')
		/// </summary>
		String invalidCls { get; set; }

		/// <summary>
		/// Controls the position and alignment of the fieldLabel. Valid values are:
		/// - "left" (the default) - The label is positioned to the left of the field, with its text aligned to the left. Its width is determined by the labelWidth config.
		/// - "top" - The label is positioned above the field.
		/// - "right" - The label is positioned to the left of the field, with its text aligned to the right. Its width is determined by the labelWidth config.
		/// </summary>
		string labelAlign { get; set; }

		/// <summary>
		/// The CSS class to be applied to the label element. Defaults to 'x-form-item-label'.
		/// </summary>
		string labelCls { get; set; }

		/// <summary>
		/// The amount of space in pixels between the fieldLabel and the input field. Defaults to 5.
		/// </summary>
		int labelPad { get; set; }

		/// <summary>
		/// Character(s) to be inserted at the end of the label text.
		/// </summary> 
		string labelSeparator { get; set; }

		/// <summary>
		/// A CSS style specification string to apply directly to this field's label.
		/// </summary>
		string labelStyle { get; set; }


		/// <summary>
		/// The width of the fieldLabel in pixels. Only applicable if the labelAlign is set to "left" or "right". Defaults to 100.
		/// </summary>
		int labelWidth { get; set; }

		/// <summary>The location where the error message text should display. Must be one of the following values:
		/// - qtip - Display a quick tip containing the message when the user hovers over the field. This is the default.
		/// Ext.tip.QuickTipManager.init must have been called for this setting to work.
		///  - title - Display the message in a default browser title attribute popup.
		/// under Add a block div beneath the field containing the error message.
		/// - side - Add an error icon to the right of the field, displaying the message in a popup on hover.
		/// - none - Don't display any error message. This might be useful if you are implementing custom error display.
		/// - [element id] - Add the error message directly to the innerHTML of the specified element.
		/// </summary>
		string msgTarget { get; set; }

		
		/// <summary>
		/// true to disable displaying any error message set on this object. Defaults to false.
		/// </summary>
		bool preventMark { get; set; }

	}
}
