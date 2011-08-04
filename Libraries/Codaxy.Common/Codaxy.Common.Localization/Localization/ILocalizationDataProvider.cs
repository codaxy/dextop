using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Codaxy.Common.Localization
{
    public interface ILocalizationDataProvider
    {
        Dictionary<String, Field[]> ReadDefaultData(Assembly assembly);
    }    
}
