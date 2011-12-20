using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Codaxy.Dextop.Remoting;

namespace Codaxy.Dextop.Modules
{
	/// <summary>
	/// Includes the SoundManager2 library.
	/// </summary>
	public class DextopSoundModule : DextopModule
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="DextopSoundModule"/> class.
		/// </summary>
		public DextopSoundModule()
		{			
#if !DEBUG
			Minified = true;
#endif
		}

		/// <summary>
		/// Gets the name of the module.
		/// </summary>
		public override string ModuleName
		{
			get { return "sound"; }
		}

		/// <summary>
		/// Gets or sets a value indicating whether debug version should be used.
		/// </summary>		
		public bool Debug { get; set; }

		/// <summary>
		/// Gets or sets a value indicating whether minified version should be used.
		/// </summary>		
		public bool Minified { get; set; }

		Dictionary<String, String> sounds;

		/// <summary>
		/// Preconfigure a sound.
		/// </summary>
		/// <param name="name">The name.</param>
		/// <param name="url">The URL.</param>
		public void AddSound(String name, String url)
		{
			if (sounds == null)
				sounds = new Dictionary<string, string>();
			sounds.Add(name, DextopUtil.AbsolutePath(url));
		}

		/// <summary>
		/// Setup mapping of module's namespaces.
		/// </summary>
		protected override void InitNamespaces()
		{
			
		}

		/// <summary>
		/// Initializes the module resources.
		/// </summary>
		protected override void InitResources()
		{
			var path = "soundmanager2";
			if (!Debug)
				path += "-nodebug";
			if (Minified)
				path += "-jsmin";

			var pkg = CreateJsPackage("scripts");
			pkg.Register("", "SoundModule.js");
			pkg.Register("soundmanager2/script/", path + ".js");			
		}

		/// <summary>
		/// Register session within the module. Module can optionaly create a remotable object associated with the session.
		/// </summary>
		/// <param name="session"></param>
		/// <returns></returns>
		protected internal override Remoting.IDextopRemotable RegisterSession(DextopSession session)
		{
			var config = new DextopConfig();
			config.Add("url", DextopUtil.AbsolutePath(DextopUtil.CombinePaths(base.VirtualPath, "soundmanager2/swf")));
			if (sounds != null)
				config.Add("sounds", sounds);
			return new DextopRemotableConfig("Dextop.modules.SoundModule", config);
		}

        /// <summary>
        /// Override this module to register any of the assembly preprocessors.
        /// </summary>
        /// <param name="preprocessors">The preprocessors.</param>
        protected override void RegisterAssemblyPreprocessors(Dictionary<string, IDextopAssemblyPreprocessor> preprocessors)
        {

        }

        protected override void RegisterLoaders(Dictionary<string, IDextopFileLoader> loaders)
        {
            
        }
	}
}