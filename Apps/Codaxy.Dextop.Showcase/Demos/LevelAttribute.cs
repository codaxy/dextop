using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Codaxy.Dextop.Showcase.Demos
{
    [AttributeUsage(AttributeTargets.Class)]
    public class LevelAttribute : System.Attribute
    {
        public String Name { get; set; }
    }

    public class LevelBeginnerAttribute : LevelAttribute
    {
        public LevelBeginnerAttribute() { Name = "Beginner"; }
    }

    public class LevelMediumAttribute : LevelAttribute
    {
        public LevelMediumAttribute() { Name = "Medium"; }
    }

    public class LevelAdvancedAttribute : LevelAttribute
    {
        public LevelAdvancedAttribute() { Name = "Advanced"; }
    }
}