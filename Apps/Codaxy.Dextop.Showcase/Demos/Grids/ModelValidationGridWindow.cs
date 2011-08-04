using System;
using System.Collections.Generic;
using System.Linq;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("ModelValidationGridWindow",
        Title = "Model Validation",
        Description = "Define model validation attributes on the server side",
        Path = "~/Demos/Grids"
    )]
    [LevelAdvanced]
    [TopicDextopGrid]
    [CategoryFeature]
    public class ModelValidationGridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
            Remote.RemoteHostType = "Showcase.demos.ModelValidationGridWindow";
            Remote.AddStore<ValidationGridModel>("validationmodel", new ValidationCrud());
        }

        class ValidationCrud : DextopDataProxy<ValidationGridModel>
        {
            SortedDictionary<int, ValidationGridModel> list = new SortedDictionary<int, ValidationGridModel>();
            int id = 0;

            public override IList<ValidationGridModel> Create(IList<ValidationGridModel> data)
            {
                foreach (var row in data)
                {
                    row.Id = ++id;
                    list.Add(row.Id, row);
                }
                return data;
            }

            public override IList<ValidationGridModel> Update(IList<ValidationGridModel> data)
            {
                foreach (var d in data)
                    list[d.Id] = d;
                return data;
            }

            public override IList<ValidationGridModel> Destroy(IList<ValidationGridModel> data)
            {
                foreach (var d in data)
                    list.Remove(d.Id);
                return new ValidationGridModel[0];
            }

            public override DextopReadResult<ValidationGridModel> Read(DextopReadFilter filter)
            {
                return DextopReadResult.Create(list.Values.ToArray());
            }                
        }        

        [DextopModel]
        [DextopGrid]
        class ValidationGridModel
        {
            [DextopModelId]
            [DextopGridColumn(width = 50, readOnly = true)] 
            public int Id { get; set; }

            [DextopValidateLength(min = 5, max = 10)]
            [DextopGridColumn(width = 100)]   
            public String Name { get; set; }

            [DextopValidateInclusion(list = new String[]{ "Female", "Male" })]
            [DextopGridColumn(width = 100)]   
            public String Gender { get; set; }

            //[DextopValidateMatcher(matcher = @"\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b")]
            [DextopGridColumn(width = 150)]           
            public String Email { get; set; }

            [DextopValidatePresence]
            [DextopGridColumn(width = 50)]
            public int Height { get; set; }
            
        }
    }
}