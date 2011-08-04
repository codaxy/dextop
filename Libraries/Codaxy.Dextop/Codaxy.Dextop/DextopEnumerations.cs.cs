using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Message type enumeration.
	/// </summary>
	public enum DextopMessageType
	{

		/// <summary>
		/// This value indicates an error message.
		/// </summary>
		Error,

		/// <summary>
		/// This value indicates a warning.
		/// </summary>
		Warning,

		/// <summary>
		/// This value indicates an informational message.
		/// </summary>
		Info
	};

	/// <summary>
	/// Session variable sharing type enumeration.
	/// </summary>
	public enum DextopSessionVariableSharing
	{
		/// <summary>
		/// Session variable is shared across all sessions.
		/// </summary>
		Global,

		/// <summary>
		/// Session variable is shared across all sessions with the same culture.
		/// </summary>
		Culture,

		/// <summary>
		/// Session variable is not shared.
		/// </summary>
		None
	};
}
