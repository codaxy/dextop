using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Tools;
using Codaxy.Common.Reflection;
using System.Reflection;

namespace Codaxy.Dextop.Forms
{
    class DextopFormBuilder
    {
        public static IList<DextopFormObject> BuildForm(Type type)
        {
			var attributes = new List<Tuple<String, Type, MemberInfo, DextopFormFieldAttribute>>();
            var properties = type.GetProperties();
            foreach (var p in properties)
            {
                DextopFormFieldAttribute att;				
                if (AttributeHelper.TryGetAttribute<DextopFormFieldAttribute>(p, out att, false))
                    attributes.Add(Tuple.Create(p.Name, p.PropertyType, (MemberInfo)p, att));
                
            }
            
            foreach (var p in type.GetFields())
            {
                DextopFormFieldAttribute att;				
				if (AttributeHelper.TryGetAttribute<DextopFormFieldAttribute>(p, out att, false))
					attributes.Add(Tuple.Create(p.Name, p.FieldType, (MemberInfo)p, att));
            }

            var root = new DextopFormContainer
            {
                Level = int.MinValue
            };

            var cstack = new Stack<DextopFormContainer>();
            cstack.Push(root);

            //stable sort
            foreach (var field in attributes.OrderBy(a => a.Item4.Order))
            {
				var containers = AttributeHelper.GetCustomAttributes<DextopFormContainerAttribute>(field.Item3, false).OrderBy(a => a.Level).Select(a => a.ToContainer(field.Item1, field.Item2)).ToArray();                
                foreach (var container in containers)
                {
                    while (cstack.Peek().Level >= container.Level)
                        cstack.Pop();

					if (!container.Hollow)
					{
						cstack.Peek().Items.Add(container);
						cstack.Push(container);
					}
                }
				if (!field.Item4.Dummy)
				{
					foreach (var f in field.Item4.ToFields(field.Item1, field.Item2))
						cstack.Peek().Items.Add(f);
				}
            }

            return root.Items;
        }

        
    }
}
