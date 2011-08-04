using System.Dynamic;

namespace Codaxy.Dextop.Showcase.Demos.Windows
{
	[Demo("SimpleWindow",
		Title = "Dextop Window",
		Description = "Create a simple window.",
		Path = "~/Demos/Windows"
	)]
	[LevelBeginner]
	[TopicDextopWindows]
	[CategoryFeature]
	public class SimpleWindow : DextopWindow
	{
		public override void InitRemotable(DextopRemote remote, DextopConfig config)
		{
			base.InitRemotable(remote, config);			
			config["title"] = "Simple Window";
			config["html"] = "This is a simple window with html content from the server...";
			config["width"] = 500;
			config["height"] = 300;
			Remote.RemoteHostType = "Dextop.Window";
		}
	}
}