using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("EditableGridFiltering",
       Title = "Editable Grid with Filtering and Sorting",
       Description = "Grid with Crud operations and server-side filtering and sorting",
       Path = "~/Demos/Grids"
    )]
    [LevelBeginner]
    [TopicDextopGrid]
    [CategoryFeature]
    public class EditableGridWithFiltering : DextopWindow
    {
        public enum Gender { Male, Female };

        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            var crud = new Crud();
            crud.Create(new[] {
                    new Person(){id=1, name="John Smith", age=56, height=180, gender=Gender.Male, basketball=true},
                    new Person(){id=2, name="Simon Garinson", age=41, height=178, gender=Gender.Male},
                    new Person(){id=3, name="Jonah Hill", age=29, height=172, gender=Gender.Male, volleyball=true},
                    new Person(){id=4, name="Phil Garrison", age=49, height=185, gender=Gender.Male,football=true},
                    new Person(){id=5, name="Barak Obama", age=50, height=182, gender=Gender.Male, basketball=true, volleyball=true},
                    new Person(){id=6, name="Madeline Graham", age=37, height=170, gender=Gender.Female,volleyball=true},
            });
            Remote.AddStore("model", crud);
            Remote.AddLookupData("gender", new[] {
                new object[] { Gender.Male, "Male" },
                new object[] { Gender.Female, "Female" }
            });

        }

        [DextopGrid]
        [DextopModel]
        [DextopForm]
        public class Person
        {
            [DextopModelId]
            public int id { get; set; }

            [DextopGridColumn(flex = 1, text = "Name", tooltip = "Persons Name")]
            [DextopFormField(anchor = "0", allowBlank = false, fieldLabel = "Name", labelSeparator="")]
            public string name { get; set; }

            [DextopFormFieldSet(0, title="General", margins="10 10 10 10")]
            [DextopGridLookupColumn(width = 50, text = "Gender", tooltip = "Persons Gender")]
            [DextopFormLookupCombo(width = 200, fieldLabel="Gender", labelSeparator="")]
            public Gender? gender { get; set; }

            [DextopGridColumn(width = 70, text = "Age", tooltip = "Persons Age")]
            [DextopFormField(width = 180, fieldLabel = "Age", labelSeparator = "")]
            public int age { get; set; }

            [DextopGridColumn(width = 70, text = "Height", tooltip = "Persons Height")]
            [DextopFormField(width = 180, fieldLabel="Height", labelSeparator="")]
            public int height { get; set; }

            [DextopFormFieldSet(0, title = "Sports")]
            [DextopFormCheckboxGroup(1,anchor="1")]
            [DextopFormField(boxLabel = "Basketball")]
            public bool basketball { get; set; }

            [DextopFormField(boxLabel = "Football")]
            public bool football { get; set; }

            [DextopFormField(boxLabel = "Volleyball")]
            public bool volleyball { get; set; }
        }

        class Crud : DextopDataProxy<Person>
        {
            SortedDictionary<int, Person> list = new SortedDictionary<int, Person>();
            int id = 0;

            public override IList<Person> Create(IList<Person> data)
            {
                //Debug.WriteLine("Creating JSON : " + DextopUtil.Encode(data));
                foreach (var row in data)
                {
                    row.id = ++id;
                    list.Add(row.id, row);
                }
                return data;
            }

            public override IList<Person> Update(IList<Person> data)
            {
                //Debug.WriteLine("Updating JSON : " + DextopUtil.Encode(data));
                foreach (var d in data)
                    list[d.id] = d;
                return data;
            }

            public override IList<Person> Destroy(IList<Person> data)
            {
                //Debug.WriteLine("Deleting JSON : " + DextopUtil.Encode(data));
                foreach (var d in data)
                    list.Remove(d.id);
                return new Person[0];
            }

            public override DextopReadResult<Person> Read(DextopReadFilter filter)
            {
                Debug.WriteLine("Reading filter : " + DextopUtil.Encode(filter));
                IEnumerable<Person> temp = list.Values;
                if (filter.filter != null)
                {
                    string filterCriteria = filter.filter[0].value ?? "";
                    if (filterCriteria != "")
                    {
                        string filterProperty = filter.filter[0].property;
                        if (filterProperty == "name")
                        {
                            if (filterCriteria.Length >= 3)
                                temp=temp.Where(k => k.name.ToLower().Contains(filterCriteria));
                            else
                                temp=temp.Where(k => k.name.ToLower().StartsWith(filterCriteria));
                            
                        }
                        else //if filter property is age
                        {
                            int age = -1;
                            if (int.TryParse(filterCriteria, out age)) //never trust client
                                temp=temp.Where(k => k.age == age);
                        }
                    }
                }
                if (filter.sort != null)
                {
                    //Debug.WriteLine("Sort property:" + filter.sort[0].property + " direction:" + filter.sort[0].direction);
                    if (filter.sort[0].property == "name")
                    {
                        if (filter.sort[0].direction == "ASC")
                            temp = temp.OrderBy(k => k.name);
                        else
                            temp = temp.OrderByDescending(k => k.name);
                    }
                    if (filter.sort[0].property == "gender")
                    {
                        if (filter.sort[0].direction == "ASC")
                            temp = temp.OrderBy(k => k.gender);
                        else
                            temp = temp.OrderByDescending(k => k.gender);
                    }
                    if (filter.sort[0].property == "age")
                    {
                        if (filter.sort[0].direction == "ASC")
                            temp = temp.OrderBy(k => k.age);
                        else
                            temp = temp.OrderByDescending(k => k.age);
                    }
                    if (filter.sort[0].property == "height")
                    {
                        if (filter.sort[0].direction == "ASC")
                            temp = temp.OrderBy(k => k.height);
                        else
                            temp = temp.OrderByDescending(k => k.height);
                    }
                    if (filter.sort[0].property == "id")
                    {
                        if (filter.sort[0].direction == "ASC")
                            temp = temp.OrderBy(k => k.id);
                        else
                            temp = temp.OrderByDescending(k => k.id);
                    }
                }
                Debug.WriteLine("Sent : " + DextopUtil.Encode(temp));
                return DextopReadResult.Create(temp);
            }
        }


    }
}
