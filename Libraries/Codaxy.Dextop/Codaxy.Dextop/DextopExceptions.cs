using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Codaxy.Dextop
{
	/// <summary>
	/// Base exception class for all Dextop exceptions.
	/// </summary>
    public class DextopException : Exception
    {
        /// <summary>
		/// Initializes a new instance of the DextopException class.
		/// </summary>
        public DextopException() { }
       
		/// <summary>
		/// Initializes a new instance of the DextopException class with a specified error message.
		/// </summary>
		/// <param name="message">The message that describes the error.</param>
        public DextopException(string message) : base(message) {}

		/// <summary>
		/// Initializes a new instance of the DextopException class with a specified error message.
		/// </summary>
		/// <param name="format">The format of the message.</param>
		/// <param name="args">The arguments used to format the message.</param>
		public DextopException(string format, params object[] args) : base(String.Format(format, args)) { }
       
		/// <summary>
		/// Initializes a new instance of the DextopException class with a specified
		///  error message and a reference to the inner exception that is the cause of
		///  this exception.
		/// </summary>
		/// <param name="message">The error message that explains the reason for the exception.</param>
		/// <param name="innerException"> The exception that is the cause of the current exception, or a null reference
		/// (Nothing in Visual Basic) if no inner exception is specified.</param>
        public DextopException(string message, Exception innerException) : base(message, innerException) { }
    }

	/// <summary>
	/// Internal Dextop exception.
	/// </summary>
    public class DextopInternalException : Exception
    {
		/// <summary>
		/// Internal Dextop exception.
		/// </summary>
        public DextopInternalException() : base("Internal Dextop error ocurred. This probably indicates a bug in Dextop Application Framework.") { }        
    }

	/// <summary>
	/// Session not found or expired exception.
	/// </summary>
    public class DextopSessionNotFoundException : DextopException
    {

		/// <summary>
		/// Session not found or expired exception.
		/// </summary>
        public DextopSessionNotFoundException() : base("Session is invalid or expired.") { }
    }

	/// <summary>
	/// Session is not initialized.
	/// </summary>
    public class DextopSessionNotInitializedException : DextopException
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopSessionNotInitializedException"/> class.
		/// </summary>
        public DextopSessionNotInitializedException() : base("Dextop session is not initialized. Add session to the application first.") { }
    }

	/// <summary>
	/// 
	/// </summary>
    public class InvalidDextopPackagePathException : DextopException
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="InvalidDextopPackagePathException"/> class.
		/// </summary>
		/// <param name="path">The path.</param>
        public InvalidDextopPackagePathException(String path) : base(String.Format("Invalid Dextop resource package path '{0}'.", path)) { }
    }

	/// <summary>
	/// 
	/// </summary>
    public class DextopNamespaceMappingException : DextopException
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopNamespaceMappingException"/> class.
		/// </summary>
		/// <param name="ns">The ns.</param>
        public DextopNamespaceMappingException(String ns) : base("Namespace '{0}' could not be mapped.", ns) { }
    }

	/// <summary>
	/// 
	/// </summary>
    public class InvalidDextopRemoteMethodCallException : DextopException
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="InvalidDextopRemoteMethodCallException"/> class.
		/// </summary>
        public InvalidDextopRemoteMethodCallException() : base("Remote method call in not valid. Check if remotable object exists on the server, and that all arguments are valid.") { }
    }

	/// <summary>
	/// 
	/// </summary>
    public class DextopRemotableNotRegisteredException : DextopException
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopRemotableNotRegisteredException"/> class.
		/// </summary>
        public DextopRemotableNotRegisteredException() : base("Remotable dextop object is not registered.") { }
    }

	/// <summary>
	/// Special type of the exception used to send messages to the client side.
	/// </summary>
    public class DextopMessageException : Exception
    {
		/// <summary>
		/// Gets or sets the type of the message.
		/// </summary>
		public DextopMessageType Type { get; set; }
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopMessageException"/> class.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <param name="message">The message.</param>
		public DextopMessageException(DextopMessageType type, String message) : base(message) { Type = type; }
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopMessageException"/> class.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <param name="messageFormat">The message format.</param>
		/// <param name="args">The args.</param>
		public DextopMessageException(DextopMessageType type, String messageFormat, params object[] args) : base(String.Format(messageFormat, args)) { Type = type; }
    }


	/// <summary>
	/// Special type of the exception used to send messages to the client side.
	/// </summary>
	public class DextopInfoMessageException : DextopMessageException
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopInfoMessageException"/> class.
		/// </summary>
		/// <param name="message">The message.</param>
		public DextopInfoMessageException(String message) : base(DextopMessageType.Info, message) { }
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopInfoMessageException"/> class.
		/// </summary>
		/// <param name="messageFormat">The message.</param>
		/// <param name="args">The args.</param>
		public DextopInfoMessageException(String messageFormat, params object[] args) : base(DextopMessageType.Info, messageFormat, args) { }
	}

	/// <summary>
	/// Special type of the exception used to send warnings to the client side.
	/// </summary>
    public class DextopWarningMessageException : DextopMessageException
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopWarningMessageException"/> class.
		/// </summary>
		/// <param name="message">The message.</param>
		public DextopWarningMessageException(String message) : base(DextopMessageType.Warning, message) { }
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopWarningMessageException"/> class.
		/// </summary>
		/// <param name="messageFormat">The message format.</param>
		/// <param name="args">The args.</param>
		public DextopWarningMessageException(String messageFormat, params object[] args) : base(DextopMessageType.Warning, messageFormat, args) { }
    }

	/// <summary>
	/// Special type of the exception used to send error messages to the client side.
	/// </summary>
    public class DextopErrorMessageException : DextopMessageException
    {
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopErrorMessageException"/> class.
		/// </summary>
		/// <param name="message">The message.</param>
		public DextopErrorMessageException(String message) : base(DextopMessageType.Error, message) { }
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopErrorMessageException"/> class.
		/// </summary>
		/// <param name="message">The message.</param>
		/// <param name="args">The args.</param>
		public DextopErrorMessageException(String message, params object[] args) : base(DextopMessageType.Error, message, args) { }
    }

	/// <summary>
	/// 
	/// </summary>
	public class DextopApplicationNotFoundException : DextopException
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopApplicationNotFoundException"/> class.
		/// </summary>
		public DextopApplicationNotFoundException() : base("Dextop application not found or registered. This exception usually indicates that an error has occurred during application startup.") { }
	}

    /// <summary>
    /// 
    /// </summary>
	public class DextopDependencyResolutionFailedException : DextopException
	{
        /// <summary>
        /// Initializes a new instance of the <see cref="DextopDependencyResolutionFailedException"/> class.
        /// </summary>
        /// <param name="type">The type.</param>
		public DextopDependencyResolutionFailedException(Type type) : base("Could not resolve service of type '{0}'.", type) { }
	}
}
