using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;

namespace Codaxy.Common.Ftp
{
    public class FTP
    {
        String username;
        String password;
        String ftp;

        public FTP(String un, String pass, String ftp)
        {
            this.username = un;
            this.password = pass;
            this.ftp = ftp;
        }

        FtpWebRequest CreateRequest(String filename, String virtualPath)
        {
            if (virtualPath == null)
                virtualPath = String.Empty;
            String fn = (new FileInfo(filename)).Name;
            FtpWebRequest ftpup = (FtpWebRequest)FtpWebRequest.Create(ftp.TrimEnd('/') + "/" + virtualPath + fn);
            ftpup.Credentials = new NetworkCredential(username, password);
            return ftpup;
        }
        public void UploadFile(String filename)
        {
            UploadFile(filename, null);
        }

        public void UploadFile(String filename, String targetPath)
        {
            byte[] data = File.ReadAllBytes(filename);

            FtpWebRequest ftpup = CreateRequest(filename, targetPath);
            ftpup.Method = WebRequestMethods.Ftp.UploadFile;
            ftpup.Timeout = 1000 * 1 * 60; //1 minute

            var s = ftpup.GetRequestStream();
            s.Write(data, 0, data.Length);
            s.Close();
            var res = ftpup.GetResponse();
            res.Close();
        }

        public DateTime GetFileLastModified(String filename)
        {
            FtpWebRequest request = CreateRequest(filename, null);
            request.Method = WebRequestMethods.Ftp.GetDateTimestamp;
            request.Timeout = 1000;
            request.ReadWriteTimeout = 1000;  
            
            FtpWebResponse response = (FtpWebResponse)request.GetResponse();
            DateTime dt = response.LastModified;
            response.Close();
            return dt;
        }

        public void DownloadFile(String filename, String outFilename)
        {
            FtpWebRequest request = CreateRequest(filename, null);
            request.Method = WebRequestMethods.Ftp.DownloadFile;
            request.UseBinary = true;            
            FtpWebResponse response = (FtpWebResponse)request.GetResponse();
            Stream ftpStream = response.GetResponseStream();
            FileStream outputStream = new FileStream(outFilename, FileMode.Create);
            long cl = response.ContentLength;
            int bufferSize = 2048;
            int readCount;
            byte[] buffer = new byte[bufferSize];

            readCount = ftpStream.Read(buffer, 0, bufferSize);
            while (readCount > 0)
            {
                outputStream.Write(buffer, 0, readCount);
                readCount = ftpStream.Read(buffer, 0, bufferSize);
            }

            ftpStream.Close();
            outputStream.Close();
            response.Close();
        }
    }
}
