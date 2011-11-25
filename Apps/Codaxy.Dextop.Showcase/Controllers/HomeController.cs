using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Codaxy.Dextop.Showcase.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            var app = DextopApplication.GetApplication();
            var session = new ShowcaseSession();
            var config = app.AddSession(session);

			return View(new Models.DextopAppConfig
			{
				CssFiles = app.GetCssFiles(session.Culture),
				JsFiles = app.GetJsFiles(session.Culture),				
				SessionConfig = new HtmlString(DextopUtil.Encode(config))
			});
        }
    }
}
