using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Forms
{
    /// <summary>
    /// A basic text field.
    /// </summary>
    public class DextopFormTextFieldAttribute : DextopFormFieldAttribute
    {
        /// <summary>
        /// A basic text field.
        /// </summary>
        public DextopFormTextFieldAttribute()
        {
            xtype = "textfield";
        }

        /// <summary>
        /// Minimum input field length required (defaults to 0)
        /// </summary>
        public int minLength { get; set; }

        /// <summary>
        /// Maximum input field length allowed (defaults to 0)
        /// </summary>
        public int maxLength { get; set; }


        /// <summary>
        /// A JavaScript RegExp object to be tested against the field value during validation (defaults to undefined). If the test fails, the field will be marked invalid using regexText.
        /// </summary>
        public string regex { get; set; }

        /// <summary>
        /// The error text to display if regex is used and the test fails during validation (defaults to '')
        /// </summary>
        public string regexText { get; set; }

        /// <summary>
        /// An input mask regular expression that will be used to filter keystrokes that do not match.
        /// </summary>
        public string maskRe { get; set; }

        /// <summary>
        /// Converts this attribute to a form field.
        /// </summary>
        /// <param name="memberName">Name of the member.</param>
        /// <param name="memberType">The type of the member.</param>
        /// <returns></returns>
        public override DextopFormField ToField(string memberName, Type memberType)
        {
            DextopFormField field = base.ToField(memberName, memberType);
            if (minLength > 0)
                field["minLength"] = minLength;
            if (maxLength > 0)
                field["maxLength"] = maxLength;
            if (regex != null)
                field["regex"] = new DextopRawJs("/" + regex + "/");
            if (regexText != null)
                field["regexText"] = new DextopLocalizedText(field.ItemName + "RegextText", regexText);
            if (maskRe != null)
                field["maskRe"] = new DextopRawJs("/" + maskRe + "/");
            return field;
        }
    }
}
