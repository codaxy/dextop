using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	//TODO: Merge this with message exceptions...

	/// <summary>
	/// A type of the sound to be played alongside notification.
	/// </summary>
	public enum DextopNotificationSound {
		
		/// <summary>
		/// No sound.
		/// </summary>
		None,
		
		/// <summary>
		/// Standard sound associated with the message type.
		/// </summary>
		Standard,
		
		/// <summary>
		/// A custom sound.
		/// </summary>
		Custom 
	};

	/// <summary>
	/// Dextop notification.
	/// </summary>
	public class DextopNotification
	{
		/// <summary>
		/// Gets or sets the message.
		/// </summary>
		public String Message { get; set; }
		/// <summary>
		/// Gets or sets the stack trace.
		/// </summary>
		public String StackTrace { get; set; }
		/// <summary>
		/// Gets or sets the type.
		/// </summary>
		public DextopMessageType Type { get; set; }
		/// <summary>
		/// Gets or sets the time.
		/// </summary>
		public DateTime? Time { get; set; }

		/// <summary>
		/// Gets or sets the sound.
		/// </summary>		
		public DextopNotificationSound Sound { get; set; }
		/// <summary>
		/// Gets or sets the custom sound.
		/// </summary>		
		public String CustomSound { get; set; }

		/// <summary>
		/// Gets or sets the message title.
		/// </summary>		
		public String Title { get; set; }

		/// <summary>
		/// Gets or sets a value indicating whether alert should be shown.
		/// </summary>		
		public bool Alert { get; set; }

		/// <summary>
		/// Create an exception alert notification.
		/// </summary>
		/// <param name="ex">The exception.</param>
		/// <returns></returns>
		public static DextopNotification ExceptionAlert(Exception ex)
		{
			return new DextopNotification
			{
				Alert = true,
				Type = DextopMessageType.Error,
				Sound = DextopNotificationSound.None,
				Time = DateTime.Now,
				StackTrace = ex is DextopMessageException ? null : ex.StackTrace,
				Message = ex.Message
			};
		}
	}

	public partial class DextopSession
	{
		class Notification
		{
			public String title { get; set; }
			public String message { get; set; }
			public String stackTrace { get; set; }
			public string type { get; set; }
			public DateTime? time { get; set; }

			public object sound { get; set; }			

			public bool alert { get; set; }
		}

		

		internal void SendNotification(DextopNotification notification)
		{
			object sound = null;
			switch (notification.Sound) {
				case DextopNotificationSound.Standard:
					sound = true;
					break;
				case DextopNotificationSound.Custom:
					sound = notification.CustomSound;
					break;
			}

			if (!notification.Time.HasValue)
				notification.Time = DateTime.Now;

			Remote.SendMessage(new
			{
				type = "notification",
				data = new Notification
				{
					alert = notification.Alert,
					message = notification.Message,
					sound = sound,
					stackTrace = notification.StackTrace,
					time = notification.Time,
					type = notification.Type.ToString().ToLower(),
					title = notification.Title
				}
			});
		}
	}
}
