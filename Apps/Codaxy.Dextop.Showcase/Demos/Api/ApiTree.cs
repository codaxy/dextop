using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Api;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
    [Demo("ApiTree",
        Title = "Tree API",
        Description = "Show how to setup tree using Dextop API on the server side.",
        ClientLauncher = true,
        Path = "~/Demos/Api"
    )]
    [LevelBeginner]
    [TopicDextopRemoting]
    [CategoryDemo]
    [DextopApiControllerAlias("tree-api")]
    public class ApiTree : DextopApiController, IDextopDataProxy<ApiTreeModel>
    {
        DextopReadResult<ApiTreeModel> IDextopReadProxy<ApiTreeModel>.Read(DextopReadFilter filter)
        {
            var results = new[] {
               new ApiTreeModel { id = 1, text = "Root" }
           };

            return DextopReadResult.Create(results);
        }

        IList<ApiTreeModel> IDextopDataProxy<ApiTreeModel>.Create(IList<ApiTreeModel> records)
        {
            return records;
        }

        IList<ApiTreeModel> IDextopDataProxy<ApiTreeModel>.Destroy(IList<ApiTreeModel> records)
        {
            return records;
        }

        IList<ApiTreeModel> IDextopDataProxy<ApiTreeModel>.Update(IList<ApiTreeModel> records)
        {
            return records;
        }
    }

    [DextopModel]
    [DextopGrid]
    class ApiTreeModel
    {
        [DextopModelId]
        [DextopGridColumn(width = 50, readOnly = true)]
        public int id { get; set; }

        public String text { get; set; }
    }
}