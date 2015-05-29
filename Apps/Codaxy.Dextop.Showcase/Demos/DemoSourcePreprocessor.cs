using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Reflection;
using Codaxy.Common.Reflection;
using System.Text;
using System.Net;

namespace Codaxy.Dextop.Showcase.Demos
{
    public class DemoSourcePreprocessor : IDextopAssemblyPreprocessor
    {
        public void ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream output, Stream cache)
        {            
            var assembly = this.GetType().Assembly;
            var data = AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DemoAttribute>(assembly, false);

            var types = new[] { "js", "cs", "html" };
            foreach (var entry in data)
            {
                var att = entry.Value;
                foreach (var type in types)
                    CreateSourceHtml(att, type);
            }

			var aboutHtml = ReadAndTransformMarkdownFile(DextopUtil.MapPath("~/Demos/About.txt"));
			using (var stream = File.CreateText(DextopUtil.MapPath("~/source/About.html")))
			{
				stream.WriteLine("<html>");
				stream.WriteLine("<head>");
				stream.WriteLine("<link href=\"../client/css/showcase.css\" type=\"text/css\" rel=\"stylesheet\" />");
				stream.WriteLine("<meta name=\"robots\" content=\"noindex\">");
				stream.WriteLine("</head>");
				stream.WriteLine("<body>");
				stream.WriteLine(aboutHtml);
				stream.WriteLine("</body>");
				stream.WriteLine("</html>");
			}
        }

        void CreateSourceHtml(DemoAttribute att, string type)
        {
            bool plain = (type != "html");
            String extension = plain ? String.Format("{0}.html", type) : type;

            String vsource = String.Format("{0}/{1}.{2}", att.Path, att.Id, type);
            String vmdsource = String.Format("{0}/{1}.txt", att.Path, att.Id);
            String vdest = String.Format("~/source/{0}.{1}", att.Id, extension);
            
            String source = DextopUtil.MapPath(vsource);
            String mdsource = DextopUtil.MapPath(vmdsource);
            String dest = DextopUtil.MapPath(vdest);

            String content = null;
            if (File.Exists(source))
            {
                if (type == "cs")
                    content = StripDemoAttributes(File.ReadAllLines(source));
                else
                    content = File.ReadAllText(source);
            }
            else if (!plain && File.Exists(mdsource))
            {
				content = ReadAndTransformMarkdownFile(mdsource);
            }

		
            using (var writer = new StringWriter())
			{
				writer.WriteLine("<html>");

				if (content != null)
				{
					writer.WriteLine("<head>");
					writer.WriteLine("<link href=\"../client/css/showcase.css\" type=\"text/css\" rel=\"stylesheet\" />");
					writer.WriteLine("<link href=\"../client/lib/prettify/prettify.css\" type=\"text/css\" rel=\"stylesheet\" />");
					writer.WriteLine("<meta name=\"robots\" content=\"noindex\">");
					writer.WriteLine("</head>");

                    writer.WriteLine("<body onload=\"prettyPrint()\">");

					if (plain)
					{
						writer.WriteLine("<pre class=\"prettyprint\">");
						writer.WriteLine(WebUtility.HtmlEncode(content));
						writer.WriteLine("</pre>");
					}
					else
					{
						writer.WriteLine("<body>");
						writer.WriteLine(content);
					}

                    writer.WriteLine("<script type=\"text/javascript\" src=\"../client/lib/prettify/prettify.js\"></script>");
                    writer.WriteLine("<script type=\"text/javascript\">window['PR_TAB_WIDTH'] = 4;</script>");

					writer.WriteLine("</body>");
				}
				writer.WriteLine("</html>");

				var newContent = writer.ToString();
				if (!File.Exists(dest) || (content != null && File.ReadAllText(dest) != newContent))
					File.WriteAllText(dest, newContent);
			}			
        }

        protected String StripDemoAttributes(String[] lines)
        {
            var demoAttributes = new[] { "[Demo", "[Level", "[Topic", "[Category" };
            StringBuilder sb = new StringBuilder();
            bool inAttribute = false;

            foreach (var line in lines)
            {
                if (!inAttribute)
                {
                    foreach (var att in demoAttributes)
                        if (line.IndexOf(att) != -1)
                        {
                            inAttribute = true;
                            break;
                        }

                    if (!inAttribute)
                        sb.AppendLine(line);
                }

                if (line.Contains(']'))
                    inAttribute = false;

            }

            return sb.ToString();
        }

		public String ReadAndTransformMarkdownFile(String path)
		{
			var md = File.ReadAllText(path);
            try
            {
                var markdown = new MarkdownDeep.Markdown()
                {
                    FormatCodeBlock = (mdd, s) =>
                    {
                        return "<pre class=\"prettyprint\"><code>" + s + "</code></pre>";
                    }
                };
                return markdown.Transform(md);
            }
            catch
            {
                return md;
            }
		}

        bool IDextopAssemblyPreprocessor.Cacheable
        {
            get { return false; }
        }

        void IDextopAssemblyPreprocessor.LoadCache(DextopApplication application, IList<Assembly> assemblies, Stream cacheStream)
        {
            throw new NotSupportedException();
        }
    }
}