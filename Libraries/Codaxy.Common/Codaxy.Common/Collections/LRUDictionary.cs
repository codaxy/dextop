using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Common.Collections
{
    public class LRUDictonary<K, V> : IDictionary<K, V>
    {
        public int Capacity { get; set; }

        public LRUDictonary(int capacity)
        {
            if (capacity < 1)
                throw new ArgumentOutOfRangeException("capacity must be > 0");
            Capacity = capacity;            
            dict = new Dictionary<K, LinkedListNode<KeyValuePair<K, V>>>(capacity);
            list = new LinkedList<KeyValuePair<K, V>>();
        }

        Dictionary<K, LinkedListNode<KeyValuePair<K, V>>> dict;
        LinkedList<KeyValuePair<K, V>> list;

        public void Add(K key, V value)
        {
            lock (list)
            {
                var kv = new KeyValuePair<K, V>(key, value);
                var first = list.AddFirst(kv);                
                dict.Add(key, first);                
                while (dict.Count > Capacity)
                    Remove(list.Last.Value);
            }
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
            lock (list)
            {
                LinkedListNode<KeyValuePair<K, V>> node;
                if (dict.TryGetValue(key, out node))
                {
                    list.Remove(node);
                    return dict.Remove(key);
                }
                return false;
            }
        }

        public bool TryGetValue(K key, out V value)
        {
            LinkedListNode<KeyValuePair<K, V>> node;
            lock (list)
            {
                if (dict.TryGetValue(key, out node))
                {
                    list.Remove(node);
                    list.AddFirst(node);
                    value = node.Value.Value;
                    return true;
                }
            }
            value = default(V);
            return false;
        }

        public ICollection<V> Values
        {
            get { return dict.Values.Select(a => a.Value.Value).ToArray(); }
        }

        public V this[K key]
        {
            get
            {
                lock (list)
                {
                    var node = dict[key];
                    list.Remove(node);
                    list.AddFirst(node);
                    return node.Value.Value;
                }
            }
            set
            {
                lock (list)
                {
                    LinkedListNode<KeyValuePair<K, V>> node;
                    if (dict.TryGetValue(key, out node))
                    {
                        list.Remove(node);
                        var pair = new KeyValuePair<K, V>(key, value);
                        node.Value = pair;
                        list.AddFirst(node);
                    }
                    else
                        Add(key, value);
                }
            }
        }

        public void Add(KeyValuePair<K, V> item)
        {
            Add(item.Key, item.Value);
        }

        public void Clear()
        {
            lock (list)
            {
                dict.Clear();
                list.Clear();
            }
        }

        public bool Contains(KeyValuePair<K, V> item)
        {
            LinkedListNode<KeyValuePair<K, V>> node;
            if (dict.TryGetValue(item.Key, out node))
                return node.Value.Value.Equals(item.Value);
            return false;
        }

        public void CopyTo(KeyValuePair<K, V>[] array, int arrayIndex)
        {
            lock (list)
            {
                foreach (var item in list)
                    array[arrayIndex++] = item;
            }
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
            return Remove(item.Key);
        }

        public IEnumerator<KeyValuePair<K, V>> GetEnumerator()
        {
            return list.GetEnumerator();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return list.GetEnumerator();
        }
    }
}
