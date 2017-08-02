using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Api;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("ApiGrid",
        Title = "Grid API",
        Description = "Show how to setup grid using Dextop API on the server side.",
        ClientLauncher = true,
        Path = "~/Demos/Api"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
    [CategoryDemo]
    public class ApiGrid : DextopApiController, IDextopDataProxy<ApiGridModel>
    {
        static ApiGridModel[] data = new[] {
            new ApiGridModel { Id = 1, DOB = new DateTime(1990, 1, 1, 0, 0, 0), Basketball = false, Football = true, FirstName = "Diego", LastName = "Armando", FavoriteSport = 1 }
        };

        DextopReadResult<ApiGridModel> IDextopReadProxy<ApiGridModel>.Read(DextopReadFilter filter)
        {
            return DextopReadResult.Create(data);
        }

        IList<ApiGridModel> IDextopDataProxy<ApiGridModel>.Create(IList<ApiGridModel> records)
        {
            var id = data.Max(a => a.Id);
            foreach (var rec in records)
                rec.Id = ++id;

            data = data.Concat(records)
                .OrderBy(a => a.Id)
                .ToArray();

            return records;
        }

        IList<ApiGridModel> IDextopDataProxy<ApiGridModel>.Destroy(IList<ApiGridModel> records)
        {
            return records;
        }

        IList<ApiGridModel> IDextopDataProxy<ApiGridModel>.Update(IList<ApiGridModel> records)
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
    class ApiGridModel
    {
        [DextopModelId]
        [DextopGridColumn(width = 50, readOnly = true)]
        public int Id { get; set; }

        [DextopGridColumn(flex = 1)]
        public String FirstName { get; set; }

        [DextopGridColumn(flex = 1)]
        public String LastName { get; set; }

        [DextopGridColumn(flex = 1, readOnly = true)]
        public String FullName { get { return FirstName + " " + LastName; } }

        [DextopGridColumn(flex = 1, readOnly = true)]
        public DateTime DOB { get; set; }

        [DextopGridColumn(width = 50)]
        public int Age { get { return (DateTime.UtcNow.Year - DOB.Year); } }

        [DextopGridColumn]
        public bool Basketball { get; set; }

        [DextopGridColumn]
        public bool Football { get; set; }

        [DextopGridLookupColumn(lookupStoreId = "sport-lookup")]
        public int FavoriteSport { get; set; }
    }

    [DextopModel]
    class Sport
    {
        public int id { get; set; }
        public String text { get; set; }
    }

    [DextopApiStore("sport-lookup", autoLoad=false)]
    class FavoriteSportLookup : DextopApiController, IDextopReadProxy<Sport>
    {
        public DextopReadResult<Sport> Read(DextopReadFilter filter)
        {
            var results = new[] {
               new Sport { id = 1, text="Football" },
               new Sport { id = 2, text="Basketball" },
               new Sport { id = 3, text="Tennis" },
               new Sport { id = 4, text="Hockey" },
           };

            return DextopReadResult.Create(results);
        }
    }
}