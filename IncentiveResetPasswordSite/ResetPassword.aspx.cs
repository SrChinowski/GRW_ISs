using EntityLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace IncentiveResetPasswordSite
{
    public partial class ResetPassword : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        protected void Reset_Click(object sender, EventArgs e)
        {
            var strConn = System.Configuration.ConfigurationManager.ConnectionStrings["ConnString"].ConnectionString;
            if (ValidateData())
            {
                if (CheckExistUserByEmail(strConn, txt_Email.Text.Trim()))
                {
                    if (CheckPasswordByEmail(strConn, txt_Email.Text.Trim(), txt_PasswordOld.Text.Trim()))
                    {

                        if (SavePassword(strConn, txt_Email.Text.Trim()))
                        {
                            errorMessage.InnerText = "La contraseña se actualizó correctamente";
                            errorMessage.Visible = true;
                        }
                    }
                    else
                    {
                        errorMessage.InnerText = "La contraseña actual es incorrecta, favor de verificar.";
                        errorMessage.Visible = true;
                    }
                }
                else
                {
                    errorMessage.InnerText = "El correo ingresado no existe en el sistema, favor de verificar.";
                    errorMessage.Visible = true;
                }
            }
        }
        protected bool ValidateData()
        {
            bool val = true;

            if (txt_Email.Text == "")
            {

                errorMessage.InnerText = "El correo es obligatorio.";
                errorMessage.Visible = true;

                return false;
            }
            else if (txt_PasswordOld.Text == "")
            {
                errorMessage.InnerText = "La contraseña actual es obligatoria.";
                errorMessage.Visible = true;

                return false;
            }

            else if (txt_Password.Text == "" || txt_PasswordConfirm.Text == "")
            {
                errorMessage.InnerText = "La contraseña es obligatoria.";
                errorMessage.Visible = true;

                return false;
            }
            else if (txt_Password.Text != "" && txt_PasswordConfirm.Text != "")
            {
                if (txt_Password.Text.Trim() != txt_PasswordConfirm.Text.Trim())
                {
                    errorMessage.InnerText = "Las contraseñas no coinciden.";
                    errorMessage.Visible = true;

                    return false;
                }
                else if (txt_Password.Text.Trim().Length < 6)
                {
                    errorMessage.InnerText = "La contraseña debe tener al menos 8 carácteres.";
                    errorMessage.Visible = true;

                    return false;
                }

            }

            return val;

        }

        protected bool CheckExistUserByEmail(string strConn, string email)
        {
            bool exist = false;
            try
            {
                Entity User = new Entity("SystemUser");
                User.connStr = strConn;
                User.Attributes.Add(new EntityLib.Attribute("UserId"));
                List<GroupWhere> lGWhere = new List<GroupWhere>();
                List<Where> lWhere = new List<Where>();
                Where where = new Where("Email", email, "string", whereOperator.Equal);
                lWhere.Add(where);

                GroupWhere gw = new GroupWhere();
                gw.listWhere = lWhere;

                lGWhere.Add(gw);
                User.GroupWheres = lGWhere;
                var response = User.selectRecord();

                if (response.RetVal.Count > 0)
                {
                    exist = true;
                }

               
                return exist;
            }
            catch (Exception ex)
            {
                errorMessage.InnerText = ex.Message;
                errorMessage.Visible = true;
                return false;

            }

        }
        protected bool CheckPasswordByEmail(string strConn, string email,string pass)
        {
            bool correct = false;
            try
            {
                string wordEncrypted = Encryptor.Encrypt(pass);
                Entity User = new Entity("SystemUser");
                User.connStr = strConn;
                User.Attributes.Add(new EntityLib.Attribute("UserId"));
                List<GroupWhere> lGWhere = new List<GroupWhere>();
                List<Where> lWhere = new List<Where>();
                Where where = new Where("Email", email, "string", whereOperator.Equal);
                Where wherePass = new Where("Password", wordEncrypted, "string", whereOperator.Equal);
                lWhere.Add(where);
                lWhere.Add(wherePass);

                GroupWhere gw = new GroupWhere();
                gw.LogicalOperatorWhere = logicalOperator.And;
                gw.LogicalOperatorGroup = logicalOperator.And;
                gw.listWhere = lWhere;

                lGWhere.Add(gw);
                User.GroupWheres = lGWhere;
                var response = User.selectRecord();

                if (response.RetVal.Count > 0)
                {
                    correct = true;
                }


                return correct;
            }
            catch (Exception ex)
            {
                errorMessage.InnerText = ex.Message;
                errorMessage.Visible = true;
                return false;

            }

        }
        protected bool SavePassword(string strConn, string email)
        {

            try
            {
                string wordEncrypted = Encryptor.Encrypt(txt_Password.Text);

                Entity User = new Entity("SystemUser");
                User.connStr = strConn;
                User.Attributes.Add(new EntityLib.Attribute("Password", wordEncrypted, "string"));
                List<GroupWhere> lGWhere = new List<GroupWhere>();
                List<Where> lWhere = new List<Where>();
                Where where = new Where("Email", email, "string", whereOperator.Equal);
                lWhere.Add(where);
                GroupWhere gw = new GroupWhere();
                gw.listWhere = lWhere;

                lGWhere.Add(gw);
                User.GroupWheres = lGWhere;
                var response = User.UpdateRecord();
                return response.Success;
            }
            catch (Exception ex)
            {
                return false;

            }

        }
    }
}
