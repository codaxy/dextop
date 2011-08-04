using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Codaxy.Common.Localization
{
    public class DefaultLocalizationDataProvider : ILocalizationDataProvider
    {
        public Dictionary<string, Field[]> ReadDefaultData(Assembly assembly)
        {
            var types = Codaxy.Common.Reflection.AssemblyHelper.GetAttributedTypesForAssembly(assembly, typeof(LocalizationAttribute), false);

            Dictionary<string, Field[]> res = new Dictionary<string, Field[]>();

            foreach (var type in types)
            {
                var inst = Activator.CreateInstance(type);

                var typeFields = (from a in type.GetFields()
                                  select new Field
                                  {
                                      FieldName = a.Name,
                                      LocalizedText = a.GetValue(inst).ToString()
                                  }).ToArray();

                var locTypeName = type.FullName;

                res.Add(locTypeName, typeFields);
            }

            return res;
        }        
    }
}
