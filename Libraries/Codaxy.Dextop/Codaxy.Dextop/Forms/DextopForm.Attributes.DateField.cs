using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// A date field.
	/// </summary>
	public class DextopFormDateFieldAttribute : DextopFormFieldAttribute
	{

		/// <summary>
		/// The default date format string which can be overriden for localization support. 
		/// The format must be valid according to Date-parseDate (defaults to 'm/d/Y').
		/// </summary>
		public string format { get; set; }

		/// <summary>
		/// The maximum allowed date. Can be either a Javascript date object or a string date 
		/// in a valid format (defaults to undefined).
		/// </summary>
		public string maxValue { get; set; }

		/// <summary>
		/// The minimum allowed date. Can be either a Javascript date object or a
		/// string date in a valid format (defaults to undefined).
		/// </summary>
		public string minValue { get; set; }

		/// <summary>
		/// Dalse to hide the footer area of the Date picker containing the 
		/// Today button and disable the keyboard handler for spacebar that selects 
		/// the current date (defaults to true)
		/// </summary>
		public bool showToday { get; set; }

		/// <summary>
		/// The date format string which will be submitted to the server.
		/// The format must be valid according to Ext.util.Date-parseDate (defaults to format).
		/// </summary>
		string submitFormat { get; set; }


		/// <summary>
		/// A date field.
		/// </summary>
		public DextopFormDateFieldAttribute()
			: base()
		{
			xtype = "datefield";
		}

		/// <summary>
		/// Toes the field.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="type">The type.</param>
		/// <returns></returns>
		public override DextopFormField ToField(string memberName, Type type)
		{
			DextopFormField field = base.ToField(memberName, type);
			if (format != null)
				field["format"] = format;
			if (maxValue != null)
				field["maxValue"] = maxValue;
			if (minValue != null)
				field["minValue"] = minValue;
			if (!showToday)
				field["showToday"] = showToday;
			if (submitFormat != null)
				field["submitFormat"] = submitFormat;
			return field;
		}

	}
}
