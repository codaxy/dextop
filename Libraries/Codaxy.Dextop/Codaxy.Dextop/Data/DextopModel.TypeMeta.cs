using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// Meta data associated with the DextopModel.
	/// </summary>
    public class DextopModelTypeMeta
    {
		/// <summary>
		/// Gets or sets the name of the model.
		/// </summary>		
        public String ModelName { get; set; }
		
		/// <summary>
		/// Gets or sets the id field.
		/// </summary>
        public String IdField { get; set; }

		/// <summary>
		/// Gets or sets the excluded fields.
		/// </summary>		
		public String[] ExcludedFields { get; set; }

		/// <summary>
		/// Gets or sets the fields.
		/// </summary>		
		public String[] Fields { get; set; }

		/// <summary>
		/// Gets or sets the type of the model.
		/// </summary>		
		public Type ModelType { get; set; }

        IDextopModelSerializer arraySerializer;
		/// <summary>
		/// Gets the default array serializer associated with the model.
		/// </summary>
        public IDextopModelSerializer ArraySerializer { get { return arraySerializer ?? (arraySerializer = new DextopModelArraySerializer(this)); } }
    }
}
