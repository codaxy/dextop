using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Combo box for static lookup fields.
	/// </summary>
	public class DextopFormLookupComboAttribute : DextopFormFieldAttribute
	{
		/// <summary>
		/// Gets or sets the lookup id.
		/// </summary>
		public string lookupId { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopFormLookupComboAttribute"/> class.
		/// </summary>
		public DextopFormLookupComboAttribute()
		{
			xtype = "combo";
			forceSelection = true;
			disableKeyFilter = true;
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
            if (lookupStoreId != null)
                res["store"] = new DextopRawJs("Dextop.getStore('{0}', {{ autoLoad: true }})", lookupStoreId);
            else
                res["store"] = new DextopRawJs("options.remote.createStore('{0}')", lookupId ?? res.name);
			res["valueField"] = "id";
			//res["displayField"] = "text"; //combo default
			res["queryMode"] = "local";
			res["forceSelection"] = forceSelection;
			res["disableKeyFilter"] = disableKeyFilter;
			res["editable"] = editable;
            res["hideTrigger"] = hideTrigger;
			return res;
		}

		/// <summary>
		/// Specify true to restrict the selected value to one of the values in the list, false to allow the user to set arbitrary text into the field.
		/// </summary>
		public bool forceSelection { get; set; }
		
		/// <summary>
		/// Specify true to disable input keystroke filtering.
		/// </summary>
		public bool disableKeyFilter { get; set; }


		/// <summary>
		/// Specify true to enable lookup editing.
		/// </summary>
		public bool editable { get; set; }

        /// <summary>
        /// Specify true to hide the trigger element and display only the base text field.
        /// </summary>
        public bool hideTrigger { get; set; }

        /// <summary>
        /// Name of the store which holds lookup values.
        /// </summary>
        public string lookupStoreId { get; set; }
	}
}
