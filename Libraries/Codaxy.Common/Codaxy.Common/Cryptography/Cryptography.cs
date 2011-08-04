using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;

namespace Codaxy.Common.Cryptography
{
    public class HashHelper
    {
        public static String SHA256(String text)
        {
            UTF8Encoding encoder = new UTF8Encoding();            
            SHA256Managed sha256hasher = new SHA256Managed();
            byte[] hashedDataBytes = sha256hasher.ComputeHash(encoder.GetBytes(text));
            return System.Convert.ToBase64String(hashedDataBytes);
        }
    
        public static String MD5(String text)
        {
            UTF8Encoding encoder = new UTF8Encoding();
            var md5 = new MD5CryptoServiceProvider();
            byte[] hashedDataBytes = md5.ComputeHash(encoder.GetBytes(text));
            return System.Convert.ToBase64String(hashedDataBytes);
        }
    }

    public class CertificateHelper
    {
        static Regex regex = new Regex("CN=(?<cn>[^,]+)");
        public static String GetCommonName(String fullName)
        {
            var match = regex.Match(fullName);
            if (match.Success)
                return match.Result("${cn}");
            else
                return "";
        }
    }
}
