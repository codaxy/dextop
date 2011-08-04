using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Linq.Expressions;
using System.Reflection;

namespace Codaxy.Dextop.Data
{
	/// <summary>
	/// In-memory data store proxy
	/// </summary>
	/// <typeparam name="T"></typeparam>
	/// <typeparam name="Id"></typeparam>
	public class DextopMemoryDataProxy<T, Id> : IDextopDataProxy<T> where T:class
	{
		readonly SortedList<Id, T> data = new SortedList<Id,T>();
		Func<T, Id> GetId { get; set; }
		Action<T, Id> SetId { get; set; }
		Func<Id, Id> GeneratedId { get; set; }

		/// <summary>
		/// Enable/disable paging.
		/// </summary>
		public bool Paging { get; set; }

		/// <summary>
		/// Store is readonly
		/// </summary>
		public bool ReadOnly { get; set; }

		/// <summary>
		/// LastId used
		/// </summary>
		public Id LastId { get; set; }

		/// <summary>
		/// Gets the number of the records in the store
		/// </summary>
		public int Count { get { return data.Count; } }

		/// <summary>
		/// Returns the list of records currently in the store.
		/// </summary>
		public T[] Records { get { return data.Values.ToArray(); } set { Load(value); } }

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopMemoryDataProxy&lt;T, Id&gt;"/> class.
		/// </summary>
		/// <param name="idGetter">The id getter.</param>
		/// <param name="idSetter">The id setter.</param>
		/// <param name="idGenerator">The id generator.</param>
		/// <param name="initData">The init data.</param>
		public DextopMemoryDataProxy(Func<T, Id> idGetter, Action<T, Id> idSetter = null, Func<Id, Id> idGenerator = null, IEnumerable<T> initData = null)
		{
			GetId = idGetter;
			SetId = idSetter;
			GeneratedId = idGenerator;
			if (initData != null)
				Load(initData);
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="DextopMemoryDataProxy&lt;T, Id&gt;"/> class.
		/// </summary>
		/// <param name="idPropertyExpression">The id property expression.</param>
		/// <param name="idGenerator">The id generator.</param>
		/// <param name="initData">The init data.</param>
		public DextopMemoryDataProxy(Expression<Func<T, Id>> idPropertyExpression, Func<Id, Id> idGenerator = null, IEnumerable<T> initData = null)
		{
			var memberExpression = (MemberExpression)idPropertyExpression.Body;
			var idProperty = (PropertyInfo)memberExpression.Member;
			GeneratedId = idGenerator;			
			GetId = (t) => { return (Id)idProperty.GetValue(t, null); };
			SetId = (t, id) => { idProperty.SetValue(t, id, null); };
		}

		Id GenerateNewId()
		{
			return LastId = GeneratedId(LastId);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="load"></param>
		public void Load(IEnumerable<T> load)
		{
			data.Clear();
			foreach (var r in load)
			{
				Id id;
				if (GeneratedId != null)
				{
					id = GenerateNewId();
					SetId(r, id);
				}
				else
					id = GetId(r);
				data.Add(id, r);
			}
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="records"></param>
		/// <returns></returns>
		public IList<T> Create(IList<T> records)
		{
			if (ReadOnly)
				throw new NotSupportedException();
			foreach (var r in records)
			{
				var id = GenerateNewId();
				SetId(r, id);
				data.Add(id, r);
			}
			return records;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="records"></param>
		/// <returns></returns>
		public IList<T> Destroy(IList<T> records)
		{
			if (ReadOnly)
				throw new NotSupportedException();
			foreach (var r in records)
			{
				var id = GetId(r);
				data.Remove(id);
			}
			return new T[0];
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="records"></param>
		/// <returns></returns>
		public IList<T> Update(IList<T> records)
		{
			if (ReadOnly)
				throw new NotSupportedException();
			foreach (var r in records)
			{
				var id = GetId(r);
				data[id] = r;
			}
			return records;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="filter"></param>
		/// <returns></returns>
		public DextopReadResult<T> Read(DextopReadFilter filter)
		{
			if (Paging)
				return DextopReadResult.CreatePage(data.Values.AsQueryable(), filter);
			return DextopReadResult.Sort(data.Values.AsQueryable(), filter);
		}
	}
}
