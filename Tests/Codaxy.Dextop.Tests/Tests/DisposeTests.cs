using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PetaTest;
using Codaxy.Dextop.Tests.Helpers;

namespace Codaxy.Dextop.Tests.Tests.Misc
{
    [TestFixture]
    class DisposeTests
    {
        [Test]
        public void SessionDisposesWindowsTest()
        {
            DextopEnvironment.SetProvider(new DextopTestEnvironment());

            var app = new DextopTestApplication();
            app.Initialize();

            var session = new DextopSession();
            app.AddSession(session);

            var win = new DextopWindow();
            session.Remote.Register(win);

            WeakReference ar = new WeakReference(app);
            WeakReference sr = new WeakReference(session);
            WeakReference wr = new WeakReference(win);

            app.Dispose();
            app = null;
            session = null;
            win = null;

            GC.Collect();
            GC.WaitForPendingFinalizers();

            Assert.AreEqual(false, ar.IsAlive);
            Assert.AreEqual(false, sr.IsAlive);
            Assert.AreEqual(false, wr.IsAlive);
        }
    }
}
