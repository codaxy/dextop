using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaTest;

namespace Codaxy.Dextop.Tests.Tests.Misc
{
    [TestFixture]
    class DextopConfigTests
    {
        [Test]
        public void SafeGetGuidTest()
        {
            var v = Guid.NewGuid();
            var sg = new DextopConfig() { { "Key", v } };

            Guid result;
            Assert.AreEqual(true, sg.TryGet("Key", out result));
            Assert.AreEqual(result, v);
        }

        [Test]
        public void SafeGetGuidFromStringTest()
        {
            var v = Guid.NewGuid();
            var sg = new DextopConfig() { { "Key", v.ToString() } };

            Guid result;
            Assert.AreEqual(true, sg.TryGet("Key", out result));
            Assert.AreEqual(result, v);
        }

        [Test]
        public void SafeGetNullableGuidFromStringTest()
        {
            var v = Guid.NewGuid();
            var sg = new DextopConfig() { { "Key", v.ToString() } };

            Guid? result;
            Assert.AreEqual(true, sg.TryGet("Key", out result));
            Assert.AreEqual(result, v);
        }

        [Test]
        public void SafeGetNullableGuidFromStringTest2()
        {            
            var sg = new DextopConfig() { { "Key", null } };

            Guid? result;
            Assert.AreEqual(false, sg.TryGet("Key", out result));
            Assert.AreEqual(result, null);
        }
    }
}
