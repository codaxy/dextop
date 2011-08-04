using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Indicates that a class defines grid columns.
	/// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class DextopGridAttribute : System.Attribute
    {

    }

	/// <summary>
	/// Define a grid column for the member.
	/// </summary>
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = true)]
    public class DextopGridColumnAttribute : System.Attribute
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopGridColumnAttribute"/> class.
		/// </summary>
        public DextopGridColumnAttribute()
        {
            width = -1;
        }
        /// <summary>
        /// Sorting order
        /// </summary>
        public int Order { get; set; }

		/// <summary>
		/// Gets or sets the column group. Default value is 0. Group value 1 will group all columns with value 0.
		/// </summary>		
        public int Group { get; set; }

        /// <summary>
        /// A name which identifies this column. If not set, DataIndex is used.
        /// </summary>
        public String id { get; set; }

        /// <summary>
        /// Required. The name of the field in the model definition from which to draw the column's value.
        /// </summary>
        public String dataIndex { get; set; }

        /// <summary>
        /// Optional. The header text to be used as innerHTML (html tags are accepted) to display in the Grid view. Note: to have a clickable header with no text displayed use ' '.
        /// </summary>
        public String text { get; set; }

        /// <summary>
        /// Column type. One of int, float, date, datetime, time, bool...
        /// </summary>
        public String type { get; set; }

        /// <summary>
        /// Header tooltip.
        /// </summary>
        public String tooltip { get; set; }

        /// <summary>
        /// Mark that column is ReadOnly
        /// </summary>        
        public bool readOnly { get; set; }

        /// <summary>
        /// Width of the column.
        /// </summary>        
        public int width { get; set; }

        /// <summary>
        /// Create cell tooltip by template.
        /// </summary>
        public string tooltipTpl { get; set; }

        /// <summary>
        /// Value is required (data entry)
        /// </summary>        
        public bool required { get; set; }

		/// <summary>
		/// Each child item with a flex property will be flexed horizontally according to each item's relative flex value compared to the sum of all items with a flex value specified. 
		/// </summary>		
        public double flex { get; set; }

        /// <summary>
        /// Align left, right, center. By default numbers are aligned right and dates are centered.
        /// </summary>
        public string align { get; set; }

        /// <summary>
        /// Mark that column is sortable
        /// </summary>        
        public bool sortable { get; set; }

		/// <summary>
		/// Name of the renderer to be used.
		/// </summary>
		public string renderer { get; set; }

		/// <summary>
		/// Converts this attribute to the column object.
		/// </summary>
		/// <param name="memberName">Name of the member.</param>
		/// <param name="memberType">Type of the member.</param>
		/// <returns></returns>
        public virtual DextopGridColumn ToGridHeader(String memberName, Type memberType)
        {
            string extType;
            DextopModelFieldTypeMapper.TryGetFieldTypeName(memberType, out extType);
			return new DextopGridColumn
			{
				align = align,
				dataIndex = dataIndex ?? memberName,
				id = Group == 0 ? id : ((id ?? dataIndex ?? memberName) + Group),
				flex = flex > 0 ? flex : (double?)null,
				text = text ?? memberName,
				readOnly = NullableUtil.DefaultNull(readOnly, false),
				required = NullableUtil.DefaultNull(required, false),
				sortable = NullableUtil.DefaultNull(sortable, false),
				tooltip = tooltip,
				tooltipTpl = tooltipTpl,
				type = type ?? extType,
				width = NullableUtil.DefaultNull(width, -1),
				renderer = renderer
			};
        }
        
    }
}
