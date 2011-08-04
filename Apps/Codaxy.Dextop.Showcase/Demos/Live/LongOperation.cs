using System;
using System.Collections.Generic;
using System.Threading;
using Codaxy.Dextop.Data;
using Codaxy.Dextop.Remoting;


namespace Codaxy.Dextop.Showcase.Demos.Live
{
	[Demo("LongOperation",
		Title = "Long Operation Progress",
        Description = "Notify user about progress in a long lasting server operation.",
        Path = "~/Demos/Live"
    )]
    [LevelMedium]
    [TopicDextopLive]
    [CategoryCodeSnippet]
	public class LongOperationWindow : DextopWindow
    {
		int itemCount;
		int currentItem;
		Timer timer;

		[DextopRemotable]
		void StartOperation()
		{
			if (timer != null)
				throw new DextopErrorMessageException("Another operation is in progress.");

			timer = new Timer(OnTimer, null, 50, 1000);
			currentItem = 0;
			itemCount = 10;
		}

		[DextopRemotable]
		void CancelCurrentOperation()
		{
			if (timer == null)
				throw new DextopErrorMessageException("No operation is currently active.");
			DisposeTimer();
			ReportProgress(0, "Canceled");
		}

		void OnTimer(object state)
		{
			currentItem++;
			if (currentItem < itemCount)
				ReportProgress(currentItem * 1.0 / itemCount, String.Format("Processed {0} of {1} items.", currentItem, itemCount));			
			else
			{
				DisposeTimer();
				ReportProgress(1, "Done");
			}
		}

		void ReportProgress(double progress, String message)
		{
			Remote.SendMessage(new
			{
				progress =  progress,
				message = message
			});
		}

		void DisposeTimer()
		{
			if (timer != null)
			{
				timer.Dispose();
				timer = null;
			}
		}

		public override void Dispose()
		{
			DisposeTimer();
			base.Dispose();
		}
    }
}