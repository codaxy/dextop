using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Common.Reflection;

namespace Codaxy.Dextop.Data
{
    class DextopGridManager
    {
        public static IList<DextopGridColumn> BuildHeaders(Type type)
        {
            var attributes = new List<Tuple<String, Type, DextopGridColumnAttribute[]>>();
            var properties = type.GetProperties();
            foreach (var p in properties)
            {
                var att = AttributeHelper.GetCustomAttributes<DextopGridColumnAttribute>(p, false);
                if (att!=null && att.Length>0)
                    attributes.Add(Tuple.Create(p.Name, p.PropertyType, att));
            }
            foreach (var p in type.GetFields())
            {
                var att = AttributeHelper.GetCustomAttributes<DextopGridColumnAttribute>(p, false);
                if (att != null && att.Length > 0)
                    attributes.Add(Tuple.Create(p.Name, p.FieldType, att));            
            }

            DextopGridColumn root = new DextopGridColumn();
            var stack = new Stack<Tuple<DextopGridColumnAttribute, DextopGridColumn>>();
            stack.Push(Tuple.Create(new DextopGridColumnAttribute { Group = int.MaxValue }, root));            

            //stable sort
            foreach (var field in attributes.OrderBy(a => a.Item3.Min(b => b.Order)))
            {
                foreach (var attribute in field.Item3.OrderByDescending(a=>a.Group))
                {
                    while (stack.Peek().Item1.Group <= attribute.Group)
                        stack.Pop();

                    var header = attribute.ToGridHeader(field.Item1, field.Item2);
                    stack.Peek().Item2.Columns.Add(header);
                    stack.Push(Tuple.Create(attribute, header));
                }
            }
            
            return root.Columns;
        }
    }
}
