using EntityLib;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace IncentiveSite
{
    public class Utilities
    {
        public static Response SendPassword(SendEmail email)
        {
            Response response = new Response();
            try
            {
                var message = new MailMessage();
                message.To.Add(new MailAddress(email.To));
                message.From = new MailAddress(email.From);
                message.Subject = email.Subject;
                message.Body = email.Body;
                message.IsBodyHtml = true;
                using (var smtp = new SmtpClient())
                {
                    var credentials = new NetworkCredential
                    {
                        UserName = email.From,
                        Password = email.Password
                    };
                    smtp.Credentials = credentials;
                    smtp.Host = email.Host;
                    smtp.Port = email.Port;
                    smtp.EnableSsl = true;
                    smtp.Send(message);

                }

                response.Result = true;
                response.Msj = "Message Sent Successfully.";
            }
            catch (Exception ex)
            {
                response.Result = false;
                response.Msj = ex.Message;

            }
            return response;

        }

        public static DataTable GetConfig()
        {
            var strConn = System.Configuration.ConfigurationManager.ConnectionStrings["ConnString"].ConnectionString;

            DataTable dt = new DataTable();
            try
            {
                Entity config = new Entity("IncentiveSys");
                config.connStr = strConn;
                config.Attributes.Add(new EntityLib.Attribute("AdminEmail"));
                config.Attributes.Add(new EntityLib.Attribute("AdminPassword"));
                config.Attributes.Add(new EntityLib.Attribute("Port"));
                config.Attributes.Add(new EntityLib.Attribute("Host"));
                var response = config.selectRecord();
                dt = SiteFunctions.trnsformEntityToDT(response.RetVal);
            }
            catch (Exception ex)
            {
            }
            return dt;

        }
    }

    public class Response
    {
        public bool Result { get; set; }
        public string Msj { get; set; }
    }
}