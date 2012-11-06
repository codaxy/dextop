using System;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Demos.Grids
{
    [Demo("ClientGridWindow",
        Title = "Client Grid",
        Description = "Create a window and grid on the client side first.", 
        ClientLauncher=true,
        Path = "~/Demos/Grids"
    )]
    [LevelAdvanced]
    [TopicDextopGrid]
    [CategoryFeature]
    public class ClientGridWindow : DextopWindow
    {
        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);                      
            Remote.AddStore("model", new Crud(), remoteId: Remote.IsClientInitiated ? "store" : null);
        }

        class Crud : DextopDataProxy<Model>
        {
            public override DextopReadResult<Model> Read(DextopReadFilter filter)
            {
                return DextopReadResult.Params(
                    new Model { Id = 1, Name = "Bill", Age = 30, Height = 180 },
                    new Model { Id = 2, Name = "Bob", Age = 26, Height = 175 }
                );
            }            
        }        

        [DextopModel]
        [DextopGrid]
        class Model
        {
            [DextopModelId]
            public int Id { get; set; }
            
            [DextopGridColumn(flex=1)]
            public String Name { get; set; }
            
            [DextopGridColumn(width = 50)]            
            public int Age { get; set; }

            [DextopGridColumn(width = 50)]
            public int Height { get; set; }
        }
    }
}