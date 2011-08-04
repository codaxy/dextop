using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Forms
{
	/// <summary>
	/// Ext.tab.Panel
	/// </summary>
    public class DextopFormTabPanelAttribute : DextopFormContainerAttribute
    {
		/// <summary>
		/// Ext.tab.Panel
		/// </summary>
        public DextopFormTabPanelAttribute()
        {
            xtype = "tabpanel";            
        }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopFormTabPanelAttribute"/> class.
		/// </summary>
		/// <param name="level">The level.</param>
        public DextopFormTabPanelAttribute(int level) : this() { Level = level; }

		/// <summary>
		/// Index of tab that should be activated upon render.
		/// </summary>
        public int activeTab { get; set; }

		/// <summary>
		/// Converts this attribute to a Dextop container.
		/// </summary>
		/// <param name="memberName"></param>
		/// <param name="memberType"></param>
		/// <returns></returns>
		public override DextopFormContainer ToContainer(string memberName, Type memberType)
        {
			var container = base.ToContainer(memberName, memberType);
            if (activeTab>0)
                container["activeTab"] = activeTab;
            return container;
        }
    }
}
