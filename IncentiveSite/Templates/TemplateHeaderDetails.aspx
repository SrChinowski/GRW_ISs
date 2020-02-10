<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TemplateHeaderDetails.aspx.cs" Inherits="IncentiveSite.Templates.TemplateHeaderDetails" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="Assets/js/jquery-3.4.1.min.js"></script>
    <script src="Scripts/DataTables/jquery.dataTables.min.js"></script>
    <script src="Scripts/DataTables/dataTables.buttons.min.js"></script>
    <script src="Scripts/DataTables/buttons.html5.min.js"></script>
    <script src="Scripts/DataTables/jszip.min.js"></script>
    <script src="Assets/js/bootstrap.min.js"></script>
    <script src="Assets/js/ControllerFunctions.js"></script>
 <%--   <script src="Assets/js/ControllerEntidad.js"></script>--%>
    <link href="ContentDt/DataTables/css/jquery.dataTables.min.css" rel="stylesheet" />
    <link href="ContentDt/DataTables/css/buttons.dataTables.min.css" rel="stylesheet" />
    <link href="Assets/css/bootstrap.min.css" rel="stylesheet" />
    <link href="ContentFabric/fabric.min.css" rel="stylesheet" />
    <link href="Assets/css/IncentiveStyle.css" rel="stylesheet" />
    <script>
        $(document).ready(function () {
            <%--    var isRequestAuthenticated = '<%=Request.IsAuthenticated%>';
            if (isRequestAuthenticated == "True") {--%>
            var vHtml = getMenu();
            $('#dvMenu').html(vHtml);
            getListEntity('Entidad');



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
            <div class="float-sm-left">
                <asp:Label runat="server" class="h6 float-left" Text="Entidad"></asp:Label>
            </div>
            <div class="panel-body">
                <div id="dvInfo" class="alert alert-info" runat="server" style="display: none">
                    <asp:Label ID="lblInfo" runat="server" Text=""></asp:Label>
                </div>
                <div class="card">
                    <div class="card-header">Datos encabezado</div>
                    <div class="card-body">
                        
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">Datos detalle</div>
                    <div class="card-body">
                        <div class="card-table">
                            <div id="dvTable">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </form>
</body>
</html>
