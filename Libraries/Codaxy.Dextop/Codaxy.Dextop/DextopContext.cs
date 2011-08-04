using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop
{
	/// <summary>
	/// 
	/// </summary>
    public class DextopContext
    {
        //public DextopApplication Application { get; set; }
		
		/// <summary>
		/// Gets or sets the model manager.
		/// </summary>		
        public DextopModelManager ModelManager { get; set; }

		/// <summary>
		/// Gets or sets the session.
		/// </summary>
		public DextopSession Session { get; set; }
	}
}
