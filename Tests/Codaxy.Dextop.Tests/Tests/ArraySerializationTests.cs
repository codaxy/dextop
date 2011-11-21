using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaTest;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Tests.Helpers;

namespace Codaxy.Dextop.Tests.Tests
{
    [TestFixture]
    public class ArraySerializationTests
    {
        [DextopModel]
        class Model
        {
            public int Id { get; set; }
            public String Name { get; set; }
            public bool Bool { get; set; }
        }

        [Test]
        public void DynamicArraySerializationTest()
        {
            using (var app = new DextopTestApplication())
            {
                var arraySerializer = new DextopModelDynamicArraySerializer(app.ModelManager.GetModelMeta(typeof(Model)));
                var data = arraySerializer.Serialize(new[] { new Model { Id = 1, Name = "Name", Bool = true } });
                Assert.AreEqual("[[1,\"Name\",true]]", JsonUtil.Encode(data));
            }
        }

        [Test]
        public void ArraySerializationTest()
        {
            using (var app = new DextopTestApplication())
            {
                var arraySerializer = new DextopModelArraySerializer(app.ModelManager.GetModelMeta(typeof(Model)));
                var data = arraySerializer.Serialize(new[] { new Model { Id = 1, Name = "Name", Bool = true } });
                Assert.AreEqual("[[1,\"Name\",true]]", JsonUtil.Encode(data));
            }
        }

        [Test]
        public void DynamicArraySerializationTest1()
        {
            DynamicArraySerializationTest(100);
        }

        [Test]
        public void DynamicArraySerializationTest11()
        {
            DynamicArraySerializationTest(100);
        }

        [Test]
        public void ArraySerializationTest1()
        {
            ArraySerializationTest(100);
        }

        [Test]
        public void DynamicArraySerializationTest10()
        {
            DynamicArraySerializationTest(10000);
        }        

        [Test]
        public void ArraySerializationTest10()
        {
            ArraySerializationTest(10000);
        }

        [Test]
        public void DynamicArraySerializationTest100()
        {
            DynamicArraySerializationTest(100000);
        }

        [Test]
        public void ArraySerializationTest100()
        {
            ArraySerializationTest(100000);
        }

        void ArraySerializationTest(int n)
        {
            using (var app = new DextopTestApplication())
            {
                var arraySerializer = new DextopModelArraySerializer(app.ModelManager.GetModelMeta(typeof(Model)));
                var list = new List<object>();
                for (var i = 0; i<n; i++)
                    list.Add(new Model { Id = 1, Name = "Name", Bool = true });
                var data = arraySerializer.Serialize(list);
                var str = DextopUtil.Encode(data);
            }
        }

        [Test]
        public void DynamicArraySerializationTest(int n)
        {
            using (var app = new DextopTestApplication())
            {
                var arraySerializer = new DextopModelDynamicArraySerializer(app.ModelManager.GetModelMeta(typeof(Model)));
                var list = new List<object>();
                for (var i = 0; i < n; i++)
                    list.Add(new Model { Id = 1, Name = "Name", Bool = true });
                var data = arraySerializer.Serialize(list);
                var str = DextopUtil.Encode(data);
            }
        }
    }
}
