using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaTest;
using Codaxy.Dextop.Tests.Helpers;

namespace Codaxy.Dextop.Tests.Tests
{
    [TestFixture]
    class DependencyResolverTests
    {
        [Test]
        public void RegisterInstanceTest()
        {
            var dr = new DextopDependencyResolver();
            dr.RegisterInstance(1);
            Assert.AreEqual(1, dr.GetService<int>());
        }

        [Test]
        public void RegisterFactoryTest()
        {
            var dr = new DextopDependencyResolver();
            dr.Register((resolver) => { return "AA"; });
            Assert.AreEqual("AA", dr.GetService<string>());
        }
    }
}
