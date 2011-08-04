using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Ext field set widget.
	/// </summary>
	public class DextopFormFieldSetAttribute : DextopFormContainerAttribute
	{
		/// <summary>
		/// The name to assign to the fieldset's checkbox if checkboxToggle = true. Leave empty to use property name.
		/// </summary>
		public string checkboxName { get; set; }

		/// <summary>
		/// Set to true to render a checkbox into the fieldset frame just 
		/// in front of the legend to expand/collapse the fieldset .
		/// </summary>
		public bool checkboxToggle { get; set; }

		/// <summary>
		/// Set to true to render the fieldset as collapsed by default. 
		/// If checkboxToggle is specified, the checkbox will also be.
		/// </summary>
		public bool collapsed { get; set; }

		/// <summary>
		/// Set to true to make the fieldset collapsible and have the expand/collapse 
		/// toggle button automatically rendered into t...
		/// </summary>
		public bool collapsible { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopFormFieldSetAttribute"/> class.
		/// </summary>
		/// <param name="level">The level.</param>
		public DextopFormFieldSetAttribute(int level)
			: base(level)
		{
			xtype = "fieldset";
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
			if (checkboxToggle)
			{
				container["checkboxToggle"] = checkboxToggle;
				container["checkboxName"] = checkboxName ?? memberName;
			}
			if (collapsed)
				container["collapsed"] = collapsed;
			if (collapsible)
				container["collapsible"] = collapsible;
			return container;
		}
	}
}
