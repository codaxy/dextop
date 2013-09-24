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
        class TestController1 : DextopApiController
        {
            public TestController1(int a) { }
        }

        class TestController2 : DextopApiController
        {
            public TestController2(int a, String b) { }
        }

        class TestController3 : DextopApiController
        {
            public TestController3(Guid g) {}
        }

        class TestController4 : DextopApiController
        {
            public TestController4(Guid? nep = null) { }
        }


        [Test]
        public void ScopedResolutionWorks()
        {
            var cb = new ContainerBuilder();
            cb.RegisterModule(new DextopApiAutofacModule());
            cb.RegisterType<TestController1>();
            cb.RegisterType<TestController2>();
            cb.RegisterType<TestController3>();
            cb.RegisterType<TestController4>();
            using (var c = cb.Build())
            {
                var f = c.Resolve<DextopApiContext>();
                var args = new DextopConfig();
                args["a"] = 5;
                args["b"] = "5";
                args["g"] = Guid.NewGuid().ToString();
                f.Scope = args;
                var controller1 = f.ResolveScoped(typeof(TestController1));
                var controller2 = f.ResolveScoped(typeof(TestController2));
                var controller3 = f.ResolveScoped(typeof(TestController3));
                var controller4 = f.ResolveScoped(typeof(TestController4));
            }
        }

        [Test]
        public void DefaultParametersTest()
        {
            var cb = new ContainerBuilder();
            cb.RegisterModule(new DextopApiAutofacModule());
            cb.RegisterType<TestController1>();
            cb.RegisterType<TestController2>();
            cb.RegisterType<TestController3>();
            cb.RegisterType<TestController4>();
            using (var c = cb.Build())
            {
                var f = c.Resolve<DextopApiContext>();                              
                var controller4 = f.ResolveScoped(typeof(TestController4));
            }
        }

    }
}
