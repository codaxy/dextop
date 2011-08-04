using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;

namespace Codaxy.Dextop.Data
{

	/// <summary>
	/// Abstract base class for all model validation attributes.
	/// </summary>
    [AttributeUsage(AttributeTargets.Field | AttributeTargets.Property, AllowMultiple = true)]
    public abstract class DextopModelValidationAttribute : Attribute
    {
		/// <summary>
		/// Converts the attribute to the validation object.
		/// </summary>
		/// <param name="name">The mmeber name.</param>
		/// <param name="type">The member type.</param>
		/// <returns></returns>
        public abstract DextopModel.Validation ToValidation(String name, Type type);
    }

	/// <summary>
	/// RegEx validation.
	/// </summary>
    public class DextopValidateMatcherAttribute : DextopModelValidationAttribute
    {
        /// <summary>
        /// RegEx string matching pattern 
        /// </summary>
        public String matcher { get; set; }

		/// <summary>
		/// Converts the attribute to the validation object.
		/// </summary>
		/// <param name="name">The mmeber name.</param>
		/// <param name="type">The member type.</param>
		/// <returns></returns>
        public override DextopModel.Validation ToValidation(String name, Type type)
        {
            return new DextopModel.Validation
            {
                field = name,
                type = "format",
                matcher = matcher
            };
        }
    }

	/// <summary>
	/// Inclusion validation.
	/// </summary>
    public class DextopValidateInclusionAttribute : DextopModelValidationAttribute
    {
        /// <summary>
        /// List with possible field values
        /// </summary>
        public String[] list { get; set; }

		/// <summary>
		/// Converts the attribute to the validation object.
		/// </summary>
		/// <param name="name">The mmeber name.</param>
		/// <param name="type">The member type.</param>
		/// <returns></returns>
        public override DextopModel.Validation ToValidation(String name, Type type)
        {
            return new DextopModel.Validation
            {
                field = name,
                type = "inclusion",
                list = list
            };
        }
    }

	/// <summary>
	/// Exclusion validation.
	/// </summary>
    public class DextopValidateExclusionAttribute : DextopModelValidationAttribute
    {
        /// <summary>
        /// List of unwanted field values.
        /// </summary>
        public String[] list { get; set; }

		/// <summary>
		/// Converts the attribute to the validation object.
		/// </summary>
		/// <param name="name">The mmeber name.</param>
		/// <param name="type">The member type.</param>
		/// <returns></returns>
        public override DextopModel.Validation ToValidation(String name, Type type)
        {
            return new DextopModel.Validation
            {
                field = name,
                type = "exclusion",
                list = list
            };
        }
    }

	/// <summary>
	/// Presence validation.
	/// </summary>
    public class DextopValidatePresenceAttribute : DextopModelValidationAttribute
    {
        /// <summary>
        /// List with possible field values
        /// </summary>
        public String[] list { get; set; }

		/// <summary>
		/// Converts the attribute to the validation object.
		/// </summary>
		/// <param name="name">The mmeber name.</param>
		/// <param name="type">The member type.</param>
		/// <returns></returns>
        public override DextopModel.Validation ToValidation(String name, Type type)
        {
            return new DextopModel.Validation
            {
                field = name,
                type = "presence"
            };
        }
    }

	/// <summary>
	/// Length validation.
	/// </summary>
    public class DextopValidateLengthAttribute : DextopModelValidationAttribute
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopValidateLengthAttribute"/> class.
		/// </summary>
        public DextopValidateLengthAttribute() 
        {
            min = -1;
            max = -1;
        }

        /// <summary>
        /// Minimal length of field content.
        /// </summary>
        public int min { get; set; }

        /// <summary>
        /// Miximal lenght of field content.
        /// </summary>
        public int max { get; set; }

		/// <summary>
		/// Converts the attribute to the validation object.
		/// </summary>
		/// <param name="name">The mmeber name.</param>
		/// <param name="type">The member type.</param>
		/// <returns></returns>
        public override DextopModel.Validation ToValidation(String name, Type type)
        {
            return new DextopModel.Validation
            {
                field = name,
                type = "length",
                min = NullableUtil.DefaultNull(min, -1),
                max = NullableUtil.DefaultNull(max, -1)
            };
        }
    }
}
