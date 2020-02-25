<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GeneralList.aspx.cs" Inherits="IncentiveSite.CustomerList" %>

<!DOCTYPE html>

<head>
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
    <link rel="stylesheet" href="Assets/css/tableTest-css.css">
    <link rel="stylesheet" href="Assets/css/w3css.css">
    <script type="text/javascript" src="Assets/js/front.js"></script>
    <script src="https://kit.fontawesome.com/80fa901d60.js" crossorigin="anonymous"></script>
    <script>
        $(document).ready(function () {
           // var isRequestAuthenticated = '<%=Request.IsAuthenticated%>';
            // if (isRequestAuthenticated == "True") {
            boolTest = true;
            getListEntityMain(ActiveList, 'table', 'Yes');
            getListEntityMain(SecundaryList[0], 'table1', 'No');
            document.getElementById('table1').style.display = 'block';

            $(document).on("click", ".btnEdit", function () {
                SaveList = ActiveList;
                New = false;
                var vHtml = getForm(ActiveList, "Yes", this.id);
                $('#FormInputs').html(vHtml);
                fillDropdown(ActiveList);
                getEntity(ActiveList, this.id);
                try {
                    document.getElementById('txt_F_Planeada_Fin').disabled = 'true';
                }
                catch (e) {

                }
                try {
                    getListEntityMain('Trans_Act', 'TableForm', 'No', this.id);
                }
                catch (e) {

                }
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
                SaveList = ActiveList;
                New = true;
                var vHtml = getForm(ActiveList, "Yes", this.Id);
                $('#FormInputs').html(vHtml);

                try {
                    document.getElementById('txt_F_Planeada_Fin').disabled = 'true';
                }
                catch (e) {

                }
                document.getElementById('id01').style.display = 'block';
                fillDropdown(ActiveList);
            });

            $(document).on("click", ".btnAdd2", function () {
                SaveList = SecundaryList[0];
                var vHtml = getForm(SecundaryList[0], "Yes", this.Id);
                $('#FormInputs').html(vHtml);

                try {
                    document.getElementById('txt_F_Planeada_Fin').disabled = 'true';
                }
                catch (e) {

                }
                document.getElementById('id01').style.display = 'block';
                fillDropdown(SecundaryList[0]);
            });

            $(document).on("click", ".btnAddActivity", function () {
                SaveList = 'Trans_Act';
                var vHtml = getForm('Trans_Act', "Yes", this.id);
                $('#FormInputs').html(vHtml);
                document.getElementById('txt_Id_Transacción').value = this.id;
                document.getElementById('txt_Id_Transacción').disabled = 'true';
                try {
                    document.getElementById('txt_F_Planeada_Fin').disabled = 'true';
                }
                catch (e) {

                }
                document.getElementById('id01').style.display = 'block';
                fillDropdown('Trans_Act');
            });

            $(document).on("change", "#drp_Servicio", function () {
                boolTest = false;
                if (ActiveList == 'Proyecto') {
                    getListEntityMain('Actividades', 'TableForm', 'No', document.getElementById("drp_Servicio").value);
                }
            });

            /*$(document).on("change", "#drp_Actividad", function () {
                boolTest = false;
                if (ActiveList == 'Transacciones') {
                    getListEntityMain('Actividades', 'TableForm', 'No', document.getElementById("drp_Actividad").value);
                }
            });*/

            //}
            // else {
            //   window.location.href = "Login.aspx";
            // }

        });
    </script>

    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script type="text/javascript">
      google.charts.load('current', { 'packages': ['gantt'], 'language': 'es' });
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

          var entity = '';

          entity = listGetQuery('Proyecto');

          wsGetListEntity(entity, function (val) {
              if (val != undefined) {

                  var data = new google.visualization.DataTable();
                  console.log("Trajo algo");

                  data.addColumn('string', 'Task ID');
                  data.addColumn('string', 'Task Name');
                  data.addColumn('string', 'Resource');
                  data.addColumn('date', 'Start Date');
                  data.addColumn('date', 'End Date');
                  data.addColumn('number', 'Duration');
                  data.addColumn('number', 'Percent Complete');
                  data.addColumn('string', 'Dependencies');
                  var color = "a";

                  val.forEach(k => {

                      var dat = k.F_Planeada_Inicio;
                      var date = dat.split(" ");
                      var dateNum = date[0].split("/");

                      var dat2 = k.F_Planeada_Fin;
                      var date2 = dat2.split(" ");
                      var dateNum2 = date2[0].split("/");

                      data.addRow([k.Clave, k.Nombre, color,
                      new Date(dateNum[2], dateNum[0] - 1, dateNum[1]),
                      new Date(dateNum2[2], dateNum2[0] - 1, dateNum2[1]), 10, 10, null]);

                      color += "b";
                  });

                  var options = {
                      width: 1350,
                      height: 200,
                      title: 'Proyectos',
                      is3D: true,


                      gantt: {
                          trackHeight: 30
                      }
                  };

                  var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

                  chart.draw(data, options);
              }
          });

      }
  </script>
</head>
<body translate="no" class="main">
  <nav class="sidenav" id="sidenav">

    <ul class="main-buttons">

      <h1  style="position: fixed; top: 15px; left: 35px; margin: 0; font-family: 'Raleway'; font-size: 25px;"
        class="menu">Gestor de<br> Proyectos</h1> <br>

      <div id="_menu">
        <li onclick="changeModule('Proyecto', 'ActividadesLog') ">
          <span class="glyphicon glyphicon-briefcase" style="line-height: 2;"></span>
          <span  class="menu">Proyectos</span>
        </li>

        <li onclick="changeModule('Transacciones')">
          <span class="glyphicon glyphicon-pencil" style="line-height: 2;"></span>
          <span  class="menu"> Registro de Actividades</span>
        </li>

        <li  class="dropdown">
          <div style="display: flex; flex-direction: row; ">
            <span class="glyphicon glyphicon-cog" style="line-height: 2;"></span>
            <span class="menu">Configuracion</span>            
          </div>

            <div class="dropdown-content">
              <div onclick="changeModule('Cuenta')" class="submenu-item">
                <span class="fas fa-user" style="line-height: 2; margin-right: 15px;"></span>
                <span  class="menu">Clientes</span>  
              </div>
              <div onclick="changeModule('Vendedor')" class="submenu-item">
                <span class="fas fa-users" style="line-height: 2; margin-right: 15px;"></span>
                <span  class="menu">Vendedores</span>  
              </div>
              <div onclick="changeModule('Servicios', 'Actividades')" class="submenu-item">
                <span class="fas fa-handshake" style="line-height: 2; margin-right: 15px;"></span>
                <span  class="menu">Servicios</span>  
              </div>
            </div>
        </li>
      </div>
      <h6 class="menu" style="position: fixed; bottom: 25px; left: 20px; ">Gestor de Proyectos || Beta 2.1 <br>
        Grow-It || Enero 2020 </h6>

    </ul>
  </nav>

  <div class="content" id="content">
    <div class="heady" style="padding-right: 2.5%;">
      <div id="mainButton" class="btn-text btno" style="display: flex; justify-content: space-between; "
        onclick="openForm()">
        <span class="glyphicon glyphicon-user"></span>
        <span> Usuario</span>
      </div>
    </div>

    <div id="mainContent">
    <div style="display:flex; justify-content:space-between">
            <section id="Proyecto" class="module" style="width:100%">
                <h1 style="color:rgb(75, 73, 73);">Proyectos</h1>
                
                <div style="display:flex; justify-content:space-between">
                    <div class="custom-select" style="margin-bottom: 2%;">
                                      <div>
                                        <select id="filtro">
                                          <option value="0">Filtros</option>
                                          <option value="1">Retrasados</option>
                                          <option value="2">Prontos a acabar</option>
                                        </select>
                                      </div>

                                    </div>
                    <div>
                        <button class="btnAdd w3-teal">+</button>
                    </div>
                </div>

            </section>

              <section id="Transacciones" class="module" style="display:none; width:100%;">
                <h1 style="color:rgb(75, 73, 73);">Registro de Actividades</h1>
                    <div>
                         <button class="btnAdd w3-teal w3-right">+</button>
                    </div>
                
              </section>

              <section id="Servicios" class="module" style="display:none; width:100%;">
                <h1 style="color:rgb(75, 73, 73);">Servicios</h1>
                  <div>
                        <button class="btnAdd w3-teal w3-right">+</button>
                    </div>
                  <div>
                        <button class="btnAdd2 w3-teal w3-right w3-margin-right">+</button>
                    </div>
              </section>

              <section id="Actividades" class="module" style="display:none; width:100%;">
                <h1 style="color:rgb(75, 73, 73);">Lista de Actividades</h1>
                  <div>
                        <button class="btnAdd w3-teal w3-right">+ Actividad</button>
                    </div>
              </section>

                <!-- [ MODULOS DE CONFIGURACIONES ] -->
               
                <section id="Cuenta" class="module" style="display:none; width:100%;">
                    <h1 style="color:rgb(75, 73, 73);">Lista de Clientes</h1>
                    <div>
                        <button class="btnAdd w3-teal w3-right">+</button>
                    </div>
                </section>

                <section id="Vendedor" class="module" style="display:none; width:100%;">
                    <h1 style="color:rgb(75, 73, 73);">Lista de Vendedores</h1>
                    <div>
                        <button class="btnAdd w3-teal w3-right">+</button>
                    </div>
                </section>
            
    </div>
      
      <div class="w3-modal" id="id01">
        <form class="w3-modal-content w3-animate-zoom" -content>    
              <div class="w3-container w3-teal w3-padding-16">
                <a class="w3-xxlarge" id ="TitleForm"><i class="fas fa-edit"> </i></a>
              </div>
              <div class="w3-container w3-padding-16">
            
                <div class="w3-cell-row" id="FormInputs">

                </div>
                <div class="w3-cell-row w3-margin-top w3-table-all" id="TableForm">

                </div>
                <button class="w3-button w3-blue-grey w3-margin-top w3-margin-left" type="button" onclick="formEntityToSave('GeneralList.aspx', SaveList, this.id); document.getElementById('id01').style.display = 'none'" >Registrar</button>
                <button class="w3-button w3-red w3-margin-top w3-margin-left w3-right" type="button" onclick="document.getElementById('id01').style.display = 'none'">Cancelar</button>
              </div>
              <div class="w3-container w3-teal w3-buttom">
                <h6 class="w3-center" id ="FootForm"></h6>
              </div>
      </form>
    </div>
      <div id="table" class="TableX" style="width:100%">

      </div>
      <h1 id="SecundaryTag" style="color:rgb(75, 73, 73);">ActividadesLog</h1>
      <div id="table1" class="TableX" style="width:100%; display: none">

      </div>
        <div id="gantt">
            <div id="chart_div"></div>
        </div>
        
    </div>
    
  </div>
</body>