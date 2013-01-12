using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using Newtonsoft.Json;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Data
{
    /// <summary>
    /// Grid Header
    /// </summary>
    public class DextopGridColumn : DextopJsBag
    {
        /// <summary>
        /// Column constructor. By default sortable=true, width=100
        /// </summary>
        public DextopGridColumn()
        {
            sortable = true;
            width = 100;
        }

        String _id;

        /// <summary>
        /// A name which identifies this column. If not set, DataIndex is used.
        /// </summary>
        public String id { get { return _id ?? dataIndex; } set { _id = value; } }

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
        public bool? readOnly { get; set; }

        /// <summary>
        /// Width of the column.
        /// </summary>        
        public int? width { get; set; }

        /// <summary>
        /// Create cell tooltip from row field value.
        /// </summary>
        public string tooltipTpl { get; set; }

        /// <summary>
        /// Value is required (data entry)
        /// </summary>        
        public bool? required { get; set; }

        /// <summary>
        /// Mark that flex (hbox)
        /// </summary>        
        public double? flex { get; set; }

		/// <summary>
		/// Name of the renderer.
		/// </summary>
		public string renderer { get; set; }

        /// <summary>
        /// Undocumented feature
        /// </summary>
        public string format { get; set; }

        /// <summary>
        /// Mark that column menu is disabled
        /// </summary>        
        public bool? menuDisabled { get; set; }


        /// <summary>
        /// XTemplate based renderer.
        /// </summary>
        public string tpl { get; set; }

        String _align;

        /// <summary>
        /// Align left, right, center. By default numbers are aligned right and dates are centered.
        /// </summary>
        public string align { get { return _align ?? GetAlignmentByType(); } set { _align = value; } }

        private string GetAlignmentByType()
        {
            switch (type)
            {
                case "int":
                case "float":
                case "double":
                    return "right";
                case "time":
                case "date":
                case "datetime":
                    return "center";
                default:
                    return null;
            }
        }

        /// <summary>
        /// Mark that column is sortable
        /// </summary>        
        public bool? sortable { get; set; }

		/// <summary>
		/// Write the properties from the bag to the writer. This method can be overrided for advanced scenarios.
		/// </summary>
		/// <param name="jw">The writer.</param>
        protected override void WriteProperties(DextopJsWriter jw)
        {
			if (id != dataIndex)
				jw.DefaultProperty("id", id);
            jw.AddLocalizationProperty("text", text, id + "Text");
            jw.AddLocalizationProperty("tooltip", tooltip, id + "TooltipText");
            jw.DefaultProperty("flex", flex);
            jw.DefaultProperty("width", width);
			jw.DefaultProperty("renderer", renderer);
            jw.DefaultProperty("format", format);
            jw.DefaultProperty("tpl", tpl);

            if (_columns == null || _columns.Count == 0)
            {
                jw.AddProperty("dataIndex", dataIndex);
                jw.AddProperty("type", type);                
                jw.DefaultProperty("required", required);
                jw.DefaultProperty("tooltipTpl", tooltipTpl);
                jw.DefaultProperty("readonly", readOnly);
                jw.DefaultProperty("menuDisabled", menuDisabled);
            }
            else
            {
                jw.WritePropertyName("columns");
                jw.Write("[");
                for (var i = 0; i < _columns.Count; i++)
                {
                    if (i > 0)
                        jw.Write(", ");
                    if ((jw.Options & DextopJsWriterOptions.ItemFactory) != 0)
                        jw.Write("dict[\"{0}\"]", _columns[i].id);
                    else
                        jw.WriteObject(_columns[i]);
                }
                jw.Write("]");
            }
            base.WriteProperties(jw);
        }

        List<DextopGridColumn> _columns;
		
		/// <summary>
		/// Gets the nested columns.
		/// </summary>
        public List<DextopGridColumn> Columns { get { return _columns ?? (_columns = new List<DextopGridColumn>()); } }

		/// <summary>
		/// Gets a value indicating whether this instance has nested columns.
		/// </summary>
        public bool HasColumns { get { return _columns != null && _columns.Count > 0; } }
    }
}