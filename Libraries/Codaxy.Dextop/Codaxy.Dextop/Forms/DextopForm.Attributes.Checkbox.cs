using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Ext.form.CheckboxField
	/// </summary>
	public class DextopFormCheckboxAttribute : DextopFormFieldAttribute
	{
		/// <summary>
		/// Ext.form.CheckboxField
		/// </summary>
		public DextopFormCheckboxAttribute()
			: base()
		{
			xtype = "checkboxfield";
            hideEmptyLabel = false;
		}
	}

	/// <summary>
	/// Ext.form.CheckboxGroup (xtype: checkboxgroup)
	/// </summary>
	public class DextopFormCheckboxGroupAttribute : DextopFormContainerAttribute
	{
		/// <summary>
		/// Ext.form.CheckboxGroup (xtype: checkboxgroup)
		/// </summary>
		public DextopFormCheckboxGroupAttribute(int level)
			: base(level)
		{
			xtype = "checkboxgroup";
			allowBlank = true;
		}

		/// <summary>
		/// Converts this attribute to a Dextop container.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">Type of the member.</param>
		/// <returns></returns>
		public override DextopFormContainer ToContainer(string memberName, Type memberType)
		{
			DextopFormContainer container = base.ToContainer(memberName, memberType);
			if (!allowBlank)
				container["allowBlank"] = allowBlank;
			if (vertical)
				container["vertical"] = vertical;
			if (columns > 0)
				container["columns"] = columns;
			else if (columnWidths != null)
				container["columns"] = columnWidths;
			if (fieldLabel != null)
				container["fieldLabel"] = fieldLabel;
			return container;
		}

		/// <summary>
		/// False to validate that at least one item in the group is checked
		/// (defaults to true). 
		/// </summary>
		public bool allowBlank { get; set; }

		/// <summary>
		/// True to distribute contained controls across columns, 
		/// completely filling each column top to bottom before starting on.
		/// </summary>
		public bool vertical { get; set; }
		
		/// <summary>
		/// Leave empty to and controls will be rendered one per column on one row and the width of each column will be evenly distributed based on the width of the overall field container.
		/// If you specify the number (e.g., 3) that number of columns will be created and the contained controls will be automatically distributed based on the value of vertical.
		/// </summary>
		public int columns { get; set; }

		/// <summary>
		/// Specify an array of column widths, mixing integer (fixed width) and float (percentage width) values as needed (e.g., [100, .25, .75]). Any integer values will be rendered first, then any float values will be calculated as a percentage of the remaining space. Float values do not have to add up to 1 (100%) although if you want the controls to take up the entire field container you should do so.
		/// </summary>
		public double[] columnWidths { get; set; }

		/// <summary>
		/// Gets or sets the field label.
		/// </summary>		
		public string fieldLabel { get; set; }
	}
}
