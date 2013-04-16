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
    public class ApiGrid : IDextopApiController
    {
        [DextopModel]
        [DextopGrid]
        class GridModel
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

            [DextopGridColumn(width = 50)]
            public int Age { get; set; }

            [DextopGridColumn(width = 50)]
            public int Height { get; set; }

            [DextopGridColumn]
            public bool Basketball { get; set; }

            [DextopGridColumn]
            public bool Football { get; set; }
        }
    }
}