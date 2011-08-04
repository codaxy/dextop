using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// ComboBox with remote store
	/// </summary>
	public class DextopFormRemoteFilteredLookupComboAttribute : DextopFormRemoteLookupComboAttribute
	{
		/// <summary>
        /// Initializes a new instance of the <see cref="DextopFormRemoteFilteredLookupComboAttribute"/> class.
		/// </summary>
		/// <param name="valueField">The value field.</param>
		/// <param name="displayField">The display field.</param>
        public DextopFormRemoteFilteredLookupComboAttribute(String valueField, String displayField)
            : base(valueField, displayField)
        {
            xtype = "filteredcombo";
        }

		/// <summary>
		/// Converts this attribute to a form field.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">The type of the member.</param>
		/// <returns></returns>
        public override DextopFormField ToField(string memberName, Type memberType)
        {
            var res = base.ToField(memberName, memberType);
            if (formParams != null)
                res["formParams"] = formParams;
            return res;
        }

        /// <summary>
        /// List of fields whose values should be inluded as params for lookup request.
        /// </summary>
        public String[] formParams { get; set; }
	}
}
