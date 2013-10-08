using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("TreeWindow",
        Title = "Basic Tree",
        Description = "Dextop and dynamic trees.",
        Path = "~/Demos/Trees"
    )]
    [LevelBeginner]
    [TopicDextopGrid]
    [CategoryFeature]
    public class TreeWindow : DextopWindow
    {
        TreeNode rootNode = new TreeNode();

        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);          
            Remote.RemoteHostType = "Showcase.demos.TreeWindow";
            Remote.OnProcessAjaxRequest += ProcessAjaxRequest;
        }

        private void ProcessAjaxRequest(HttpContext context)
        {
            var id = context.Request.Params["node"];

            List<TreeNode> nodes = new List<TreeNode>();
            if (id.Length < 3)
                for (int i = 0; i < 3; i++)
                    nodes.Add(new TreeNode
                    {
                        id = id + i,
                        text = "node " + id + i
                    });

            context.Response.ContentType = "application/json";
            context.Response.Write(Codaxy.Dextop.DextopUtil.Encode(nodes));
        }


        public class TreeNode
        {
            public string id { get; set; }
            public string text { get; set; }
            public string iconCls { get; set; }
            public string cls { get; set; }
            public bool leaf { get; set; }
            public bool expanded { get; set; }
            public bool singleClickExpand { get; set; }
            public TreeNode[] children { get; set; }
            public object tag { get; set; }
            public string qtip { get; set; }
        }
     
    }  
}