using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// A number field.
	/// </summary>
	public class DextopFormNumberFieldAttribute : DextopFormFieldAttribute
	{
		/// <summary>
		/// A number field.
		/// </summary>
		public DextopFormNumberFieldAttribute()
		{
			xtype = "numberfield";
			minValue = int.MaxValue;
			maxValue = int.MinValue;
			decimalPrecision = 2;
			allowDecimals = true;
		}
		/// <summary>
		/// Specifies a numeric interval by which the field's value will be incremented or 
		/// decremented when the user invokes the spinner. Defaults to 1.
		/// </summary>
		public double step { get; set; }

		/// <summary>
		/// False to disallow decimal values (defaults to true)
		/// </summary>
		public bool allowDecimals { get; set; }

		/// <summary>
		/// The base set of characters to evaluate as valid 
		/// numbers (defaults to '0123456789').
		/// </summary>
		public string baseChars { get; set; }

		/// <summary>
		/// The maximum precision to display after the decimal separator (defaults to 2)
		/// </summary>
		public int decimalPrecision { get; set; }

		/// <summary>
		/// The maximum allowed value (defaults to Number.MAX_VALUE). 
		/// </summary>
		public int maxValue { get; set; }

		/// <summary>
		/// The minimum allowed value (defaults to Number.NEGATIVE_INFINITY). 
		/// </summary>
		public int minValue { get; set; }

		/// <summary>
		/// Converts this attribute to a form field.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">The type of the member.</param>
		/// <returns></returns>
		public override DextopFormField ToField(string memberName, Type memberType)
		{
			DextopFormField field = base.ToField(memberName, memberType);
			if (step != 0)
				field["step"] = step;
			if (!allowDecimals)
				field["allowDecimals"] = allowDecimals;
			if (baseChars != null)
				field["baseChars"] = baseChars;
			if (decimalPrecision != 2)
				field["decimalPrecision"] = decimalPrecision;
			if (maxValue != int.MinValue)
				field["maxValue"] = maxValue;
			if (minValue != int.MaxValue)
				field["minValue"] = minValue;
			return field;
		}
	}
}
