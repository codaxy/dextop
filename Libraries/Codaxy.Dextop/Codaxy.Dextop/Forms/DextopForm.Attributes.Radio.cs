using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// A radio button widget.
	/// </summary>
	public class DextopFormRadioAttribute : DextopFormFieldAttribute
	{

		/// <summary>
		/// The list of values that should go into the generated input element's value attribute and 
		/// should be used as the parameter value when submitting as part of a form.		
		/// </summary>
		public object[] inputValues { get; set; }

		/// <summary>
		/// Gets or sets the list of field labels.
		/// </summary>		
		public string[] fieldLabels { get; set; }

		/// <summary>
		/// Gets or sets the lis of box labels.
		/// </summary>		
		public string[] boxLabels { get; set; }

		/// <summary>
		///  Ext radio btutton widget.
		/// </summary>
		public DextopFormRadioAttribute()
			: base()
		{
			xtype = "radio";
		}

		DextopFormField ToField(string memberName, Type memberType, int index)
		{
			DextopFormField field = base.ToField(memberName, memberType);
			field.NameSuffix = "_" + index.ToString() + "_";
			if (inputValues != null && index < inputValues.Length)
				field["inputValue"] = inputValues[index];
			else
				field["inputValue"] = index;

			field.fieldLabel = field.boxLabel = null;
			field.Properties.Remove("fieldLabel");
			field.Properties.Remove("boxLabel");

            field["checked"] = new DextopRawJs("options.data['{0}'] === {1}", field.name, DextopUtil.Encode(field["inputValue"]));
			
			if (fieldLabels != null && index<fieldLabels.Length)
				field.fieldLabel = fieldLabels[index];

			if (boxLabels != null)
				field.boxLabel = boxLabels[index];
			
			return field;	
		}

		/// <summary>
		/// Converts this attribute to a list of form fields. Usually attributes
		/// are mapped to a single form field, but sometimes single attribute
		/// is mapped to multiple fields (e.g. DextopFormRadio).
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">Type of the member.</param>
		/// <returns></returns>
		public override DextopFormField[] ToFields(string memberName, Type memberType)
		{
			int count;
			if (boxLabels != null)
				count = boxLabels.Length;
			else if (fieldLabels != null)
				count = fieldLabels.Length;
			else
				return new DextopFormField[0];

			var res = new DextopFormField[count];
			for (var i = 0; i < res.Length; i++)
				res[i] = ToField(memberName, memberType, i);
			return res;
		}
	}

	/// <summary>
	/// A radio button group.
	/// </summary>
	public class DextopFormRadioGroupAttribute : DextopFormCheckboxGroupAttribute
	{
		/// <summary>
		/// A radio button group.
		/// </summary>
		public DextopFormRadioGroupAttribute(int level)
			: base(level)
		{
			xtype = "radiogroup";
			allowBlank = true;
		}
	}
}
