using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.IO;

namespace Codaxy.Common.Localization
{
    public class UnsupportedLocalizationTypeException : Exception { }

    public interface ILocalizationStore
    {
        T Get<T>() where T : new();
        Field[] GetTypeLocalizationData(Type t);
    }

    public interface ILocalizer
    {
        ILocalizationStore GetLocalizationStore(String langCode);
        T Get<T>(String langCode) where T : new();        
    }

    public class DummyLocalizer : ILocalizer
    {
        DummyLocalizationStore store = new DummyLocalizationStore();

        #region ILocalizer Members

        public ILocalizationStore GetLocalizationStore(string langCode)
        {
            return store;
        }

        public T Get<T>(string langCode) where T : new()
        {
            return GetLocalizationStore(langCode).Get<T>();
        }        

        #endregion
    }

    public class DummyLocalizationStore : ILocalizationStore
    {
        #region ILocalizationStore Members

        public T Get<T>() where T : new()
        {
            return new T();
        }

        public Field[] GetTypeLocalizationData(Type t) { return null; }

        #endregion
    }


}
