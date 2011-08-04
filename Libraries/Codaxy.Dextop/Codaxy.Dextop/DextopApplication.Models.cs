using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop
{
    public partial class DextopApplication
    {
		/// <summary>
		/// Gets the model manager.
		/// </summary>
		/// <value>
		/// The model manager.
		/// </value>
        public DextopModelManager ModelManager { get; private set; }

		/// <summary>
		/// Registers the models.
		/// </summary>
        protected virtual void RegisterModels() {

        }
    }
}
