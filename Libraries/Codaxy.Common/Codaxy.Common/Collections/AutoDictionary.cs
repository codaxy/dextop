using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common.Collections
{
	/// <summary>
	/// Thread safe dictionary with create value delegate
	/// </summary>
	/// <typeparam name="K"></typeparam>
	/// <typeparam name="V"></typeparam>
    public class AutoDictionary<K, V> : IDictionary<K, V>
    {
        public delegate V CreateDelegate(K key);

        public AutoDictionary(Func<K, V> createDelegate)
        {
            create = createDelegate;
            dict = new Dictionary<K, V>();
        }

		public AutoDictionary(Func<K, V> createDelegate, IEqualityComparer<K> comparer)
        {
            create = createDelegate;
            dict = new Dictionary<K, V>(comparer);
        }

        Dictionary<K, V> dict;
		Func<K, V> create;
        object lockObject = new object();

        public object LockObject { get { return lockObject; } set { lockObject = value; } }

        public V Get(K key)
        {
            V res;
            if (dict.TryGetValue(key, out res))
                return res;
            lock (lockObject)
            {
                if (dict.TryGetValue(key, out res))
                    return res;
                return dict[key] = create(key);
            }
        }

        #region IDictionary<K,V> Members

        public void Add(K key, V value)
        {
            dict.Add(key, value);
        }

        public bool ContainsKey(K key)
        {
            return dict.ContainsKey(key);
        }

        public ICollection<K> Keys
        {
            get { return dict.Keys; }
        }

        public bool Remove(K key)
        {
            return dict.Remove(key);
        }

        public bool TryGetValue(K key, out V value)
        {
            return dict.TryGetValue(key, out value);
        }

        public ICollection<V> Values
        {
            get { return dict.Values; }
        }

        public V this[K key]
        {
            get
            {
                return Get(key);
            }
            set
            {
                dict[key] = value;
            }
        }

        #endregion

        #region ICollection<KeyValuePair<K,V>> Members

        public void Add(KeyValuePair<K, V> item)
        {            
            dict.Add(item.Key, item.Value);
        }

        public void Clear()
        {
            dict.Clear();            
        }

        public bool Contains(KeyValuePair<K, V> item)
        {
            return dict.Contains(item);
        }

        public void CopyTo(KeyValuePair<K, V>[] array, int arrayIndex)
        {
            foreach (var v in this)
                array[arrayIndex++] = v;
        }

        public int Count
        {
            get { return dict.Count; }
        }

        public bool IsReadOnly
        {
            get { return false; }
        }

        public bool Remove(KeyValuePair<K, V> item)
        {
            lock (lockObject)
            {
                return dict.Remove(item.Key);
            }
        }

        #endregion

        #region IEnumerable<KeyValuePair<K,V>> Members

        public IEnumerator<KeyValuePair<K, V>> GetEnumerator()
        {
            return dict.GetEnumerator();
        }

        #endregion

        #region IEnumerable Members

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return ((System.Collections.IEnumerable)dict).GetEnumerator();
        }

        #endregion
    }
}
