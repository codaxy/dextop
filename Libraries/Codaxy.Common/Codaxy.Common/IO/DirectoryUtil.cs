using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace Codaxy.Common.IO
{
    public static class DirectoryUtil
    {
        public static void CopyDirectoryContents(DirectoryInfo source, DirectoryInfo target, bool move, bool overwrite)
        {
            if (!target.Exists)
                target.Create();

            foreach (DirectoryInfo dir in source.GetDirectories())
                CopyDirectoryContents(dir, target, move, overwrite);

            foreach (FileInfo file in source.GetFiles())
            {
                file.CopyTo(Path.Combine(target.FullName, file.Name), overwrite);
                if (move) file.Delete();
            }
            if (move) source.Delete();
        }

        public static void CopyDirectoryContents(String sourcePath, String targetPath, bool move, bool overwrite)
        {
            CopyDirectoryContents(new DirectoryInfo(sourcePath), new DirectoryInfo(targetPath), move, overwrite);
        }

        public static void DeleteIfExists(String path, bool recursive) 
        {
            if (System.IO.Directory.Exists(path))
                System.IO.Directory.Delete(path, recursive);
        }
    }
}
