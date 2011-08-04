using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Forms
{
    /// <summary>
    /// File upload form field.
    /// </summary>
    public class DextopFormFileFieldAttribute : DextopFormFieldAttribute
    {
        /// <summary>
        /// The button text to display on the upload button (defaults to 'Browse...').
        /// </summary>
        public String buttonText { get; set; }

        /// <summary>
        /// Set true to display the file upload field as a button with no visible text field.
        /// </summary>
        public bool buttonOnly { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public DextopFormFileFieldAttribute()
        {
            xtype = "filefield";
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

            if (buttonText != null)
                res["buttonText"] = buttonText;

            if (buttonOnly)
                res["buttonOnly"] = true;

            return res;
        }
    }
}
