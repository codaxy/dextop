using System;
using System.Collections.Generic;
using System.IO;
using System.Collections;

namespace Codaxy.Dextop.Tools
{
	/// <summary>
	/// Dextop js writer options.
	/// </summary>
    [Flags]
    public enum DextopJsWriterOptions
    {
		/// <summary>
		/// Default
		/// </summary>
        None = 0,
		/// <summary>
		/// Write localizible JS
		/// </summary>
        Localization = 1,
		/// <summary>
		/// ItemFactory support
		/// </summary>
        ItemFactory = 2,

		/// <summary>
		/// All options combined.
		/// </summary>
        All = -1
    }

	/// <summary>
	/// Class for generating JS files.
	/// </summary>
    public class DextopJsWriter
    {
        String extNs;

		/// <summary>
		/// DextopJsWriter constructor.
		/// </summary>
		/// <param name="output">The output writer.</param>
		/// <param name="options">The writer options.</param>
        public DextopJsWriter(TextWriter output, DextopJsWriterOptions options = DextopJsWriterOptions.None)
        {
            writer = output;
            Options = options;
        }

        int indent;
        TextWriter writer;
        bool blockStart;
        bool newLine;

		/// <summary>
		/// Gets the options associated with the writer.
		/// </summary>
        public DextopJsWriterOptions Options { get; private set; }

        /// <summary>
        /// Writes { and increases indent.
        /// </summary>
        public void StartBlock()
        {
            Write("{");
            indent++;
            blockStart = true;
        }

		/// <summary>
		/// Write the name of the property and a colon.
		/// </summary>
		/// <param name="name">The name.</param>
        public void WritePropertyName(String name)
        {
            CheckBlockStart();
            //Write("\"");
            Write(name);
            //Write("\"");
            Write(": ");
        }

		/// <summary>
		/// Add property { key:'value' }
		/// </summary>
		/// <param name="name">Name</param>
		/// <param name="value">Note that value will be quoted by default.</param>
		/// <param name="quote">Quote string values.</param>
        public void AddProperty(String name, object value, bool quote = true)
        {
            WritePropertyName(name);
            WriteValue(value, quote);
        }

		void WriteValue(object value, bool quote = true)
		{
			if (value == null)
				Write("null");
			else
			{
				if (value is String)
				{
					if (quote)
						Write("'{0}'", value);
					else
						Write(value.ToString());
                }
                else if (value is DextopLocalizedText)
                {
                    var lc = (DextopLocalizedText)value;
                    WriteLocalizedValue(lc.Text, lc.LocalizationPropertyName);
                }
                else
                    if (value is bool)
                        Write((bool)value ? "true" : "false");
                    else if (value is IDextopJsObject)
                        ((IDextopJsObject)value).WriteJs(this);
                    else if (value.GetType().IsArray)
                        WriteArray((IEnumerable)value);
                    else
                        Write(value.ToString());
			}
		}

        /// <summary>
        /// Add property without quouting the value. Useful for injecting code constructs for property value.
        /// </summary>
        /// <param name="name">Name of the property.</param>
        /// <param name="value">Property value.</param>
        public void AddRawProperty(string name, string value)
        {
            AddProperty(name, value, false);
        }

        /// <summary>
        /// Add property if value is not default value
        /// </summary>
		/// <param name="name">The name of the property.</param>
		/// <param name="value">The value of the propery.</param>
        public void DefaultRawProperty(string name, string value)
        {
            if (value != null)
                AddRawProperty(name, value);
        }

		/// <summary>
		/// Add key value pair if value is not default value
		/// </summary>
		/// <param name="name">The name of the property.</param>
		/// <param name="value">The value of the propery.</param>
        public void DefaultProperty(String name, object value)
        {
            if (value != null)
                AddProperty(name, value);
        }

        /// <summary>
        /// Add key value pair if value is not default value
        /// </summary>
        /// <param name="name">The name of the property.</param>
        /// <param name="value">The value of the propery.</param>
        /// <param name="defaultValue">The default value.</param>
        public void DefaultProperty(String name, int value, int defaultValue = 0)
        {
            if (value != defaultValue)
                AddProperty(name, value);
        }

		/// <summary>
		/// Add key value pair if value is not default value
		/// </summary>
		/// <param name="name">The name of the property.</param>
		/// <param name="value">The value of the propery.</param>
        public void DefaultProperty(String name, bool value)
        {
            if (value)
                AddProperty(name, value);
        }

		/// <summary>
		/// Add property with an object value.
		/// </summary>
		/// <param name="name">The value of the propery.</param>
		/// <param name="o">The value of the propery.</param>
        public void AddProperty(String name, IDextopJsObject o)
        {
            if (blockStart)
                WriteLine();
            else
                WriteLine(",");

            Write("\"");
            Write(name);
            Write("\": ");
            if (o == null)
                Write("null");
            else
                o.WriteJs(this);
        }

		/// <summary>
		/// Add JSON representation of the object
		/// </summary>
		/// <param name="o">The o.</param>
        public void WriteObject(IDextopJsObject o)
        {
            if (o == null)
                Write("null");
            else
                o.WriteJs(this);
        }

        /// <summary>
        /// Write '}' and decrease the indent;
        /// </summary>
        public void CloseBlock()
        {
            if (!blockStart)
                WriteLine();
            indent--;
            Write("}");
        }

        /// <summary>
        /// Write NewLine
        /// </summary>
        public void WriteLine()
        {
            writer.WriteLine();
            newLine = true;
            blockStart = false;
        }

        /// <summary>
        /// Write some text and go to next line
        /// </summary>
        /// <param name="line"></param>
        public void WriteLine(String line)
        {
            Write(line);
            WriteLine();
        }

        /// <summary>
        /// Writes formatted line.
        /// </summary>
        /// <param name="format">The string format.</param>
        /// <param name="p">The params.</param>
        public void WriteLine(String format, params object[] p)
        {
            WriteLine(String.Format(format, p));
        }

        /// <summary>
        /// Writes the specified text.
        /// </summary>
        /// <param name="text">The text.</param>
        public void Write(String text)
        {
            if (blockStart)
                WriteLine();
            Indent();
            writer.Write(text);
        }

        /// <summary>
        /// Indents to the current level.
        /// </summary>
        private void Indent()
        {
            if (newLine)
            {
                for (var i = 0; i < indent; i++)
                    writer.Write("\t");
                newLine = false;
            }
        }

        /// <summary>
        /// Write formatted text.
        /// </summary>
        /// <param name="format">The string format.</param>
        /// <param name="p">The params.</param>
        public void Write(String format, params object[] p)
        {
            Write(String.Format(format, p));
        }

        /// <summary>
        /// Register new Ext.namespace if neccessary
        /// </summary>
        /// <param name="ns">The namespace.</param>
        public void ExtNamespace(String ns)
        {
            if (ns != extNs)
            {
                WriteLine("Ext.namespace('{0}');", ns);
                WriteLine();
                extNs = ns;
            }
        }

        /// <summary>
        /// Adds key: array.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="a">Array</param>
        public void AddProperty(string name, IEnumerable<IDextopJsObject> a)
        {
            WritePropertyName(name);
            WriteArray(a);
        }

        /// <summary>
		/// Writes the array.
        /// </summary>
        /// <param name="a">Array</param>
        public void WriteArray(IEnumerable<IDextopJsObject> a)
        {
            if (a == null)
                Write("null");
            else
            {
                Write("[");
                bool first = true;
                foreach (var v in a)
                {
                    if (first)
                        first = false;
                    else
                        Write(", ");
                    if (v == null)
                        Write("null");
                    else
                        v.WriteJs(this);
                }
                Write("]");
            }
        }

		/// <summary>
		/// Writes the array.
		/// </summary>
		/// <param name="a">Array</param>
		public void WriteArray(IEnumerable a)
		{
			if (a == null)
				Write("null");
			else
			{
				Write("[");
				bool first = true;
				foreach (var v in a)
				{
					if (first)
						first = false;
					else
						Write(", ");
					if (v == null)
						Write("null");
					else
						WriteValue(v);
				}
				Write("]");
			}
		}

        /// <summary>
        /// Adds function block. e.g. : f: function(a1) {
        /// </summary>
        /// <param name="name">The name of the function.</param>
        /// <param name="args">The function arguments.</param>
        public void StartFunctionBlock(string name, params string[] args)
        {
            WritePropertyName(name);

            Write("function(");

            for (var i = 0; i < args.Length; i++)
            {
                if (i != 0)
                    Write(", ");
                Write(args[i]);
            }
            Write(")");
            StartBlock();
        }

        private void CheckBlockStart()
        {
            if (blockStart)
                WriteLine();
            else
                WriteLine(",");
        }

        /// <summary>
        /// Write raw js to the object. 
        /// </summary>
        /// <param name="raw"></param>
        public void WriteRawJs(String raw)
        {
            CheckBlockStart();
            Write(raw);
        }

        /// <summary>
        /// If cursor is not in the first row goes to new line
        /// </summary>
        public void CheckNewLine()
        {
            if (!newLine)
                WriteLine();
        }

        Dictionary<String, String> localizations;

		/// <summary>
		/// Starts the localization scope.
		/// </summary>
        public void StartLocalizationScope()
        {
            if (localizations != null)
                throw new InvalidOperationException("Previous localization scope is not closed.");
            localizations = new Dictionary<string, string>();
        }

		void AddLocalization(String name, String text)
        {
            if (localizations == null)
                throw new InvalidOperationException("Localization scope is not open.");
            localizations.Add(name, text);
        }

		/// <summary>
		/// Adds the localization property.
		/// </summary>
		/// <param name="name">The name of the localizible property.</param>
		/// <param name="value">The value of the property.</param>
		/// <param name="localizationName">Name of the property to hold localized text.</param>
        public void AddLocalizationProperty(String name, String value, String localizationName)
        {
            if (value == null)
                return;
            WritePropertyName(name);
            WriteLocalizedValue(value, localizationName);            
        }

        void WriteLocalizedValue(String value, String localizationName)
        {
            if (localizations != null && (Options & DextopJsWriterOptions.Localization) != 0)
            {
                AddLocalization(localizationName, value);
                WriteValue("this." + localizationName, false);
            }
            else
                WriteValue(value);
        }

		/// <summary>
		/// Writes the localization items to the current object.
		/// </summary>
        public void WriteLocalizations()
        {
            if (localizations != null)
            {
                foreach (var kv in localizations)
                    AddProperty(kv.Key, kv.Value);
                localizations = null;
            }
        }
    }
}