using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Remoting
{
	[DextopEnum]
	enum EnumDemoStatus { Valid, Invalid }

	[Demo("Enums",
        Title = "Enums",
        Description = "C# enumerations can be mapped to the JS.",
        Path = "~/Demos/Remoting"
    )]
    [LevelMedium]
    [TopicDextopRemoting]
    [CategoryFeature]
    public class EnumDemoWindow : DextopWindow
    {  
		EnumDemoStatus status = EnumDemoStatus.Invalid;

		[DextopRemotable]
		EnumDemoStatus ToggleStatus()
		{
			if (status == EnumDemoStatus.Valid)
				status = EnumDemoStatus.Invalid;
			else
				status = EnumDemoStatus.Valid;
			return status;
		}

		[DextopRemotable]
		EnumDemoStatus SetStatus(EnumDemoStatus v)
		{
			return status = v; 
		}
    }
}