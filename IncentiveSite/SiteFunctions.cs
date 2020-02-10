using EntityLib;
using Microsoft.AspNet.Identity.Owin;
using RestSharp;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using Attribute = EntityLib.Attribute;

namespace IncentiveSite
{
    public class SiteFunctions
    {
        public static List<Entity> GetValues(Entity Entidad, out string errmess)
        {
            errmess = "";
            string entidad = new JavaScriptSerializer().Serialize(Entidad);
            string server = ConfigurationManager.AppSettings["Host"].ToString();
            OperationResult opResult = SiteFunctions.sendMessage(server + "/api/IncomingMessage/GetEntity", entidad, Method.POST);

            if (!opResult.Success)
            {
                errmess = opResult.ErrMessage;
                return new List<Entity>();
            }
            else
            {
                if (opResult.RetVal == null)
                {
                    return new List<Entity>();
                }
                return opResult.RetVal;
            }
        }

        public static bool DeleteEntity(Entity Entidad, Method _method, out string errmess)
        {
            errmess = "";

            List<Entity> entities = new List<Entity>();
            string entidad = new JavaScriptSerializer().Serialize(Entidad);
            string server = ConfigurationManager.AppSettings["Host"].ToString();
            OperationResult opResult = sendMessage(server + "/api/IncomingMessage/DeleteEntity", entidad, _method);
            bool retval = true;


            if (!opResult.Success)
            {
                retval = false;
                errmess = opResult.ErrMessage;
            }


            return retval;
        }


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
        public static List<OperationResult> execListSelect(List<Entity> _listEntity)
        {

            string entidad = new JavaScriptSerializer().Serialize(_listEntity);
            string server = ConfigurationManager.AppSettings["Host"].ToString();
            List<OperationResult> listResults = sendListMessage(server + "/api/IncomingMessage/GetList", entidad);

            return listResults;
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
                else
                {
                    opResult.Success = response.Content.ToLower() == "true" ? true : false;
                    if (!opResult.Success)
                    {
                        opResult.ErrMessage = "Error al cargar el documento a Sharepoint";
                    }
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
        private static List<OperationResult> sendListMessage(string _urlApi, object _bodyParam)
        {
            try
            {
                var client = new RestClient(_urlApi);

                var request = new RestRequest(Method.POST);
                request.RequestFormat = DataFormat.Json;
                request.AddHeader("cache-control", "no-cache");
                request.AddHeader("Connection", "keep-alive");

                request.AddHeader("accept-encoding", "gzip, deflate");
                request.AddHeader("Cache-Control", "no-cache");
                request.AddHeader("Accept", "*/*");
                request.AddHeader("Content-Type", "application/json");

                if (_bodyParam != null)
                    request.AddParameter("undefined", _bodyParam, ParameterType.RequestBody);

                IRestResponse response = client.Execute(request);
                var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                serializer.MaxJsonLength = int.Parse(response.ContentLength.ToString());
                List<OperationResult> opResult = serializer.Deserialize(response.Content, typeof(List<OperationResult>)) as List<OperationResult>;
                return opResult;
            }
            catch (Exception exc)
            {
                List<OperationResult> opList = new List<OperationResult>();
                OperationResult opResult = new OperationResult();
                opResult.Success = false;
                opResult.ErrMessage = exc.Message;
                opList.Add(opResult);
                return opList;
            }
        }
        public static DataTable trnsformEntityToDT(List<Entity> _entities, bool _addEmpty = false)
        {
            DataTable retval = new DataTable();
            if (_entities != null)
            {

                foreach (Entity ent in _entities)
                {

                    if (retval.Columns.Count == 0)
                    {
                        foreach (Attribute attr in ent.Attributes)
                        {

                            retval.Columns.Add(attr.AttrName);
                        }
                    }

                    if (_addEmpty)
                    {
                        DataRow emptyRow = retval.NewRow();
                        retval.Rows.Add(emptyRow);
                    }
                    DataRow dr = retval.NewRow();
                    foreach (Attribute attr in ent.Attributes)
                    {
                        dr[attr.AttrName] = attr.AttrValue;

                    }
                    retval.Rows.Add(dr);

                }
            }
            return retval;
        }

        public static string DataTableToJSON(DataTable table)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            return jsSerializer.Serialize(parentRow);
        }


        public static SignInStatus Login(string Username, string Password, out string errmes)
        {
            errmes = "";
           
            var strConn = System.Configuration.ConfigurationManager.ConnectionStrings["ConnString"].ConnectionString;
            Password = Password.Replace("&", "amp;").Replace(" ", "esp;").Replace("?", "quest;").Replace("<", "lt;").Replace(">", "gt;").Replace("*", "ast;").Replace("%", "mod;").Replace(":", "doublepoint;").Replace(@"\", "backs;");

            var request = new RestRequest(Method.GET);
            Entity User = new Entity("SystemUser");
            User.connStr = strConn;
            User.Attributes.Add(new EntityLib.Attribute("UserId"));
            List<GroupWhere> lGWhere = new List<GroupWhere>();
            List<Where> lWhere = new List<Where>();
            Where where = new Where("Email", Username, "string", whereOperator.Equal);
            lWhere.Add(where);
            Where wherePass = new Where("Password", Password, "string", whereOperator.Equal);
            lWhere.Add(wherePass);

            GroupWhere gw = new GroupWhere();
            gw.LogicalOperatorWhere = logicalOperator.And;
            gw.LogicalOperatorGroup = logicalOperator.And;
            gw.listWhere = lWhere;

            lGWhere.Add(gw);
            User.GroupWheres = lGWhere;
            var opResult = User.selectRecord();

            SignInStatus retval = SignInStatus.Failure;
            if (opResult.RetVal.Count > 0)
            {
                retval = SignInStatus.Success;
            }
            else
            {
                errmes = "Usuario y/o contraseña incorrectos, favor de verificar.";
            }
            return retval;
        }
    }
}