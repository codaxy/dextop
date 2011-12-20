using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Codaxy.Dextop.Remoting;
using PetaTest;

namespace Codaxy.Dextop.Tests.Tests.Dev
{
    class Demo : IDextopRemotable
    {
        [DextopRemotableConstructor]
        public Demo() { }
        public void Dispose() { }

        public DextopRemote Remote
        {
            get { throw new NotImplementedException(); }
        }

        public void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            throw new NotImplementedException();
        }
    }

    [TestFixture(Active=true)]
    public class ConstructorTests
    {
        [Test]
        public void Test1()
        {
            var type = typeof(Demo);
            var c = type.GetConstructors().Single();
            var cn = type.AssemblyQualifiedName;// Assembly.FullName + "." + type.Name + "#" + c.Name;

            Assert.IsNotNull(cn);
        }
    }
}
