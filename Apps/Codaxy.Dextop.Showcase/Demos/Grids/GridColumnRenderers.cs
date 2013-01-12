using System;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("GridRenderers",
        Title = "Grid Renderers",
        Description = "Show how to nicely render grid data ",
        Path = "~/Demos/Grids"
    )]
    [LevelMedium]
    [TopicDextopGrid]
    [CategoryFeature]
    public class GridRenderers : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);
			Remote.AddStore("model", Read);
        }

		GridModel[] Read(DextopReadFilter filter)
		{
            return new[] {
                new GridModel { Id = 1, Date = DateTime.Today, Bool = true, Time = DateTime.Now.TimeOfDay, Tooltip = "Hover", TooltipField = "Leave me alone!"}
            };
		}       

        [DextopModel]
        [DextopGrid]
        class GridModel
        {
            [DextopModelId]
            public int Id { get; set; }
            
            [DextopGridColumn(format="d.m.y" /* renderer="date" */)]
            public DateTime Date { get; set; }

            [DextopGridColumn(width = 70, format = "H:i" /* renderer="time" */ )]
            public TimeSpan Time { get; set; }

            [DextopGridColumn(width = 70, renderer="yesno")]
            public bool Bool { get; set; }

            [DextopGridColumn(width = 70, tooltipTpl = "{TooltipField}")]
            public string Tooltip { get; set; }

            public string TooltipField { get; set; }

            [DextopGridColumn(tpl = "{[Ext.util.Format.date(values.Date, 'd.m.y')]} {Bool} {Tooltip} {TooltipField}", flex = 1)]
            public String Template { get; set; }
        }
    }
}