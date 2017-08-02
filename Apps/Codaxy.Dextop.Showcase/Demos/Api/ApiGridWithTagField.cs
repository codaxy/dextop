using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Api;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Forms;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("ApiGridWithTagField",
        Title = "API grid with tag form field",
        Description = "Show how to use tag field with Dextop API.",
        ClientLauncher = true,
        Path = "~/Demos/Api"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
    [CategoryDemo]
    [DextopApiControllerAlias("people-grid")]
    public class ApiGridWithTagFieldController : DextopApiController, IDextopDataProxy<PeopleModel>
    {
        static PeopleModel[] data = new[] {
            new PeopleModel { Id = 1, FirstName = "Diego", LastName = "Armando", CountryIds = new [] { 2, 4 }, CountryNames = new[] { "Russia", "Serbia" } }
        };

        DextopReadResult<PeopleModel> IDextopReadProxy<PeopleModel>.Read(DextopReadFilter filter)
        {
            return DextopReadResult.Create(data);
        }

        IList<PeopleModel> IDextopDataProxy<PeopleModel>.Create(IList<PeopleModel> records)
        {
            var id = data.Max(a => a.Id);
            foreach (var rec in records)
            {
                rec.Id = ++id;
                rec.CountryNames = CountriesLookup.All().Where(a => rec.CountryIds.Contains(a.id)).Select(a => a.text).ToArray();
            }

            data = data.Concat(records)
                .OrderBy(a => a.Id)
                .ToArray();

            return records;
        }

        IList<PeopleModel> IDextopDataProxy<PeopleModel>.Destroy(IList<PeopleModel> records)
        {
            return records;
        }

        IList<PeopleModel> IDextopDataProxy<PeopleModel>.Update(IList<PeopleModel> records)
        {
            foreach (var rec in records)
                rec.CountryNames = CountriesLookup.All().Where(a => rec.CountryIds.Contains(a.id)).Select(a => a.text).ToArray();

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


    [DextopForm]
    [DextopModel]
    [DextopGrid]
    public class PeopleModel
    {
        [DextopModelId]
        [DextopGridColumn(width = 50, readOnly = true)]
        public int Id { get; set; }

        [DextopFormField(anchor = "0")]
        [DextopGridColumn(flex = 1)]
        public String FirstName { get; set; }

        [DextopFormField(anchor = "0")]
        [DextopGridColumn(flex = 1)]
        public String LastName { get; set; }

        [DextopGridColumn(flex = 1, readOnly = true)]
        public String FullName { get { return FirstName + " " + LastName; } }

        [DextopFormTag("id", "text", fieldLabel = "Countries", initialLookupValueField = "CountryNames", api = "countries-lookup", anchor = "0")]
        public int[] CountryIds { get; set; }

        public String[] CountryNames { get; set; }
    }

    [DextopModel]
    public class CountriesModel
    {
        [DextopModelId]
        public int id { get; set; }
        public String text { get; set; }
    }

    [DextopApiControllerAlias("countries-lookup")]
    public class CountriesLookup : DextopApiController, IDextopReadProxy<CountriesModel>
    {
        public static CountriesModel[] All()
        {
            return new[] {
                    new CountriesModel { id = 1, text="Bosnia and Herzegovina" },
                    new CountriesModel { id = 2, text="Russia" },
                    new CountriesModel { id = 3, text="United states" },
                    new CountriesModel { id = 4, text="Serbia" }
                };
        }

        public DextopReadResult<CountriesModel> Read(DextopReadFilter filter)
        {
            return DextopReadResult.Create(All());
        }
    }
}