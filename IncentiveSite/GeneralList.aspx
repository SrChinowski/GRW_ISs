<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GeneralList.aspx.cs" Inherits="IncentiveSite.CustomerList" %>

<!DOCTYPE html>

<head >
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="Assets/js/jquery-3.4.1.min.js"></script>
    <script src="Scripts/DataTables/jquery.dataTables.min.js"></script>
    <script src="Scripts/DataTables/dataTables.buttons.min.js"></script>
    <script src="Scripts/DataTables/buttons.html5.min.js"></script>
    <script src="Scripts/DataTables/jszip.min.js"></script>
    <script src="Assets/js/bootstrap.min.js"></script>
    <script src="Assets/js/ControllerFunctions.js"></script>
    <script src="Assets/js/ControllerGeneralTest.js"></script>
    <link href="ContentDt/DataTables/css/jquery.dataTables.min.css" rel="stylesheet" />
    <link href="ContentDt/DataTables/css/buttons.dataTables.min.css" rel="stylesheet" />
    <link href="Assets/css/bootstrap.min.css" rel="stylesheet" />
    <link href="ContentFabric/fabric.min.css" rel="stylesheet" />
    <link href="Assets/css/IncentiveStyle.css" rel="stylesheet" />
    <title>Incentivos</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css"href="https://cdn.datatables.net/v/bs/dt-1.10.20/af-2.3.4/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/b-html5-1.6.1/b-print-1.6.1/cr-1.5.2/fc-3.3.0/fh-3.1.6/kt-2.5.1/r-2.2.3/rg-1.1.1/rr-1.2.6/sc-2.0.1/sp-1.0.1/sl-1.3.1/datatables.min.css" />
    <script type="text/javascript"src="https://cdn.datatables.net/v/bs/dt-1.10.20/af-2.3.4/b-1.6.1/b-colvis-1.6.1/b-flash-1.6.1/b-html5-1.6.1/b-print-1.6.1/cr-1.5.2/fc-3.3.0/fh-3.1.6/kt-2.5.1/r-2.2.3/rg-1.1.1/rr-1.2.6/sc-2.0.1/sp-1.0.1/sl-1.3.1/datatables.min.js"></script>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="Assets/css/tableTest-css.css">
    <script type="text/javascript" src="Assets/js/front.js"></script>
    <script>
        $(document).ready(function () {
           // var isRequestAuthenticated = '<%=Request.IsAuthenticated%>';
            // if (isRequestAuthenticated == "True") {
            boolTest = true;
            getListEntityMain(ActiveList, 'table', 'Yes');

            $(document).on("click", ".btnEdit", function () {
                var vHtml = getForm(ActiveList, "Yes", this.id);
                $('#FormInputs').html(vHtml);
                fillDropdown(ActiveList);
                getEntity(ActiveList, this.id);
                document.getElementById('id01').style.display = 'block';
                //window.location.href = "Customer.aspx?id=" + this.id;
            });
            $(document).on("click", ".btnDelete", function () {
                var r = confirm("Esta seguro de eliminar este registro?");
                if (r == true) {

                    var entity = formEntityDelete(ActiveList, this.id, 'Id');
                    if (entity != undefined) {
                        wsDeleteEntity(entity, 1);
                    }
                }
            });
            $(document).on("click", ".btnAdd", function () {
                var vHtml = getForm(ActiveList, "Yes", this.Id);
                $('#FormInputs').html(vHtml);

                document.getElementById('id01').style.display = 'block';
                fillDropdown(ActiveList);

            });


            $(document).on("change", "#drp_Servicio", function () {
                boolTest = false;
                getListEntityMain('Actividades', 'TableForm', 'No', document.getElementById("drp_Servicio").value);
            });
            
            //}
            // else {
            //   window.location.href = "Login.aspx";
            // }

        });
    </script>
</head>
<body translate="no" class="main">
  <nav class="sidenav" id="sidenav">

    <ul class="main-buttons">

      <h1  style="position: fixed; top: 15px; left: 35px; margin: 0; font-family: 'Raleway'; font-size: 25px;"
        class="menu">Gestor de<br> Proyectos</h1> <br>

      <div id="_menu">
        <li onclick="changeModule('Proyecto') ">
          <span class="glyphicon glyphicon-briefcase" style="line-height: 2;"></span>
          <span  class="menu">Proyectos</span>

        </li>

        <li onclick="changeModule('ActividadesLog')">
          <span class="glyphicon glyphicon-list " style="line-height: 2;"></span>
          <span  class="menu">Actividades</span>
        </li>

        <li onclick="changeModule('Servicio')">
          <span class="glyphicon glyphicon-tags" style="line-height: 2;"></span>
          <span  class="menu">Servicios</span>

        </li>
      </div>
      <h6 class="menu" style="position: fixed; bottom: 25px; left: 20px; " class="menu">Gestor de Proyectos || Beta 1.0 <br>
        Grow-It || Enero 2020 </h6>

    </ul>
  </nav>

  <div class="content" id="content">
    <div class="heady">
      <div id="mainButton" class="btn-text btno" style="display: flex; justify-content: space-between; "
        onclick="openForm()">
        <span class="glyphicon glyphicon-user"></span>
        <span> Usuario</span>
      </div>
    </div>

    <div id="mainContent">
      <section id="Proyecto" class="module">
        <h1 style="color:rgb(75, 73, 73);">Proyectos</h1>

        <div class="custom-select" style="margin-bottom: 2%;">
          <div>
            <select id="filtro">
              <option value="0">Filtros</option>
              <option value="1">Retrasados</option>
              <option value="2">Prontos a acabar</option>
              <option value="4">Diagrama de Gantt</option>
            </select>
          </div>

        </div>

      </section>

      <section id="ActividadesLog" class="module" style="display:none">
        <h1 style="color:rgb(75, 73, 73);">Actividades</h1>

        <div class="custom-select" style="margin-bottom: 2%;">
          <div>
            <select id="filtro">
              <option value="0">Filtros</option>
              <option value="1">Retrasados</option>
              <option value="2">Prontos a acabar</option>
              <option value="3">Por encargado***</option>
              <option value="4">Diagrama de Gantt</option>
            </select>
          </div>

        </div>

      </section>

      <section id="Servicio" class="module" style="display:none">
        <h1 style="color:rgb(75, 73, 73);">Servicios</h1>
      </section>


      <div style="margin: 5px">
        <button class="btnAdd" style="position:relative; left: 98%; margin:10px">+</button>
      </div>

      <div class="w3-modal" id="id01">
        <form class="w3-modal-content" -content>
              <div class="w3-container w3-teal w3-padding-16">
                <a class="w3-xxlarge" id ="TitleForm"><i class="fas fa-edit"> </i></a>
              </div>
              <div class="w3-container w3-padding-16">
            
                <div class="w3-cell-row" id="FormInputs">

                </div>
                <div class="w3-cell-row w3-margin-top w3-table-all" id="TableForm">

                </div>
                <button class="w3-button w3-blue-grey w3-margin-top w3-margin-left" onclick="formEntityToSave('GeneralList.aspx', ActiveList, this.id)" >Registrar</button>
                <button class="w3-button w3-red w3-margin-top w3-margin-left w3-right">Cancelar</button>
              </div>
              <div class="w3-container w3-teal w3-buttom">
                <h6 class="w3-center" id ="FootForm"></h6>
              </div>
      </form>
    </div>
      <div id="table"style="width:100%">

      </div>
    </div>
    
  </div>
</body>
