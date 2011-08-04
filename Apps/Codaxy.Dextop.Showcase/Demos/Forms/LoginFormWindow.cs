using System;
using Codaxy.Dextop.Forms;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Showcase.Demos.Forms
{
	[Demo("LoginFormWindow",
		Title = "Login Form",
		Description = "Ready to use Login window.",
		Path = "~/Demos/Forms"
	)]
	[LevelBeginner]
	[TopicDextopForms]
	[CategoryCodeSnippet]
	public class LoginFormWindow : DextopWindow
	{
		[DextopRemotable]
		string DoLogin(Login login)
		{
			return "Hello " + login.Username + "!";
		}

		[DextopForm]
		class Login
		{
			[DextopFormField(allowBlank = false, anchor = "0")]
			public String Username { get; set; }

			[DextopFormField(inputType = "password", anchor = "0")]
			public String Password { get; set; }
		}
	}
}