using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// A text area.
	/// </summary>
	public class DextopFormTextAreaAttribute : DextopFormTextFieldAttribute
	{
		/// <summary>
		/// Grow to fit contents
		/// </summary>
		public bool grow { get; set; }

		/// <summary>
		/// The minimum height to allow when grow=true (defaults to 60)
		/// </summary>
		public int growMin { get; set; }
		
		/// <summary>
		/// The maximum height to allow when grow=true (defaults to 1000)
		/// </summary>
		public int growMax { get; set; }

		/// <summary>
		/// The custom height.
		/// </summary>		
		public int height { get; set; }

		/// <summary>
		/// true to prevent scrollbars from appearing regardless of how much text is in the field. This option is only relevant when grow is true. 
		/// </summary>
		public bool preventScrollbars { get; set; }

		/// <summary>
		/// A text area.
		/// </summary>
		public DextopFormTextAreaAttribute()
		{
			xtype = "textarea";
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
			if (grow)
				field["grow"] = grow;
			if (growMin > 0)
				field["growMin"] = growMin;
			if (growMax > 0)
				field["growMax"] = growMax;
			if (height > 0)
				field["height"] = height;
			if (preventScrollbars)
				field["preventScrollbars"] = preventScrollbars;
			return field;
		}
	}
}
