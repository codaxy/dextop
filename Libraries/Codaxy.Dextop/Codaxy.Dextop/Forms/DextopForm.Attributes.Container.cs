using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
    /// <summary>
    /// Ext Container
    /// </summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = true)]
    public class DextopFormContainerAttribute : System.Attribute
    {

        /// <summary>
        /// Ext Container
        /// </summary>
        public DextopFormContainerAttribute()
        {
            border = true;
        }

        /// <summary>
        /// Ext Container
        /// </summary>
        /// <param name="level">The level.</param>
        public DextopFormContainerAttribute(int level) : this() { Level = level; }

        /// <summary>
        /// Gets or sets the level. Use level to define a tree of items. All items with higher level belong to the first container of lower level.
        /// </summary>		
        public int Level { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public String title { get; set; }

        /// <summary>
        /// The label for the field. It gets appended with the labelSeparator, and its position and sizing is determined by the labelAlign, labelWidth, and labelPad configs.
        /// </summary>
        public String fieldLabel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public String xtype { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string itemId { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string layout { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string margin { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string fieldDefaults { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string defaults { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string style { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string bodyStyle { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool border { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool autoHeight { get; set; }

        /// <summary>
        /// List of items to be prepended to the items property. Note that items have to defined on the client side.
        /// </summary>
        public string[] PrependItems { get; set; }

        /// <summary>
        /// Raw JS to be added to the object
        /// </summary>
        public string RawJS { get; set; }

        /// <summary>
        /// List of items to be appended to the items property. Note that items have to defined on the client side.
        /// </summary>
        public string[] AppendItems { get; set; }

        /// <summary>
        /// This value is what tells the layout how an item should be anchored to the container. 
        /// </summary>
        public String anchor { get; set; }

        /// <summary>
        /// This configuration option is to be applied to child items of the container managed by this layout. Each child item with a flex property will be flexed horizontally according to each item's relative flex value compared to the sum of all items with a flex value specified. 
        /// </summary>
        public double flex { get; set; }

        /// <summary>
        /// Percentage width for column layout.
        /// </summary>
        public double columnWidth { get; set; }

        /// <summary>
        /// Width of the field.
        /// </summary>
        public int width { get; set; }

        /// <summary>
        /// Converts this attribute to a Dextop container.
        /// </summary>
        /// <param name="memberName">Name of the member.</param>
        /// <param name="memberType">Type of the member.</param>		
        /// <returns></returns>
        public virtual DextopFormContainer ToContainer(String memberName, Type memberType)
        {
            var res = new DextopFormContainer
            {
                xtype = xtype,
                itemId = itemId,
                title = title,
                fieldLabel = fieldLabel,
                layout = layout,
                margin = margin,
                fieldDefaults = fieldDefaults,
                defaults = defaults,
                Level = Level,
                style = style,
                bodyStyle = bodyStyle,
                border = NullableUtil.DefaultNull(border, true),
                autoHeight = autoHeight,
                PrependItems = PrependItems,
                AppendItems = AppendItems,
                Raw = RawJS,
                anchor = anchor,
                flex = NullableUtil.DefaultNull(flex, 0),
                columnWidth = NullableUtil.DefaultNull(columnWidth, 0),
                width = NullableUtil.DefaultNull(width, 0),

            };
            if (this is IDextopFormLabelable)
                res.ApplyLabelable((IDextopFormLabelable)this);
            return res;
        }
    }

    /// <summary>
    /// Ext.form.FieldContainer (xtype: fieldcontainer)
    /// </summary>
    public class DextopFormFieldContainerAttribute : DextopFormContainerAttribute, IDextopFormLabelable
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DextopFormFieldContainerAttribute"/> class.
        /// </summary>
        public DextopFormFieldContainerAttribute() { xtype = "fieldcontainer"; }
        /// <summary>
        /// Initializes a new instance of the <see cref="DextopFormFieldContainerAttribute"/> class.
        /// </summary>
        /// <param name="level">The level.</param>
        public DextopFormFieldContainerAttribute(int level) : this() { Level = level; }

        /// <summary>
        /// Set to true to completely hide the label element (fieldLabel and labelSeparator).
        /// </summary>
        public bool hideLabel { get; set; }

        /// <summary>
        /// When set to true, the label element (fieldLabel and labelSeparator) will be automatically hidden if the fieldLabel is empty. Setting this to false will cause the empty label element to be rendered and space to be reserved for it; this is useful if you want a field without a label to line up with other labeled fields in the same form.
        /// </summary>
        public bool hideEmptyLabel { get; set; }

        /// <summary>
        /// The CSS class to use when marking the component invalid (defaults to 'x-form-invalid')
        /// </summary>
        public string invalidCls { get; set; }

        /// <summary>
        /// Controls the position and alignment of the fieldLabel. Valid values are:
        /// - "left" (the default) - The label is positioned to the left of the field, with its text aligned to the left. Its width is determined by the labelWidth config.
        /// - "top" - The label is positioned above the field.
        /// - "right" - The label is positioned to the left of the field, with its text aligned to the right. Its width is determined by the labelWidth config.
        /// </summary>
        public string labelAlign { get; set; }

        /// <summary>
        /// The CSS class to be applied to the label element. Defaults to 'x-form-item-label'.
        /// </summary>
        public string labelCls { get; set; }

        /// <summary>
        /// The amount of space in pixels between the fieldLabel and the input field. Defaults to 5.
        /// </summary>
        public int labelPad { get; set; }

        /// <summary>
        /// Character(s) to be inserted at the end of the label text.
        /// </summary>
        public string labelSeparator { get; set; }

        /// <summary>
        /// A CSS style specification string to apply directly to this field's label.
        /// </summary>
        public string labelStyle { get; set; }

        /// <summary>
        /// The width of the fieldLabel in pixels. Only applicable if the labelAlign is set to "left" or "right". Defaults to 100.
        /// </summary>
        public int labelWidth { get; set; }

        /// <summary>
        /// The location where the error message text should display. Must be one of the following values:
        /// - qtip - Display a quick tip containing the message when the user hovers over the field. This is the default.
        /// Ext.tip.QuickTipManager.init must have been called for this setting to work.
        /// - title - Display the message in a default browser title attribute popup.
        /// under Add a block div beneath the field containing the error message.
        /// - side - Add an error icon to the right of the field, displaying the message in a popup on hover.
        /// - none - Don't display any error message. This might be useful if you are implementing custom error display.
        /// - [element id] - Add the error message directly to the innerHTML of the specified element.
        /// </summary>
        public string msgTarget { get; set; }

        /// <summary>
        /// /// true to disable displaying any error message set on this object. Defaults to false.
        /// </summary>		
        public bool preventMark { get; set; }
    }

    /// <summary>
    /// Ext.panel.Panel
    /// </summary>
    public class DextopFormPanelAttribute : DextopFormContainerAttribute, IDextopFormLabelable
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DextopFormPanelAttribute"/> class.
        /// </summary>
        public DextopFormPanelAttribute() { xtype = "panel"; }
        /// <summary>
        /// Initializes a new instance of the <see cref="DextopFormPanelAttribute"/> class.
        /// </summary>
        /// <param name="level">The level.</param>
        public DextopFormPanelAttribute(int level) : this() { Level = level; }

        /// <summary>
        /// Set to true to completely hide the label element (fieldLabel and labelSeparator).
        /// </summary>
        public bool hideLabel { get; set; }

        /// <summary>
        /// When set to true, the label element (fieldLabel and labelSeparator) will be automatically hidden if the fieldLabel is empty. Setting this to false will cause the empty label element to be rendered and space to be reserved for it; this is useful if you want a field without a label to line up with other labeled fields in the same form.
        /// </summary>
        public bool hideEmptyLabel { get; set; }

        /// <summary>
        /// The CSS class to use when marking the component invalid (defaults to 'x-form-invalid')
        /// </summary>
        public string invalidCls { get; set; }

        /// <summary>
        /// Controls the position and alignment of the fieldLabel. Valid values are:
        /// - "left" (the default) - The label is positioned to the left of the field, with its text aligned to the left. Its width is determined by the labelWidth config.
        /// - "top" - The label is positioned above the field.
        /// - "right" - The label is positioned to the left of the field, with its text aligned to the right. Its width is determined by the labelWidth config.
        /// </summary>
        public string labelAlign { get; set; }

        /// <summary>
        /// The CSS class to be applied to the label element. Defaults to 'x-form-item-label'.
        /// </summary>
        public string labelCls { get; set; }

        /// <summary>
        /// The amount of space in pixels between the fieldLabel and the input field. Defaults to 5.
        /// </summary>
        public int labelPad { get; set; }

        /// <summary>
        /// Character(s) to be inserted at the end of the label text.
        /// </summary>
        public string labelSeparator { get; set; }

        /// <summary>
        /// A CSS style specification string to apply directly to this field's label.
        /// </summary>
        public string labelStyle { get; set; }

        /// <summary>
        /// The width of the fieldLabel in pixels. Only applicable if the labelAlign is set to "left" or "right". Defaults to 100.
        /// </summary>
        public int labelWidth { get; set; }

        /// <summary>
        /// The location where the error message text should display. Must be one of the following values:
        /// - qtip - Display a quick tip containing the message when the user hovers over the field. This is the default.
        /// Ext.tip.QuickTipManager.init must have been called for this setting to work.
        /// - title - Display the message in a default browser title attribute popup.
        /// under Add a block div beneath the field containing the error message.
        /// - side - Add an error icon to the right of the field, displaying the message in a popup on hover.
        /// - none - Don't display any error message. This might be useful if you are implementing custom error display.
        /// - [element id] - Add the error message directly to the innerHTML of the specified element.
        /// </summary>
        public string msgTarget { get; set; }

        /// <summary>
        /// /// true to disable displaying any error message set on this object. Defaults to false.
        /// </summary>		
        public bool preventMark { get; set; }
    }

    /// <summary>
    /// Restore container level.
    /// </summary>
    public class DextopFormRestoreContainerLevelAttribute : DextopFormContainerAttribute
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DextopFormRestoreContainerLevelAttribute"/> class.
        /// </summary>
        /// <param name="level">The level.</param>
        public DextopFormRestoreContainerLevelAttribute(int level)
        {
            Level = level;
        }

        /// <summary>
        /// Converts this attribute to a Dextop container.
        /// </summary>
        /// <param name="memberName">Name of the member.</param>
        /// <param name="memberType">Type of the member.</param>		
        /// <returns></returns>
        public override DextopFormContainer ToContainer(string memberName, Type memberType)
        {
            var res = base.ToContainer(memberName, memberType);
            res.Hollow = true;
            return res;
        }
    }
}
