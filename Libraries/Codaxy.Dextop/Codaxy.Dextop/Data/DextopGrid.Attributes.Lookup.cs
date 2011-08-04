using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Lookup column.
	/// </summary>
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = true)]
    public class DextopGridLookupColumnAttribute : DextopGridColumnAttribute
    {
		/// <summary>
		/// Gets or sets the lookup id.
		/// </summary>		
        public string lookupId { get; set; }

		/// <summary>
		/// Converts this attribute to the column object.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">Type of the member.</param>
		/// <returns></returns>
        public override DextopGridColumn ToGridHeader(string memberName, Type memberType)
        {
            var res = base.ToGridHeader(memberName, memberType);
            res.type = "lookup";
            if (lookupId != null)
                res["lookupId"] = lookupId;
            return res;
        }
    }

	/// <summary>
	/// Lookup column with a remote store.
	/// </summary>
	[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = true)]
	public class DextopGridRemoteLookupColumnAttribute : DextopGridColumnAttribute
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopGridRemoteLookupColumnAttribute"/> class.
		/// </summary>
		/// <param name="valueField">The value field.</param>
		/// <param name="displayField">The display field.</param>
		public DextopGridRemoteLookupColumnAttribute(string valueField, string displayField)
		{
			this.valueField = valueField;
			this.displayField = displayField;
			forceSelection = true;
		}

		/// <summary>
		/// Gets or sets the lookup id.
		/// </summary>		
		public string lookupId { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public string valueField { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public string displayField { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public string valueNotFoundDataIndex { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public bool forceSelection { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public bool hideTrigger { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public int listWidth { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public string listEmptyText { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public string listItemTpl { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public string listLoadingText { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public int listMinWidth { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public int listMaxWidth { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public bool listResizable { get; set; }

		/// <summary>
		/// Converts this attribute to the column object.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">Type of the member.</param>
		/// <returns></returns>
		public override DextopGridColumn ToGridHeader(string memberName, Type memberType)
		{
			var res = base.ToGridHeader(memberName, memberType);
			res.type = "remote-lookup";
			if (lookupId != null)
				res["lookupId"] = lookupId;

			if (valueNotFoundDataIndex != null)
				res["valueNotFoundDataIndex"] = valueNotFoundDataIndex;

			var fieldConfig = new DextopJsBag();
			fieldConfig["valueField"] = valueField;
			if (displayField != null)
				fieldConfig["displayField"] = displayField;
			
			if (listWidth>0) //list has custom width set
				fieldConfig["matchFieldWidth"] = false;

			var listConfig = GetListConfig();
			if (!listConfig.IsEmpty())
				fieldConfig["listConfig"] = listConfig;

			if (forceSelection)
				fieldConfig["forceSelection"] = forceSelection;

			if (hideTrigger)
				fieldConfig["hideTrigger"] = hideTrigger;

			res["field"] = fieldConfig;
			return res;
		}

		DextopJsBag GetListConfig()
		{
			var res = new DextopJsBag();
			if (listWidth > 0)
				res["width"] = listWidth;
			if (listEmptyText != null)
				res["emptyText"] = listEmptyText;
			if (listItemTpl != null)
				res["itemTpl"] = listItemTpl;
			if (listLoadingText != null)
				res["loadingText"] = listLoadingText;
			if (listMaxWidth > 0)
				res["maxWidth"] = listMaxWidth;
			if (listMinWidth > 0)
				res["minWidth"] = listMinWidth;
			if (listResizable)
				res["resizable"] = true;
			return res;
		}
	}
}
