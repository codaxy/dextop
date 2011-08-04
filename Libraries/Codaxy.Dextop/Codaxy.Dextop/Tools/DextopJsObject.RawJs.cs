using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop.Tools
{
	class DextopLocalizedText : IDextopJsObject
	{
		public String Text { get; set; }
        public String LocalizationPropertyName { get; set; }

        public DextopLocalizedText(String localizationPropertyName, String text) { LocalizationPropertyName = localizationPropertyName; Text = text; }        

		public void WriteJs(DextopJsWriter jw)
		{
            throw new DextopException("Internal JS tool error.");
		}
	}
}
