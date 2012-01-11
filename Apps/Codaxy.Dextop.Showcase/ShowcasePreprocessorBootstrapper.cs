using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Preprocessor;

namespace Codaxy.Dextop.Showcase
{
#if !DEBUG
    public class ShowcasePreprocessorBootstrapper : IDextopApplicationBootsraper
    {
        public DextopApplication CreateApplication()
        {
            return new ShowcaseApplication()
            {
                Optimize = true,
                PreprocessorMode = true,
                PreprocessingEnabled = true
            };
        }
    }
#endif
}