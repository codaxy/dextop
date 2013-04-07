using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Autofac;
using PetaTest;

namespace Codaxy.Dextop.Api
{
    [TestFixture(Active=true)]
    public class ControllerResolvingTests
    {
        class TestController1 : IDextopApiController
        {
            public TestController1(int a) { }
        }

        class TestController2 : IDextopApiController
        {
            public TestController2(int a, String b) { }
        }


        [Test]
        public void ResolutionWorks()
        {
            var cb = new ContainerBuilder();
            cb.RegisterModule(new DextopApiModule());
            cb.RegisterType<TestController1>();
            cb.RegisterType<TestController2>();
            using (var c = cb.Build())
            {
                var ff = c.Resolve<DextopApiControllerFactoryFactory>();
                var args = new DextopConfig();
                args["a"] = 5;
                args["b"] = "5";
                var f = ff(args);
                var controller1 = f.GetController(typeof(TestController1));
                var controller2 = f.GetController(typeof(TestController2));
            }
        }

    }
}
