<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TemplateForm.aspx.cs" Inherits="IncentiveSite.Templates.TemplateForm" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="Assets/js/jquery-3.4.1.min.js"></script>
    <script src="Assets/js/bootstrap.min.js"></script>
    <script src="Assets/js/ControllerFunctions.js"></script>
    <script src="Assets/js/ControllerCustomer.js"></script>
    <link href="Assets/css/bootstrap.min.css" rel="stylesheet" />
    <link href="ContentFabric/fabric.min.css" rel="stylesheet" />
    <link href="Assets/css/IncentiveStyle.css" rel="stylesheet" />
    <script>
        $(document).ready(function () {
        <%--    var isRequestAuthenticated = '<%=Request.IsAuthenticated%>';
            if (isRequestAuthenticated == "True") {--%>
            var vHtml = getMenu();
            $('#dvMenu').html(vHtml);

            var id = getUrlParameter('id');
            var result = getUrlParameter('result');

            if (id != '') {
                $("#hdnId").val(id);
                getEntity('Entidad', id);

            }
            //}
            //else {
            //    window.location.href = "Login.aspx";
            //}

        });
    </script>
    <title></title>
</head>
<body>
    <div id="dvMenu"></div>
    <br />
    <form id="frm" runat="server">
        <div class="container">
            <div class="panel panel-default">
                <div class="panel-heading"></div>
                <div id="dvInfo" class="alert alert-info" runat="server" style="display: none;">
                    <asp:Label ID="lblInfo" runat="server" Text=""></asp:Label>
                </div>
                <div class="panel-body">
                </div>

            </div>

        </div>
        <asp:HiddenField ID="hdnId" runat="server" />
    </form>
</body>
</html>
