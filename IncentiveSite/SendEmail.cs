using EntityLib;
using System;
using System.Configuration;
using System.Data;
using System.IO;

namespace IncentiveSite
{
    public class SendEmail
    {
        public string To { get; set; }
        public string From { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string Password { get; set; }
               
        public static void SendMailUser(string from, string username, string wordPass)
        {
            var email = EmailUserWelcome(from, username, wordPass);
            var response = Utilities.SendPassword(email);

        }
        public static SendEmail EmailUserWelcome(string from, string username, string wordPass)
        {
            string site = ConfigurationManager.AppSettings["SitePassword"].ToString();
            DataTable dt = new DataTable();
            dt = Utilities.GetConfig();
            var email = new SendEmail();
            email.From = dt.Rows[0]["AdminEmail"].ToString();
            var wordEncrypted = dt.Rows[0]["AdminPassword"].ToString();
            var password = Encryptor.Decrypted(wordEncrypted);
            email.Password = password;
            email.Port = Convert.ToInt32(dt.Rows[0]["Port"]);
            email.Subject = "Bienvenido a tu cuenta.";
            email.Host = dt.Rows[0]["Host"].ToString();
            email.To = from;
            email.Body = createEmailBodyUserWelcome(username, site, wordPass);

            return email;
        }

        private static string createEmailBodyUserWelcome(string userName, string url, string wordPass)
        {

            string body = string.Empty;

            using (StreamReader reader = new StreamReader(System.Web.HttpContext.Current.Server.MapPath("~/TemplatesEmail/UserWelcome.html")))
            {
                body = reader.ReadToEnd();
            }

            body = body.Replace("{UserName}", userName);

            body = body.Replace("{Url}", url);

            body = body.Replace("{SecretWord}", wordPass);

            return body;

        }



    }

}