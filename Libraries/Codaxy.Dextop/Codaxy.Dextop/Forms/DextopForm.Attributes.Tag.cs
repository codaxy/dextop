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
	public class DextopFormTagAttribute : DextopFormLookupComboAttribute
	{
		/// <summary>
        /// Initializes a new instance of the <see cref="DextopFormTagAttribute"/> class.
		/// </summary>
		/// <param name="valueField">The value field.</param>
		/// <param name="displayField">The display field.</param>
        public DextopFormTagAttribute(String valueField, String displayField)
		{
            xtype = "tagfield";
            forceSelection = true;
			disableKeyFilter = false;
			minChars = 1;
			this.valueField = valueField;
			this.displayField = displayField;
			editable = true;
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

            if (initialLookupValueField != null)
            {
                var format = String.Join(" ", "(function() {{"
                    ,"var data = options.data['{0}'], initialData = options.data['{1}'], storeData = [];"
                        ,"if(Array.isArray(data) && Array.isArray(initialData)) {{"
                            ,"for(var i = 0; i < data.length; i++) {{"
                                ,"storeData.push([data[i], initialData[i]]);"
                            ,"}}"
                        ,"}} else {{"
                            ,"storeData.push([data, initialData]);"
                        ,"}}"
                        ,"return {2}('{3}').createStore(!Ext.isDefined(data) ? {{}} : {{ data: storeData }});"
                    ,"}})()");

                if (api != null)
                    res["store"] = new DextopRawJs(format, res.name, initialLookupValueField, "Dextop.api", api);
                else
                    res["store"] = new DextopRawJs(format, res.name, initialLookupValueField, "options.remote", lookupId ?? res.name);
            }
            else if (autoLoadStore)
            {
                if (api != null)
                    res["store"] = new DextopRawJs("Dextop.api('{0}').createStore({{ autoLoad: true }})", api);
                else
                    res["store"] = new DextopRawJs("options.remote.createStore('{0}', {{ autoLoad: true }})", lookupId ?? res.name);
            }
			
            res["valueField"] = valueField;
			res["displayField"] = displayField;
			res["queryMode"] = "remote";
			res["minChars"] = minChars;
			if (valueNotFoundText != null)
				res["valueNotFoundText"] = valueNotFoundText;
			return res;
		}

		/// <summary>
		/// The minimum number of characters the user must type before autocomplete and 
		/// typeAhead activate (defaults to 4 if queryMode = 'remote' or 0 if queryMode = 'local', does not apply if editable = false)
		/// </summary>
		public int minChars { get; set; }
		
		/// <summary>
		/// The underlying data field name to bind to this ComboBox (defaults to 'text').
		/// </summary>		
		public String displayField { get; set; }
		
		/// <summary>
		/// The underlying data value name to bind to this ComboBox (defaults to match the value of the displayField config).
		/// </summary>
		public String valueField { get; set; }
		
		
		/// <summary>
		/// When using a name/value combo, if the value passed to setValue is not found in the store, valueNotFoundText will be displayed as the field text if defined (defaults to undefined). If this default text is used, it means there is no value set and no validation will occur on this field.
		/// </summary>
		public String valueNotFoundText { get; set; }


        /// <summary>
        /// Used to initialy populate lookup value based on the value
        /// </summary>
        public String initialLookupValueField { get; set; }


        /// <summary>
        /// Set autoLoad flag on combo's store.
        /// </summary>
        public bool autoLoadStore { get; set; }
	}
}
