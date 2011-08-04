using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace Codaxy.Common.Localization
{
    public class Field
    {
        public String FieldName { get; set; }
        public String LocalizedText { get; set; }
    }

    public class LocalizationData
    {
        internal LocalizationData(Dictionary<String, Field[]> d)
        {
            Data = d ?? new Dictionary<string, Field[]>();
        }

        public LocalizationData()
        {
            Data = new Dictionary<string, Field[]>();
        }

        public bool TryGetValue(String typeName, out Field[] fields)
        {
            return Data.TryGetValue(typeName, out fields);
        }

        public Dictionary<String, Field[]> Data { get; set; }

        public void Override(LocalizationData d)
        {
            foreach (var od in d.Data)
            {
                Field[] data;
                if (Data.TryGetValue(od.Key, out data))
                {
                    foreach (var f in data)
                        foreach (var nf in od.Value)
                            if (f.FieldName == nf.FieldName)
                                f.LocalizedText = nf.LocalizedText;
                }
            }
        }

        public void Include(LocalizationData d)
        {
            Include(d.Data);
        }

        internal void Include(Dictionary<string, Field[]> data)
        {
            foreach (var od in data)
                Data.Add(od.Key, od.Value);
        }

        public void WriteXml(XmlWriter xw)
        {
            xw.WriteStartElement("localization");
            foreach (var v in Data)
            {
                xw.WriteStartElement("type");
                xw.WriteAttributeString("name", v.Key);
                foreach (var f in v.Value)
                {
                    xw.WriteStartElement("field");
                    xw.WriteAttributeString("name", f.FieldName);
                    if (f.LocalizedText != null)
                        xw.WriteValue(f.LocalizedText);
                    xw.WriteEndElement();
                }
                xw.WriteEndElement();
            }
            xw.WriteEndElement();
        }

        public static LocalizationData ReadXml(XmlTextReader xr)
        {
            Dictionary<String, Field[]> res = new Dictionary<string, Field[]>();
            if (xr.ReadToDescendant("localization"))
                if (xr.ReadToDescendant("type"))
                    do
                    {
                        List<Field> fields = new List<Field>();
                        var name = xr.GetAttribute("name");
                        if (xr.ReadToDescendant("field"))
                            do
                            {
                                switch (xr.NodeType)
                                {
                                    case XmlNodeType.Element:
                                        if (xr.Name == "field")
                                            fields.Add(new Field { FieldName = xr.GetAttribute("name"), LocalizedText = xr.ReadElementContentAsString() });
                                        break;
                                }
                            } while (xr.ReadToNextSibling("field"));

                        if (fields.Count > 0)
                            res[name] = fields.ToArray();
                    }
                    while (xr.ReadToNextSibling("type"));
            return new LocalizationData(res);
        }


        
    }
}
