<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ResetPassword.aspx.cs" Inherits="IncentiveResetPasswordSite.ResetPassword" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Password</title>
    <script src="Assets/js/jquery-3.4.1.min.js"></script>
    <script src="Assets/js/bootstrap.min.js"></script>
    <link href="Assets/css/bootstrap.min.css" rel="stylesheet" />
    <link href="Assets/css/IncentiveStyle.css" rel="stylesheet" />

    <script>
        $(document).ready(function () {

            var vHtml = getMenu();

            $('#dvMenu').html(vHtml);
        });
        function getMenu() {
            var vHtmlMenu = "";

            vHtmlMenu =
                "<nav class='navbar navbar-expand-lg navbar-dark bg-dark'>" +
                "<a class='navbar-brand' href='#'> Incentivos</a >" +
                "<button class='navbar-toggler' type='button' data-toggle='collapse'" +
                "data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent'" +
                "aria-expanded='false' aria-label='Toggle navigation'>" +
                "<span class='navbar-toggler-icon'></span>" +
                "</button>" +
                "</nav>";
            return vHtmlMenu;
        }
    </script>
</head>
<body>
    <div id="dvMenu"></div>
    <div class="row">
        <div id="login" class="col-lg-4 offset-lg-4 col-md-6 offset-md-3
                    col-12">
            <h2 class="text-center">Cambiar la contraseña</h2>

            <form id="frmPsw" runat="server">

                <div class="form-group">
                    <label for="txt_Email">Correo</label>
                    <asp:TextBox ID="txt_Email" name="email" runat="server"
                        class="form-control" type="email"
                        placeholder="Correo electrónico" required></asp:TextBox>
                </div>
                <div class="form-group">
                    <label for="txt_PasswordOld">Contraseña actual</label>
                    <asp:TextBox ID="txt_PasswordOld" name="password" runat="server"
                        class="form-control" type="password" MaxLength="30"
                        placeholder="Contraseña" required></asp:TextBox>
                </div>
                <div class="form-group">
                    <label for="txt_Password">Contraseña nueva</label>
                    <asp:TextBox ID="txt_Password" name="password" runat="server"
                        class="form-control" type="password" MaxLength="30"
                        placeholder="Contraseña" required></asp:TextBox>
              
                    <small id="passHelp" class="form-text text-muted">Su contraseña debe tener al menos 8 caracteres.</small>
                </div>
                <div class="form-group">
                    <label for="txt_PasswordConfirm">Confirme contraseña nueva</label>
                    <asp:TextBox ID="txt_PasswordConfirm" name="passwordConfirm" runat="server"
                        class="form-control" type="password" MaxLength="30"
                        placeholder="Contraseña" required></asp:TextBox>
                </div>
                <div class="alert alert-info" id="errorMessage" visible="false" runat="server"></div>
                <asp:Button ID="btnLogin" Text="Guardar" runat="server" type="button" class="btn btn-primary mb-2" OnClick="Reset_Click"></asp:Button>
                <br>
            </form>
        </div>
    </div>
</body>
</html>
