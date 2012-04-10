using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Reflection;
using System.IO;
using Codaxy.Dextop.Tools;
using Codaxy.Common.Reflection;
using System.Globalization;
using Codaxy.Common.Globalization;


namespace Codaxy.Dextop.Showcase.Demos
{
    public class DemoPreprocessor : IDextopAssemblyPreprocessor
    {
        public void ProcessAssemblies(DextopApplication application, IList<Assembly> assemblies, Stream output)
        {            
            using (var tw = new StreamWriter(output))
            {
                DextopJsWriter jw = new DextopJsWriter(tw);
                var assembly = this.GetType().Assembly;
                var data = AssemblyHelper.GetTypeAttributeDictionaryForAssembly<DemoAttribute>(assembly, false);
                jw.ExtNamespace("Showcase");
                jw.Write("Showcase.Demos = [");
                bool first = true;

                HashSet<String> levels = new HashSet<string>();
                HashSet<String> categories = new HashSet<string>();
                HashSet<String> topics = new HashSet<string>();
                
                foreach (var entry in data)
                {                    
                    var att = entry.Value;
                    if (first)
                        first = false;
                    else
                        jw.Write(", ");
                    jw.StartBlock();
                    jw.AddProperty("id", att.Id);
                    jw.DefaultProperty("title", att.Title);
                    jw.DefaultProperty("description", att.Description);
                    jw.AddProperty("clientLauncher", att.ClientLauncher);
                    LevelAttribute level;
                    if (AttributeHelper.TryGetAttribute<LevelAttribute>(entry.Key, out level, false))
                        jw.AddProperty("level", level.Name);
                    TopicAttribute topic;
                    if (AttributeHelper.TryGetAttribute<TopicAttribute>(entry.Key, out topic, false))
                        jw.AddProperty("topic", topic.Name);
                    CategoryAttribute cat;
                    if (AttributeHelper.TryGetAttribute<CategoryAttribute>(entry.Key, out cat, false))
                        jw.AddProperty("category", cat.Name);

                    jw.AddProperty("sourceUrlBase", DextopUtil.AbsolutePath(String.Format("source/{0}", att.Id)));
					jw.AddProperty("cacheBuster", GetCacheBuster(att));

                    jw.CloseBlock();
                    ((ShowcaseApplication)application).RegisterDemo(att.Id, entry.Key);

                    if (!levels.Contains(level.Name))
                        levels.Add(level.Name);
                    
                    if (!topics.Contains(topic.Name))
                        topics.Add(topic.Name);
                    
                    if (!categories.Contains(cat.Name))
                        categories.Add(cat.Name);
                }
                jw.WriteLine("];");
                jw.WriteLine();
                jw.Write("Showcase.Topics = ");
                jw.Write(DextopUtil.Encode(topics.ToArray()));
                jw.WriteLine(";");
                jw.WriteLine();
                jw.Write("Showcase.Levels = ");
                jw.Write(DextopUtil.Encode(levels.ToArray()));
                jw.WriteLine(";");
                jw.WriteLine();
                jw.Write("Showcase.Categories = ");
                jw.Write(DextopUtil.Encode(categories.ToArray()));
                jw.WriteLine(";");
            }
        }

		private int GetCacheBuster(DemoAttribute att)
		{
			DateTime lastWrite = DateTime.MinValue;
			foreach (var ext in new [] { "txt", "cs", "js", "html"})
			{
				String vsource = String.Format("{0}/{1}.{2}", att.Path, att.Id, ext);
				var fileInfo = new FileInfo(DextopUtil.MapPath(vsource));
				if (fileInfo.Exists)
				{
					var lw = fileInfo.LastWriteTime;
					if (lw > lastWrite)
						lastWrite = lw;
				}
			}
			return Math.Abs(lastWrite.GetHashCode());
		}
    }
}