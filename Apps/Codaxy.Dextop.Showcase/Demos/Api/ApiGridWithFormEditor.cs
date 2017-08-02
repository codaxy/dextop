using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Api;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Forms;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("ApiGridWithFormEditor",
        Title = "Grid API with Form Editor",
        Description = "Show how to setup grid using Dextop API on the server side.",
        ClientLauncher = true,
        Path = "~/Demos/Api"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
    [CategoryDemo]
    [DextopApiControllerAlias("api-grid-form")]
    public class ApiGridWithFormEditorController : DextopApiController, IDextopDataProxy<ApiGridFormModel>
    {
        static ApiGridFormModel[] data = new[] {
            new ApiGridFormModel { Id = 1, Age = 20, Basketball = false, Football = true, FirstName = "Diego", LastName = "Armando", FavoriteSport = 1 }
        };

        DextopReadResult<ApiGridFormModel> IDextopReadProxy<ApiGridFormModel>.Read(DextopReadFilter filter)
        {
            return DextopReadResult.Create(data);
        }

        IList<ApiGridFormModel> IDextopDataProxy<ApiGridFormModel>.Create(IList<ApiGridFormModel> records)
        {
            var id = data.Max(a => a.Id);
            foreach (var rec in records)
                rec.Id = ++id;

            data = data.Concat(records)
                .OrderBy(a => a.Id)
                .ToArray();

            return records;
        }

        IList<ApiGridFormModel> IDextopDataProxy<ApiGridFormModel>.Destroy(IList<ApiGridFormModel> records)
        {
            return records;
        }

        IList<ApiGridFormModel> IDextopDataProxy<ApiGridFormModel>.Update(IList<ApiGridFormModel> records)
        {
            var r = records.ToDictionary(a => a.Id);
            foreach (var rec in records)
                data = data
                    .Where(a => !r.ContainsKey(a.Id))
                    .Concat(records)
                    .OrderBy(a => a.Id)
                    .ToArray();

            return records;
        }
    }
    
    [DextopModel]
    [DextopGrid]
    [DextopForm]
    class ApiGridFormModel
    {
        [DextopModelId]
        [DextopGridColumn(width = 50, readOnly = true)]
        public int Id { get; set; }

        [DextopGridColumn(flex = 1)]
        [DextopFormField]
        public String FirstName { get; set; }

        [DextopGridColumn(flex = 1)]
        [DextopFormField]
        public String LastName { get; set; }

        [DextopGridColumn(flex = 1, readOnly = true)]
        public String FullName { get { return FirstName + " " + LastName; } }

        [DextopGridColumn(width = 50)]
        [DextopFormField]
        public int Age { get; set; }

        [DextopGridColumn]
        [DextopFormField]
        public bool Basketball { get; set; }

        [DextopGridColumn]
        [DextopFormField]
        public bool Football { get; set; }

        //[DextopGridLookupColumn(lookupStoreId = "sport-lookup")]
        [DextopFormLookupCombo(lookupStoreId = "sport-lookup")]
        public int FavoriteSport { get; set; }
    }
}