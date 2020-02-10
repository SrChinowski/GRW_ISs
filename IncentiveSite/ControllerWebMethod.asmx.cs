using EntityLib;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace IncentiveSite
{
    /// <summary>
    /// Descripción breve de ControllerWebMethod
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class ControllerWebMethod : System.Web.Services.WebService
    {

        [WebMethod]
        public Response SaveEntity(object DataEntity)
        {
            Response resp = new Response();
            bool resultado = false;

            try
            {
                string errmess = string.Empty;
                Entity entity = new JavaScriptSerializer().ConvertToType<Entity>(DataEntity);
                resultado = SiteFunctions.SaveEntity(entity, Method.POST, out errmess);

                resp.Result = resultado;
                resp.Msj = errmess;
            }
            catch (Exception ex)
            {
            }
            return resp;
        }
        [WebMethod]
        public Response SaveEntityUser(object CheckExist, object DataEntity)
        {
            Response resp = new Response();
            bool resultado = false;

            try
            {
                string errmess = string.Empty;
                var result = GetListEntity(CheckExist);
                //if (result == "[]")
                //{
                Entity entity = new JavaScriptSerializer().ConvertToType<Entity>(DataEntity);


                if (entity.ChildEntities.Count > 0)
                {
                    GeneratePasswordUser pass = new GeneratePasswordUser();

                    string strNewPassword = pass.GeneratePassword().ToString();
                    string wordEncrypted = Encryptor.Encrypt(strNewPassword);
                    entity.Attributes.Add(new EntityLib.Attribute("Password", wordEncrypted, "string"));
                    resultado = SiteFunctions.SaveEntity(entity, Method.POST, out errmess);

                    resp.Result = resultado;
                    resp.Msj = errmess;
                    if (resultado == true)
                    {
                        var username = entity.getAttrValueByName("FirstName");
                        var email = entity.getAttrValueByName("Email");
                        SendEmail.SendMailUser(email, username,strNewPassword);
                    }
                }
                else
                {
                    resp.Result = resultado;
                    resp.Msj = "Es necesario asignar un rol al usuario.";
                }
                //}
                //else
                //{
                //    resp.Result = resultado;
                //    resp.Msj = "Ya existe un usuario registrado con este correo electrónico.";

                //}
            }
            catch (Exception ex)
            {
            }
            return resp;
        }
        [WebMethod]
        public Response SaveEntities(object[] DataEntities)
        {
            Response resp = new Response();
            bool resultado = false;

            try
            {
                foreach (var item in DataEntities)
                {
                    string errmess = string.Empty;
                    Entity entity = new JavaScriptSerializer().ConvertToType<Entity>(item);
                    resultado = SiteFunctions.SaveEntity(entity, Method.POST, out errmess);
                    resp.Result = resultado;
                    resp.Msj = errmess;
                }

            }
            catch (Exception ex)
            {
            }
            return resp;
        }
        [WebMethod]
        public Response UpdateEntity(object DataEntity)
        {
            Response resp = new Response();
            bool resultado = false;

            try
            {
                string errmess = string.Empty;
                Entity entity = new JavaScriptSerializer().ConvertToType<Entity>(DataEntity);
                resultado = SiteFunctions.SaveEntity(entity, Method.PUT, out errmess);
                resp.Result = resultado;
                resp.Msj = errmess;
            }
            catch (Exception ex)
            {
            }
            return resp;
        }
        [WebMethod]
        public Response UpdateEntityDetails(object DataEntity, object[] DataEntities, object DataEntityDelete)
        {

            Response resp = new Response();


            try
            {

                resp = UpdateEntity(DataEntity);
                if (resp.Result == true)
                {
                    resp = DeleteEntity(DataEntityDelete);
                    if (resp.Result == true)
                    {
                        resp = SaveEntities(DataEntities);
                    }
                }


            }
            catch (Exception ex)
            {
            }
            return resp;
        }
        [WebMethod]
        public string GetListEntity(object DataEntity)
        {
            DataTable dtResult = new DataTable();
            string result = string.Empty;
            try
            {
                string errmess = string.Empty;
                List<Entity> lEntities = new List<Entity>();

                Entity entity = new JavaScriptSerializer().ConvertToType<Entity>(DataEntity);


                lEntities = SiteFunctions.GetValues(entity, out errmess);
                dtResult = SiteFunctions.trnsformEntityToDT(lEntities);

                dtResult.TableName = "dtResult";
                var str  = SiteFunctions.DataTableToJSON(dtResult);
                return str;
            }
            catch (Exception ex)
            {

            }

            return result;
        }
        [WebMethod]
        public Response DeleteEntity(object DataEntity)
        {
            Response resp = new Response();
            bool resultado = false;
            try
            {

                Entity entity = new JavaScriptSerializer().ConvertToType<Entity>(DataEntity);
                string errmess = string.Empty;
                resultado = SiteFunctions.DeleteEntity(entity, Method.POST, out errmess);
                resp.Result = resultado;
                resp.Msj = errmess;
            }
            catch (Exception ex)
            {
            }
            return resp;
        }
        [WebMethod]
        public string wsGetIsAuthenticated(object DataEntity)
        {
            DataTable dtResult = new DataTable();
            string result = string.Empty;
            try
            {
                string errmess = string.Empty;
                List<Entity> lEntities = new List<Entity>();

                Entity entity = new JavaScriptSerializer().ConvertToType<Entity>(DataEntity);


                lEntities = SiteFunctions.GetValues(entity, out errmess);
                dtResult = SiteFunctions.trnsformEntityToDT(lEntities);

                dtResult.TableName = "dtResult";

                return SiteFunctions.DataTableToJSON(dtResult);
            }
            catch (Exception ex)
            {

            }

            return result;
        }

        public class Response
        {

            public bool Result { get; set; }
            public string Msj { get; set; }


        }



    }
}

