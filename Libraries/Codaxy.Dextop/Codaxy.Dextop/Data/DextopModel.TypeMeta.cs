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
        /// Gets or sets the identifier field.
        /// </summary>
        public String Identifier { get; set; }

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

        /// <summary>
        /// Determines if tree model is used.
        /// </summary>
        public bool IsTreeModel { get; set; }


        /// <summary>
        /// Default serializer type
        /// </summary>
        public DextopSerializerType DefaultSerializerType { get; set; }

        /// <summary>
        /// TODO: Implement switch to Dynamic serializer which offers better performance
        /// </summary>
        IDextopModelSerializer arraySerializer;
        IDextopModelSerializer jsonSerializer;
        IDextopModelSerializer dynamicArraySerializer;
        /// <summary>
        /// Gets the default array serializer associated with the model.
        /// </summary>
        public IDextopModelSerializer ArraySerializer { get { return arraySerializer ?? (arraySerializer = new DextopModelArraySerializer(this)); } }

        /// <summary>
        /// Gets the default json serializer associated with the model.
        /// </summary>
        public IDextopModelSerializer JsonSerializer { get { return jsonSerializer ?? (jsonSerializer = new DextopModelJsonSerializer(this)); } }

        /// <summary>
        /// Gets the dynamic array serializer associated with the model. Dynamic serializers have a creation performance penalty 
        /// but offer better serialization performance. Use it to serialize larger chunks of data.
        /// </summary>
        public IDextopModelSerializer DynamicArraySerializer { get { return dynamicArraySerializer ?? (dynamicArraySerializer = new DextopModelDynamicArraySerializer(this)); } }


        /// <summary>
        /// Default serializer
        /// </summary>
        public IDextopModelSerializer DefaultSerializer
        {
            get
            {
                switch (DefaultSerializerType)
                {
                    case DextopSerializerType.Array: return ArraySerializer;
                    case DextopSerializerType.Json: return JsonSerializer;
                    case DextopSerializerType.DynamicArray: return DynamicArraySerializer;
                    default:
                        throw new DextopException("Unsupported serializer type.");
                }
            }
        }
    }
}
