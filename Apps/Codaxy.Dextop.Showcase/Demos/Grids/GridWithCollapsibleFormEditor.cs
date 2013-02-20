using Codaxy.Dextop.Data;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("GridWithCollapsibleFormEditor",
        Title = "Grid + Collapsible Form Editor",
        Description = "Grid with collapsible form editor and search filters.",
        Path = "~/Demos/Grids"
    )]
    [LevelAdvanced]
    [TopicDextopGrid]
    [CategoryDemo]
    
    public class GridWithCollapsibleFormEditor : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            
            var crud = new Crud();
            crud.Create(new[] { new GridModel { 
				Name = "John Doe", 
				Age = 24, 				 				 
				Gender = Gender.Male, 
				Height = 183				
			}, new GridModel { 
				Name = "Jane Doe", 
				Age = 25, 
				Basketball = true,
 				Volleyball = true,
				Gender = Gender.Female, 
				Height = 165			
			}, new GridModel { 
				Name = "John Wayne", 
				Age = 72, 				
				Football = true, 
				Gender = Gender.Male, 
				Height = 180				
			}, new GridModel { 
				Name = "Laura Palmer", 
				Age = 70, 
				Basketball = true, 
				Football = true, 
				Gender = Gender.Female, 
				Height = 172				
			}, new GridModel { 
				Name = "Mariah Carrey", 
				Age = 43, 
				Basketball = true, 
				Football = true, 
                Volleyball = true,
				Gender = Gender.Female, 
				Height = 170				
			} });
            Remote.AddStore("model", crud);
            Remote.AddLookupData("Gender", new[] {
                new object[] { Gender.Male, "Male" },
                new object[] { Gender.Female, "Female" }
            });            
        }

        enum Gender { Male, Female };        

        [DextopModel]
        [DextopGrid]
		[DextopForm]
        class GridModel
        {
            [DextopModelId]          		
            public int Id { get; set; }            
			
			[DextopFormField(anchor="100%", allowBlank=false)]
            [DextopGridColumn(flex=1)]
            public String Name { get; set; }

			[DextopFormFieldSet(0, title = "Athletics", layout="anchor")]
            [DextopFormLookupCombo(anchor = "100%")]
            [DextopGridLookupColumn()]
            public Gender Gender { get; set; }

            [DextopFormField(anchor = "100%")]
            [DextopGridColumn()]            
            public int Age { get; set; }

            [DextopFormField(anchor = "100%")]
            [DextopGridColumn()]            
            public int Height { get; set; }
			
            [DextopFormFieldSet(0, title="Sports", layout="anchor")]
			[DextopFormCheckboxGroup(0, vertical= true, columns = 1)]
            [DextopFormField(boxLabel = "Basketball")]			
			public bool Basketball { get; set; }

            [DextopFormField(boxLabel = "Football")]			
			public bool Football { get; set; }

            [DextopFormField(boxLabel = "Volleyball")]
            public bool Volleyball { get; set; }         
        }       
        
        class Crud : DextopDataProxy<GridModel>
        {
            SortedDictionary<int, GridModel> list = new SortedDictionary<int, GridModel>();
            int id = 0;

            public override IList<GridModel> Create(IList<GridModel> data)
            {
                foreach (var row in data)
                {
                    row.Id = ++id;
                    list.Add(row.Id, row);
                }
                return data;
            }

            public override IList<GridModel> Update(IList<GridModel> data)
            {
                foreach (var d in data)
                    list[d.Id] = d;
                return data;
            }

            public override IList<GridModel> Destroy(IList<GridModel> data)
            {
                foreach (var d in data)
                    list.Remove(d.Id);
                return new GridModel[0];
            }
            
            public override DextopReadResult<GridModel> Read(DextopReadFilter filter)
            {
                if (filter.filter != null)
                {
                    if (filter.filter[0].property == "name")
                    {
                        String queryName = filter.filter[0].value;

                        if (queryName.Length >= 1 && queryName.Length <= 2)
                        {
                            return DextopReadResult.Create(list.Values.Where(gridModel => gridModel.Name.StartsWith(queryName, StringComparison.CurrentCultureIgnoreCase)).ToArray());
                        }
                        else if (queryName.Length >= 3)
                        {
                            return DextopReadResult.Create(list.Values.Where(gridModel => gridModel.Name.IndexOf(queryName, StringComparison.CurrentCultureIgnoreCase) != -1).ToArray());
                        }
                    }
                    else if (filter.filter[0].property == "age")
                    {
                        int age = Convert.ToInt32(filter.filter[0].value);                        
                        return DextopReadResult.Create(list.Values.Where(gridModel => gridModel.Age.Equals(age)).ToArray());                      
                    }
                }                
                return DextopReadResult.CreatePage(list.Values.AsQueryable(), filter);                              
            }
        } 
       
    }
}