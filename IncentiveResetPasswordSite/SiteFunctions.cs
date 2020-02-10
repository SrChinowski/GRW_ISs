using EntityLib;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace IncentiveResetPasswordSite
{
    public class SiteFunctions
    {
    


        public static bool SaveEntity(Entity Entidad, Method _method, out string errmess)
        {
            errmess = "";
            string entidad = new JavaScriptSerializer().Serialize(Entidad);
            string server = ConfigurationManager.AppSettings["Host"].ToString();
            OperationResult opResult = sendMessage(server + "/api/IncomingMessage", entidad, _method);
            bool retval = true;

            if (!opResult.Success)
            {
                retval = false;
                errmess = opResult.ErrMessage;
            }
            else
            {
                errmess = opResult.returnedId.ToString();
            }

            return retval;
        }
        private static OperationResult sendMessage(string _urlApi, object _bodyParam, Method _method, bool _isAttachment = false)
        {
            try
            {
                var client = new RestClient(_urlApi);

                var request = new RestRequest(_method);
                request.RequestFormat = DataFormat.Json;
                request.AddHeader("cache-control", "no-cache");
                request.AddHeader("Connection", "keep-alive");

                request.AddHeader("accept-encoding", "gzip, deflate");
                request.AddHeader("Cache-Control", "no-cache");
                request.AddHeader("Accept", "*/*");
                request.AddHeader("Content-Type", "application/json");

                if (_bodyParam != null)
                    request.AddParameter("undefined", _bodyParam, ParameterType.RequestBody);
                try
                {
                    //if (ConfigurationManager.AppSettings["debug"].ToString() == "1")
                    //{
                    //    System.IO.File.WriteAllText(HttpContext.Current.Server.MapPath(@"\Logs\Request" + _method.ToString() + DateTime.Now.ToString("ddMMyyyyHHmmss")), _bodyParam.ToString(), Encoding.UTF8);
                    //}
                }
                catch (Exception)
                {
                }
                IRestResponse response = client.Execute(request);
                OperationResult opResult = new OperationResult();
                if (!_isAttachment)
                {
                    var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                    serializer.MaxJsonLength = int.Parse(response.ContentLength.ToString());

                    opResult = serializer.Deserialize(response.Content, typeof(OperationResult)) as OperationResult;
                }
               

                return opResult;
            }
            catch (Exception exc)
            {
                OperationResult opResult = new OperationResult();
                opResult.Success = false;
                opResult.ErrMessage = exc.Message;
                return opResult;
            }
        }


    }
}