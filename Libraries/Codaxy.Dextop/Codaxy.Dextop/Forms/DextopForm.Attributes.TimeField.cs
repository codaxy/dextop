using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// A time field.
	/// </summary>
	public class DextopFormTimeFieldAttribute : DextopFormFieldAttribute
	{
		/// <summary>
		/// The default time format string which can be overriden for localization support. 
		/// </summary>
		public string format { get; set; }

		/// <summary>
		/// The number of minutes between each time value in the list (defaults to 15).
		/// </summary>
		public int increment { get; set; }

		/// <summary>
		/// The maximum allowed time.
		/// </summary>
		public string maxValue { get; set; }

		/// <summary>
		/// The minimum allowed time. 
		/// </summary>
		public string minValue { get; set; }

		/// <summary>
		/// The date format string which will be submitted to the server.
		/// </summary>
		public string submitFormat { get; set; }


		/// <summary>
		/// A time field.
		/// </summary>
		public DextopFormTimeFieldAttribute()
			: base()
		{
			xtype = "timefield";
		}

		/// <summary>
		/// Converts this attribute to a form field.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">The type of the member.</param>
		/// <returns></returns>
		public override DextopFormField ToField(string memberName, Type memberType)
		{
			DextopFormField field = base.ToField(memberName, memberType);
			if (format != null)
				field["format"] = format;
			if (increment != 0)
				field["increment"] = increment;
			if (maxValue != null)
				field["maxValue"] = maxValue;
			if (minValue != null)
				field["minValue"] = minValue;
			if (submitFormat != null)
				field["submitFormat"] = submitFormat;
			return field;
		}

	}
}
