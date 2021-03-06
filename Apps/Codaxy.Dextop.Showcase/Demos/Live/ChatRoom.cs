﻿using System;
using System.Collections.Generic;
using System.Threading;
using Codaxy.Dextop.Data;
using System.Collections.Concurrent;
using Codaxy.Dextop.Remoting;
using Codaxy.Dextop.Forms;


namespace Codaxy.Dextop.Showcase.Demos.Live
{
    [Demo("ChatRoom",
        Title = "Chat Room",
		Description = "Chat with online Dextop users.",
        Path = "~/Demos/Live"
    )]
    [LevelAdvanced]
    [TopicDextopLive]
    [CategoryDemo]
    public class ChatWindow : DextopWindow
    {
		DextopObservableStore<int, ChatLine> store;
		
		static ConcurrentQueue<ChatLine> lines = new ConcurrentQueue<ChatLine>();
		static ConcurrentDictionary<ChatWindow, int> windows = new ConcurrentDictionary<ChatWindow, int>();

		bool registered;

		public ChatWindow()
        {
			store = new DextopObservableStore<int, ChatLine>(a => a.Id);
			store.SetMany(lines);
        }

        public override void InitRemotable(DextopRemote remote, DextopConfig config)
        {
            base.InitRemotable(remote, config);                      
            Remote.AddLiveStore("model", store);
			windows.TryAdd(this, 1);
        }

		void AddLine(ChatLine line)
		{
			store.Set(line);
			if (!registered)
			{
				registered = true;
				if (windows.Count == 1)
					EnterLine(new ChatLine
					{
						Name = "Dextop",
						Text = String.Format("Hi {0}, unfortunately you're alone here.", line.Name)
					});
				else
					EnterLine(new ChatLine
					{
						Name = "Dextop",
						Text = String.Format("Hi {0}, there are {1} people in the room.", line.Name, windows.Count)
					});
			}
		}

		void RemoveLine(ChatLine data)
		{
			store.Remove(data);
		}

		static int id;

		[DextopRemotable]
		void EnterLine(ChatLine data)
		{
			data.Id = Interlocked.Increment(ref id);
			data.Time = DateTime.Now;

			if (lines.Count > 100)
			{
				ChatLine old;
				lines.TryDequeue(out old);
				foreach (var win in windows)
					win.Key.RemoveLine(old);
			}

			lines.Enqueue(data);
			
			foreach (var win in windows)
				win.Key.AddLine(data);
		}

		public override void Dispose()
		{
			base.Dispose();
			int value;
			windows.TryRemove(this, out value);
		}

		[DextopModel]
		[DextopGrid]
		[DextopForm]
		class ChatLine
		{
			public int Id { get; set; }

			[DextopGridColumn(width = 60, type = "time")]
			public DateTime Time { get; set; }

			[DextopFormContainer(layout="hbox", border=false, title="Say something", bodyStyle= "padding: 5px")]
			[DextopGridColumn(width = 80)]
			[DextopFormField(labelAlign = "top", width=80, allowBlank=false)]
			public String Name { get; set; }

			[DextopGridColumn(flex = 1)]
			[DextopFormField(labelAlign = "top", flex = 1, margin = "0 0 0 5", allowBlank = false)]
			public string Text { get; set; }
		}
    }
}