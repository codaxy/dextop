using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase.Demos
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CategoryAttribute : System.Attribute
    {
        public String Name { get; set; }
    }

    public class CategoryTutorialAttribute : CategoryAttribute
    {
        public CategoryTutorialAttribute() { Name = "Tutorial"; }
    }

    public class CategoryDemoAttribute : CategoryAttribute
    {
        public CategoryDemoAttribute() { Name = "Demo"; }
    }

    public class CategoryCodeSnippetAttribute : CategoryAttribute
    {
        public CategoryCodeSnippetAttribute() { Name = "Code Snippet"; }
    }

    public class BestPracticeCategoryAttribute : CategoryAttribute
    {
        public BestPracticeCategoryAttribute() { Name = "Best Practice"; }
    }

    public class CategoryGettingStartedAttribute : CategoryAttribute
    {
        public CategoryGettingStartedAttribute() { Name = "Getting Started"; }
    }

    public class CategoryFeatureAttribute : CategoryAttribute
    {
        public CategoryFeatureAttribute() { Name = "Feature"; }
    }
}