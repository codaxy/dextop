using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Reflection;
using Codaxy.Common.Reflection;
using System.Text;
using System.Net;
using Codaxy.Dextop.Tools;
using Codaxy.Dextop.Data;

namespace Codaxy.Dextop.Showcase.Guides
{
	public class GuidePreprocessor : IDextopAssemblyPreprocessor
    {		
		class Article
		{
			public string id { get; set; }
			public String text { get; set; }
			public String url { get; set; }
			public bool leaf { get; set; }
			public List<Article> children { get; set; }
			public bool expanded { get; set; }
		}

		String OutputPath { get; set; }
		String BaseSrcPath { get; set; }

        public void ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream output, Stream cache)
		{
			BaseSrcPath = DextopUtil.MapPath("~/guides/articles/");
			OutputPath = DextopUtil.MapPath("~/guides/html/");

			var articles = ProcessDirectory(BaseSrcPath);

			using (var tw = new StreamWriter(output))
			{
				tw.WriteLine("Ext.ns('Showcase');");
				tw.Write("Showcase.Guides = ");
				tw.Write(DextopUtil.Encode(articles.ToArray()));
				tw.WriteLine(";");
			}
		}

		private List<Article> ProcessDirectory(string path)
		{
			List<Article> res = new List<Article>();
			var pathInfo = new DirectoryInfo(path);
			if (!pathInfo.Exists)
				return null;
			foreach (var dir in pathInfo.EnumerateDirectories("*", SearchOption.TopDirectoryOnly))
				if (!dir.Attributes.HasFlag(FileAttributes.Hidden))
				{
					res.Add(new Article
					{
						leaf = false,
						id = ConvertToId(dir.FullName.Substring(BaseSrcPath.Length), null),
						text = dir.Name,
						url = null,
						children = ProcessDirectory(dir.FullName),
						expanded = true
					});
				}

			foreach (var file in pathInfo.EnumerateFiles())
			{
				String url = null;
				switch (file.Extension.ToLower())
				{
					case ".txt":
					case ".md":
						url = ProcessMarkdownArticle(file);
						break;
					case ".html":
						url = ProcessHtmlArticle(file);
						break;
				}
				if (url != null)
					res.Add(new Article
					{
						url = Uri.EscapeUriString(url),
						text = file.Name.Substring(0, file.Name.Length - file.Extension.Length),
						id = ConvertToId(file.FullName.Substring(BaseSrcPath.Length), file.Extension),
						leaf = true
					});
			}

			return res;
		}

		String GetArticleOutputInfo(FileInfo file, out DateTime lastWriteTime)
		{
			var outputPath = Path.Combine(OutputPath, file.FullName.Substring(BaseSrcPath.Length).Replace(Path.DirectorySeparatorChar, '.'));
			outputPath = Path.ChangeExtension(outputPath, ".html");
			if (File.Exists(outputPath))
				lastWriteTime = File.GetLastWriteTime(outputPath);
			else
				lastWriteTime = DateTime.MinValue;
			return outputPath;
		}

		private string ProcessMarkdownArticle(FileInfo file)
		{
			DateTime outputLastWriteTime;
			var outputPath = GetArticleOutputInfo(file, out outputLastWriteTime);
			if (file.LastWriteTime > outputLastWriteTime)
			{
				WriteHtmlFile(outputPath, ReadAndTransformMarkdownFile(file.FullName));
				return ArticleUrl(outputPath, file.LastWriteTime);
			}
			return ArticleUrl(outputPath, outputLastWriteTime);
		}

		private string ProcessHtmlArticle(FileInfo file)
		{
			DateTime outputLastWriteTime;
			var outputPath = GetArticleOutputInfo(file, out outputLastWriteTime);
			if (file.LastWriteTime > outputLastWriteTime)
			{
				WriteHtmlFile(outputPath, File.ReadAllText(file.FullName));
				return ArticleUrl(outputPath, file.LastWriteTime);
			}
			return ArticleUrl(outputPath, outputLastWriteTime);
		}

		String ArticleUrl(String filePath, DateTime lastWriteTime)
		{
			var vpath = filePath.Substring(OutputPath.Length).Replace(Path.DirectorySeparatorChar, '/');
			return DextopUtil.AbsolutePath(DextopUtil.CombinePaths("guides/html", vpath)) + "?cb=" + Math.Abs(lastWriteTime.GetHashCode());
		}

		String ConvertToId(String id, String extension)
		{
			if (!String.IsNullOrEmpty(extension))
				id = id.Substring(0, id.Length - extension.Length);
			return id.Replace('\\', '.').Replace(' ', '-');
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

		void WriteHtmlFile(String output, String html)
		{
			using (var writer = File.CreateText(output))
			{
				writer.WriteLine("<html>");
				writer.WriteLine("<head>");
				writer.WriteLine("<link href=\"../../client/css/showcase.css\" type=\"text/css\" rel=\"stylesheet\" />");
                writer.WriteLine("<link href=\"../../client/lib/prettify/prettify.css\" type=\"text/css\" rel=\"stylesheet\" />");
                writer.WriteLine("<meta name=\"robots\" content=\"noindex\">");
				writer.WriteLine("</head>");
                writer.WriteLine("<body onload=\"prettyPrint()\">");
				//writer.WriteLine(html.Replace("<pre><code>", "<pre class=\"prettyprint\"><code>"));
                writer.WriteLine(html);
                writer.WriteLine("<script type=\"text/javascript\" src=\"../../client/lib/prettify/prettify.js\"></script>");
                writer.WriteLine("<script type=\"text/javascript\">window['PR_TAB_WIDTH'] = 4;</script>");
				writer.WriteLine("</body>");
				writer.WriteLine("</html>");
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