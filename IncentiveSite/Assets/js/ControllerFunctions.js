/////ENUMS////
var whereOperator = {
    Equal: 1,
    NotEqual: 2,
    Greater: 3,
    GreaterEqual: 4,
    Lower: 5,
    LowerEqual: 6,
    IsNull: 7,
    IsNotNull: 8,
    Like: 9,
};
var logicalOperator = {
    And: 1,
    Or: 2,
}
var JoinType = {
    Inner: 1,
    Left: 2,
    Right: 3,
}

var ActiveList = "Proyecto";
var SecundaryList = ["ActividadesLog"];
var New = true;
var SaveList = "";

///ENTITY CLASS///
function Entity(name) {
    this.EntityName = name;
    this.EntityAlias = name;
    this.Attributes = [];
    this.GroupWheres = [];
    this.ChildEntities = [];
    this.getLastIdentity = false;
}
function Attribute(name, value, type, alias, html, id, tableName, Child) {
    this.AttrName = name;
    this.AttrValue = value;
    this.AttrType = type;
    this.AttrAlias = alias;
    this.AttrHtml = html;
    this.AttrIdName = id;
    this.AttrTable = tableName;
    this.AttrIsChild = Child;
}
function GroupWhere(opwhere, lwhere, opgroup) {
    this.LogicalOperatorWhere = opwhere;
    this.listWhere = lwhere;
    this.LogicalOperatorGroup = opgroup;
}
function Where(attr, opwhere) {
    this.Attribute = attr;
    this.WhereOperator = opwhere;
}
function JoinEntity(child, jointype, logicop, ljoin) {
    this.ChildEntity = child;
    this.JoinType = jointype;
    this.logicOperator = logicop;
    this.selectJoinList = ljoin;
}
function selectJoinEntity(logicop, mainattr, childattr) {
    this.logicOperator = logicop;
    this.mainAttr = mainattr;
    this.childAttr = childattr;

}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

//put attributes to entity
function listFields(fields, entity) {

    for (j = 0; fields.length > j; j++) {
        var vTemp = fields[j].split(".");
        var atr = new Attribute(vTemp[0], "", vTemp[2], vTemp[1], vTemp[3], vTemp[4], vTemp[2], vTemp[5]);
        entity.Attributes.push(atr);
    }
    return entity;

    var entity = new Entity("Modules");
}

function wsSaveEntity(entity, page, id) {

    $.ajax({
        type: "POST",
        url: 'ControllerWebMethod.asmx/SaveEntity',
        data: "{'DataEntity':" + JSON.stringify(entity) + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (result) {

            Redirect(page + '?result=' + result.d.Msj + '&id=' + id);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var error = eval("(" + XMLHttpRequest.responseText + ")");
            console.log(error.Message);
        }
    });

}

function wsSaveEntityUser(existEntity, entity, page, id) {

    $.ajax({
        type: "POST",
        url: 'ControllerWebMethod.asmx/SaveEntityUser',
        data: "{'CheckExist':" + JSON.stringify(existEntity) + ",'DataEntity':" + JSON.stringify(entity) + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (result) {
            if (result.d.Result == true) {
                Redirect(page + '?result=' + result.d.Msj + '&id=' + id);
            }
            else {
                $("#lblInfo").text(result.d.Msj);
                $("#dvInfo").show();
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var error = eval("(" + XMLHttpRequest.responseText + ")");
            console.log(error.Message);
        }
    });

}

function wsSaveEntities(entities, callback) {

    $.ajax({
        type: "POST",
        url: 'ControllerWebMethod.asmx/SaveEntities',
        data: "{'DataEntities':" + JSON.stringify(entities) + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (result) {
            callback(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var error = eval("(" + XMLHttpRequest.responseText + ")");
            console.log(error.Message);
        }
    });
}

function wsUpdateEntity(entity, page, id, entities) {

    switch (entity.EntityName) {
        case 'Group':
            var entityDelete = formEntityDelete('BrandByGroup', id, 'GroupId');
            $.ajax({
                type: "POST",
                url: 'ControllerWebMethod.asmx/UpdateEntityDetails',
                data: "{'DataEntity':" + JSON.stringify(entity) + ",'DataEntities':" + JSON.stringify(entities) + ",'DataEntityDelete':" + JSON.stringify(entityDelete) + "}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (result) {

                    Redirect(page + '?result=' + result.d.Msj + '&id=' + id);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var error = eval("(" + XMLHttpRequest.responseText + ")");
                    console.log(error.Message);
                }
            });

            break;
        case 'SystemUser':
            if (entities.length > 0) {//verifica que contenga al menos un rol asignado
                var entityDelete = formEntityDelete('UserRoles', id, 'UserId');
                console.log(entities.length);
                $.ajax({
                    type: "POST",
                    url: 'ControllerWebMethod.asmx/UpdateEntityDetails',
                    data: "{'DataEntity':" + JSON.stringify(entity) + ",'DataEntities':" + JSON.stringify(entities) + ",'DataEntityDelete':" + JSON.stringify(entityDelete) + "}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    success: function (result) {

                        Redirect(page + '?result=' + result.d.Msj + '&id=' + id);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        var error = eval("(" + XMLHttpRequest.responseText + ")");
                        console.log(error.Message);
                    }
                });
            }
            else {

                $("#lblInfo").text('Es necesario asignar un rol al usuario.');
                $("#dvInfo").show();
            }

            break;
        case 'Role':
            var entityDelete = formEntityDelete('SecurityPrivilege', id, 'RoleId');
            $.ajax({
                type: "POST",
                url: 'ControllerWebMethod.asmx/UpdateEntityDetails',
                data: "{'DataEntity':" + JSON.stringify(entity) + ",'DataEntities':" + JSON.stringify(entities) + ",'DataEntityDelete':" + JSON.stringify(entityDelete) + "}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (result) {

                    Redirect(page + '?result=' + result.d.Msj + '&id=' + id);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var error = eval("(" + XMLHttpRequest.responseText + ")");
                    console.log(error.Message);
                }
            });

            break;

        default:

            $.ajax({
                type: "POST",
                url: 'ControllerWebMethod.asmx/UpdateEntity',
                data: "{'DataEntity':" + JSON.stringify(entity) + "}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (result) {
                    Redirect(page + '?result=' + result.d.Msj + '&id=' + id);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    var error = eval("(" + XMLHttpRequest.responseText + ")");
                    console.log(error.Message);

                }
            });
    }

}

function wsDeleteEntity(entity, option) {

    $.ajax({
        type: "POST",
        url: 'ControllerWebMethod.asmx/DeleteEntity',
        data: "{'DataEntity':" + JSON.stringify(entity) + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (result) {
            if (option == 1) {//Carga tabla

                boolTest = true;
                getListEntityMain(entity.EntityName, 'Yes');

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var error = eval("(" + XMLHttpRequest.responseText + ")");
            console.log(error.Message);

        }
    });

}

function formEntityDelete(nameEntity, id, fieldName) {

    var entity = new Entity(nameEntity);

    var att = new Attribute(fieldName, '', '', fieldName);
    entity.Attributes.push(att);

    var atr = new Attribute(fieldName, id, 'string', fieldName);
    var lwhere = [];
    var where = new Where(atr, whereOperator.Equal);
    lwhere.push(where);

    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

    lGroupWhere.push(groupWhere);
    entity.GroupWheres = lGroupWhere;

    return entity;
}

function formEntityDeleteX(nameEntity, wheres) {

    var entity = new Entity(nameEntity);
    var lwhere = [];

    wheres.forEach(
        function (item) {

            if (item != null) {
                var att = new Attribute(item.fieldname, '', '', item.fieldname);
                entity.Attributes.push(att);
                var atr = new Attribute(item.fieldname, item.value, item.type, item.fieldname);
                var where = new Where(atr, whereOperator.Equal);
                lwhere.push(where);
            }
        }
    );

    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

    lGroupWhere.push(groupWhere);
    entity.GroupWheres = lGroupWhere;

    return entity;
}

//FALTA
function getEntity(nameEntity, id) {
    try {
        var entity = ''
        entity = formGetQuery(nameEntity, id);
        wsGetListEntity(entity, function (val) {
            if (val != undefined) {
                formFillFields(val, nameEntity);
            }
        });

    } catch (e) {
        console.error(e.Message);
    }

}

//LISTO
function getListEntityMain(nameEntity, _tableId, OptionsAllowed, whereFilter = null) {

    try {
        var table = $('#dt-' + nameEntity).DataTable();
        if (table != undefined) {
            table.clear();
            table.destroy();
        }

        var entity = ''

        entity = listGetQuery(nameEntity);

        if (whereFilter != null) {
            var WhereAttr;
            var lwhere = [];
            switch (whereFilter) {
                case 'Retrasados':
                    WhereAttr = $.extend({}, entity.Attributes[3]);

                    var dateOffset = (24 * 60 * 60 * 1000);
                    var myDate = new Date();
                    myDate.setTime(myDate.getTime() - dateOffset);
                    var filter = "";
                    filter += myDate.getFullYear().toString() + '-' + (myDate.getMonth() + 1).toString() + '-' + myDate.getDate().toString();
                    WhereAttr.AttrValue = filter;

                    var where = new Where(WhereAttr, whereOperator.LowerEqual);
                    lwhere.push(where);

                    break;
                case "Prontos a acabar":
                    WhereAttr = $.extend({}, entity.Attributes[3]);

                    var dateOffset = (24 * 60 * 60 * 1000) * 14; //7 days
                    var myDate = new Date();
                    myDate.setTime(myDate.getTime() + dateOffset);
                    var filter = "";
                    filter += myDate.getFullYear().toString() + '-' + (myDate.getMonth() + 1).toString() + '-' + myDate.getDate().toString();
                    WhereAttr.AttrValue = filter;

                    var where = new Where(WhereAttr, whereOperator.LowerEqual);
                    lwhere.push(where);

                    WhereAttr = $.extend({}, entity.Attributes[3]);

                    var myDate = new Date();
                    myDate.setTime(myDate.getTime());
                    var filter = "";
                    filter += myDate.getFullYear().toString() + '-' + (myDate.getMonth() + 1).toString() + '-' + myDate.getDate().toString();
                    WhereAttr.AttrValue = filter;

                    var where = new Where(WhereAttr, whereOperator.GreaterEqual);
                    lwhere.push(where);

                    break;
                default:
                    if (ActiveList != 'Transacciones') {
                        WhereAttr = $.extend({}, entity.Attributes[3]);
                        WhereAttr.AttrType = 'int';
                    }
                    else {
                        WhereAttr = $.extend({}, entity.Attributes[0]);
                    }
                    var filter = whereFilter;
                    WhereAttr.AttrValue = filter;

                    var where = new Where(WhereAttr, whereOperator.Equal);
                    lwhere.push(where);

                    break;
            }

            var lGroupWhere = [];
            var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

            lGroupWhere.push(groupWhere);
            entity.GroupWheres = lGroupWhere;
        }

        switch (OptionsAllowed) {
            case 'Yes':
                var options = listCreateOptions(["Eliminar", "Ver"]);
                break;
            case 'No':
                var options = listCreateOptions([]);
                break;
        }
        wsGetListEntity(entity, function (val) {
            if (val != undefined) {
                fillTable(nameEntity, val, options, _tableId, boolTest);
            }
        });
    } catch (e) {
        console.error(e.Message);
    }

}

function fillTable(nameEntity, objdata, options, TableId, extras = true) {

    var columns = [];
    var cols = [];

    if (nameEntity == 'Transacciones') {
        options.push('Añadir Actividad');
    }

    var columnNames = Object.keys(objdata[0]);
    for (var i = 0; i < options.length; i++) {
        columns.push(null);
    }

    for (var i in columnNames) {
        columns.push({ data: columnNames[i], title: columnNames[i] });
    }
    var count = options.length;


    for (count; count < columns.length; count++) {
        cols.push(count);
    }

    var vHtmlTable = createTableHTML(nameEntity, columns, options);

    $('#' + TableId).html(vHtmlTable);

    if (extras) {
        var table = $('#dt-' + nameEntity).DataTable({
            data: objdata,
            columns: columns,
            fixedColumns: true,
            columnDefs: [{
                targets: 'Ver',
                width: "5%",
                className: 'text-center',
                render: function (a, b, data, d) {
                    var buttonID = data.Clave;
                    var buttons = ''
                    buttons = '<i  id="' + buttonID + '" class="ms-Icon ms-Icon--EditNote btnEdit btnTable" style="cursor: pointer;" aria-hidden="true"></i>';
                    return buttons;
                }
            },
            {
                targets: 'Eliminar',
                className: 'text-center',
                width: "5%",
                render: function (a, b, data, d) {
                    var buttonID = data.Clave;
                    var buttons = ''
                    buttons = '<i  id="' + buttonID + '" class="ms-Icon ms-Icon--Delete btnDelete btnTable" style="cursor: pointer;" aria-hidden="true"></i>';
                    return buttons;
                }
            },
            {
                targets: 'Añadir Actividad',
                className: 'text-center',
                width: "5%",
                render: function (a, b, data, d) {
                    var buttonID = data.Clave;
                    var buttons = ''
                    buttons = '<i  id="' + buttonID + '" class="ms-Icon ms-Icon--AddTo btnAddActivity btnTable" style="cursor: pointer;" aria-hidden="true"></i>';
                    return buttons;
                }
            }
            ],
            dom: 'lBfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    title: 'DataExport',
                    exportOptions: {
                        columns: cols
                    }
                }
            ],
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla =(",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
            },
            // puts a filters in columns

            initComplete: function () {
                this.api().columns(cols).every(function () {
                    var column = this;
                    var select = $('<select><option value=""></option></select>')
                        .appendTo($(column.footer()).empty())
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });
                    column.data().unique().sort().each(function (d, j) {
                        if (d != '') {
                            select.append('<option value="' + d + '">' + d + '</option>')
                        }
                    });
                });
            }
        });
        // $('.buttons-excel').detach().prependTo('.panel-body')
    }
    else {
        var table = $('#dt-' + nameEntity).DataTable({
            data: objdata,
            columns: columns,
            columnDefs: [],
            dom: 'lBfrtip',
            buttons: [],
            language: {},
        });
    }

}

function createTableHTML(nameEntity, columns, options) {
    var vHtmlTable = "";
    vHtmlTable =
        "<table id='dt-" + nameEntity + "'" + " class='display dataTable table mt-2' style='width:100%;'>" +
        "<thead>" +
        "<tr>";
    options.forEach(
        function (item) {
            if (item != null)
                vHtmlTable += "<th class='" + item + "'>" + item + "</th>";
        }
    );
    columns.forEach(
        function (item) {
            if (item != null)
                vHtmlTable += "<th>" + item.title + "</th>";
        }
    );
    vHtmlTable += "</tr>" +
        "</thead>" +
        "<tfoot>" +
        "<tr>";
    options.forEach(
        function (item) {
            if (item != null)
                vHtmlTable += "<th></th>";
        }
    );
    columns.forEach(
        function (item) {
            if (item != null)
                vHtmlTable += "<th class='select-filter'>" + item.title + "</th>";
        }
    );
    vHtmlTable += "</tr>" +
        "</tfoot>" +
        "</table>";
    return vHtmlTable;

}

function wsGetListEntity(entity, callback) {

    $.ajax({
        type: "POST",
        url: 'ControllerWebMethod.asmx/GetListEntity',
        data: "{'DataEntity':" + JSON.stringify(entity) + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (result) {
            var objdata = $.parseJSON(result.d);
            callback(objdata);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var error = eval("(" + XMLHttpRequest.responseText + ")");
            console.log(error.Message);

        }
    });
}

function getQueryCatalog(nameEntity, id, name) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push(id + "." + id);
    fields.push(name + "." + name);
    listFields(fields, entity);
    return entity;
}

function Redirect(page) {
    window.location.href = page;
}

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

        "<div class='collapse navbar-collapse' id='navbarSupportedContent'>" +
        "<ul class='navbar-nav mr-auto'>" +
        "<li class='nav-item dropdown'>" +
        "<a class='nav-link dropdown-toggle' href='#' id='navDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-axpanded='false'>Configuraciones</a>" +
        "<div class='dropdown-menu' aria-labelledby='navDropdown'>" +
        "<a class='dropdown-item' href='IncentiveSys.aspx'>Configuración</a>" +
        "</li>" +
        "<li class='nav-item'>" +
        "<a class='nav-link' href='#'>Procesos</a>" +
        "</li>" +
        "<li class='nav-item dropdown'>" +
        "<a class='nav-link dropdown-toggle' href='#' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Catálogos </a>" +
        "<div class='dropdown-menu' aria-labelledby='navbarDropdown'>" +
        "<a class='dropdown-item' href='CustomerList.aspx'>Clientes</a>" +
        "</div>" +
        "</li>" +
        "</ul>" +
        "</div>" +
        "</nav>";
    return vHtmlMenu;
}

function securityPrivilege() {
    var privilegesOption = [];
    privilegesOption.push({ id: 0, name: 'Ninguno' });
    privilegesOption.push({ id: 1, name: 'Lectura' });
    privilegesOption.push({ id: 2, name: 'Creación' });
    privilegesOption.push({ id: 3, name: 'Edición' });
    privilegesOption.push({ id: 4, name: 'Borrado' });

    return privilegesOption;
}

///A partir de aquí las funciones son creadas

//Agrega las opciones que se quieren habilitar en la lista (Eliminar y Ver)
function listCreateOptions(OptionsArray /*Ver, Eliminar*/) {
    var k = 0;
    var options = [];
    for (k = 0; k < OptionsArray.length; k++) {
        options.push(OptionsArray[k]);
    };

    return options;
}

//Obtiene los previos para el query de la lista
function listGetQuery(nameEntity) {

    var entity = new Entity(nameEntity);

    var fields = getFields(nameEntity);
    listFields(fields, entity);

    listChildEntities(entity);

    return entity;
}

//Obtiene las entidades hijas de la entidad deseada
function listChildEntities(entity) {

    var ChildEntitiesTemp = getChildEntities();
    var entindex = 0;

    for (entindex = 0; entindex < ChildEntitiesTemp.length; entindex++) {
        entity.ChildEntities.push(ChildEntitiesTemp[entindex]);
    };

}

//Llena los campos de un formulario con el registo elegido
function formFillFields(objdata, nameEntity) {

    console.log(objdata);
    var fields = getFieldsWithChilds(nameEntity);
    var findex = 0;

    for (findex = 0; findex < fields.length; findex++) {
        var vTemp = fields[findex].split(".");
        var htmlObject = "";
        switch (vTemp[3]) {
            case "input":
                htmlObject += "#txt_" + vTemp[1];
                break;
            case "select":
                htmlObject += "#drp_" + vTemp[1];
                break;
            case "inputDate":
                htmlObject += "#txt_" + vTemp[1];
                break;
        }
        try {
            switch (vTemp[3]) {
                case "input":
                    $(htmlObject).val(objdata[0][vTemp[1]]);
                    break;
                case "select":
                    var k = 0;
                    $(htmlObject).val(objdata[0][vTemp[1]]);
                    break;
                case "inputDate":
                    var string = objdata[0][vTemp[1]];
                    var str = string.substr(0, 10);
                    var string = str.split('/');
                    str = "";
                    str += string[2] + "-" + string[1] + "-" + string[0];
                    $(htmlObject).val(str);
                    break;
            }
        }
        catch (e) {

        };
    }
}

//Obtiene la estructura del Query del form
function formGetQuery(nameEntity, id) {
    var entity = new Entity(nameEntity);
    var fields = getFieldsWithChilds(nameEntity);

    listFields(fields, entity);
    listChildEntities(entity);

    if (id != '') {
        entity.Attributes[0].AttrValue = id;
        var lwhere = [];
        var where = new Where(entity.Attributes[0], whereOperator.Equal);
        lwhere.push(where);

        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

        lGroupWhere.push(groupWhere);
        entity.GroupWheres = lGroupWhere;
    }
    return entity;
}

//Obtiene los valores dentro de un formulario y llama la función para guardar dichos valores a base de datos
function formEntityToSave(page, nameEntity) {
    if (nameEntity == 'Transacciones' && New == false) {
        $(document).ready(registerTrans(document.getElementById('txt_Clave').value));
    }
    else {
        var newEntity = true;

        var fields = getFieldsWithChilds(nameEntity);

        var vTemp = fields[0].split(".");
        var id = document.getElementById("FootForm").innerHTML;
        var entity = new Entity(nameEntity);
        if (id != 'NUEVO' && SaveList != 'Trans_Act') {
            newEntity = false;
            idRegister = id;
        }
        else {
            var htmlObject = "";
            switch (vTemp[3]) {
                case "input":
                    htmlObject += "#txt_" + vTemp[1];
                    break;
                case "select":
                    htmlObject += "#drp_" + vTemp[1];
                    break;
                case "inputDate":
                    htmlObject += "#txt_" + vTemp[1];
                    break;
            }
            idRegister = $(htmlObject).val();
        }

        var atr = new Attribute(vTemp[0], idRegister, vTemp[2], vTemp[1], vTemp[3]);
        entity.Attributes.push(atr);

        for (k = 1; k < fields.length; k++) {
            vTemp = fields[k].split(".");
            var htmlObject = "";
            switch (vTemp[3]) {
                case "input":
                    htmlObject += "#txt_" + vTemp[1];
                    break;
                case "select":
                    htmlObject += "#drp_" + vTemp[1];
                    break;
                case "inputDate":
                    htmlObject += "#txt_" + vTemp[1];
                    break;
            }
            var value = $(htmlObject).val();
            if (value != 0 || vTemp[3] != "select") {
                var atr = new Attribute(vTemp[0], value, typeof (value), vTemp[1], vTemp[3]);
                entity.Attributes.push(atr);
            }
        };

        if (newEntity == true) {
            wsSaveEntity(entity, page, idRegister);
        }

        else {
            var vTemp = fields[0].split(".");

            var atr = new Attribute(vTemp[0], idRegister, vTemp[2], vTemp[1], vTemp[3]);

            var lwhere = [];
            var where = new Where(atr, whereOperator.Equal);
            lwhere.push(where);

            var lGroupWhere = [];
            var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

            lGroupWhere.push(groupWhere);
            entity.GroupWheres = lGroupWhere;
            wsUpdateEntity(entity, page, idRegister);

        }
    }
}

//De acuerdo a la entidad elegida y el Id del registro manda a eliminarlo de la base de datos
function formEntityToDelete(nameEntity, id) {

    var entity = new Entity(nameEntity);

    var fields = getFieldsWithChilds(nameEntity)
    var vTemp = fields[0].split(".");

    var atr = new Attribute(vTemp[0], id, typeof id, vTemp[2], vTemp[3]);
    entity.Attributes.push(atr);

    var lwhere = [];
    var where = new Where(atr, whereOperator.Equal);
    lwhere.push(where);

    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

    lGroupWhere.push(groupWhere);
    entity.GroupWheres = lGroupWhere;

    return entity;
}

//Habilita o deshabilita los controles dentro de un formulario
function formControlsDisabled(val, nameEntity) {

    var fields = getFieldsWithChilds(nameEntity);
    for (k = 0; k < fields.length; k++) {
        vTemp = fields[k].split(".");
        var htmlobject = "";
        if (vTemp[3] == "input") {
            htmlobject += "#txt_" + vTemp[1];
        }
        else {
            htmlobject += "#drp_" + vTemp[1];
        };
        $(htmlobject).prop("disabled", val);
    };
}

//Realiza el código para formar un form
function getForm(val, Save, Id) {

    document.getElementById("TitleForm").innerHTML = val;
    if (Id == undefined) {
        document.getElementById("FootForm").innerHTML = "NUEVO";
    }
    else {
        document.getElementById("FootForm").innerHTML = Id;
    }
    var fields = getFieldsWithChilds(val);
    var fHtmlForm = " ";
    var value = "";
    var htmlVar = "";
    for (k = 0; k < fields.length; k++) {
        vTemp = fields[k].split(".");
        var htmlTag = "";
        var htmlVar = "";
        switch (vTemp[3]) {
            case "input":
                htmlTag += "txt_" + vTemp[1];
                htmlVar += "<input class='w3-input w3-select w3-hover-light-gray w3-animate-input' ID='" + htmlTag + "' type='text' runat='server' placeholder='Ingrese el campo &quot;" + vTemp[1] + "&quot'></input>"
                break;
            case "select":
                htmlTag += "drp_" + vTemp[1];
                htmlVar += "<select class='w3-input w3-select w3-hover-light-gray' ID='" + htmlTag + "' type='text' runat='server' placeholder='Ingrese el campo &quot;" + vTemp[1] + "&quot'></select>"
                break;
            case "inputDate":
                htmlTag += "txt_" + vTemp[1];
                htmlVar += "<input class='w3-input w3-hover-light-gray w3-animate-input' ID='" + htmlTag + "' type='date' value='2020-01-01' min='2020-01-01' max='2050-12-31' runat='server' placeholder='Ingrese el campo &quot;" + vTemp[1] + "&quot'></input>"
                break;
        }

        if ((k % 2) == 0) {
            value = fHtmlForm.concat(
                "<div class='w3-cell-row'>",
                "<div class='w3-container w3-cell'>",
                "<label for= '", htmlTag, "' > ", vTemp[1], "</label>",
                htmlVar,
                "</div>");
            fHtmlForm = value;
        }
        else {
            value = fHtmlForm.concat(
                "<div class='w3-container w3-cell'>",
                "<label for= '", htmlTag, "' > ", vTemp[1], "</label>",
                htmlVar,
                "</div>",
                "</div>");
            fHtmlForm = value;
        };
    };
    fHtmlForm = value;
    return fHtmlForm;
}

//Llena las casillas de dropdown para un form
function fillDropdown(nameEntity) {
    try {
        var fields = getFieldsWithChilds(nameEntity);

        for (k = 1; k < fields.length; k++) {
            let vHTML = "<option value=''>" + "" + "</option>";
            vTemp = fields[k].split(".");
            let htmlObject = "";
            htmlObject += "#drp_" + vTemp[1];

            if (vTemp[3] == "select") {
                if (vTemp[1] == "Nombre") {
                    vHTML += "<option value='Proyecto 1'>Proyecto 1</option>";
                    vHTML += "<option value='Proyecto 2'>Proyecto 2</option>";
                    vHTML += "<option value='Proyecto 3'>Proyecto 3</option>";
                    vHTML += "<option value='Proyecto 4'>Proyecto 4</option>";
                    vHTML += "<option value='Proyecto 5'>Proyecto 5</option>";
                    vHTML += "<option value='PruebaSave'>PruebaSave</option>";
                    vHTML += "<option value='PruebaEdit'>PruebaEdit</option>";

                    $(htmlObject).html(vHTML);
                }
                else {
                    var entity = getQueryCatalog(vTemp[2], vTemp[4], vTemp[5]);
                    wsGetListEntity(entity, function (val) {
                        if (val != undefined) {
                            if (val.length > 0) {
                                $.each(val, function () {

                                    if (this[vTemp[4]] != '' && (this.Nombre != '' || this.Tipo != '')) {
                                        if (this.Nombre == undefined) {
                                            vHTML += "<option value='" + this[vTemp[4]] + "'>" + this.Tipo + "</option>";
                                        }
                                        else {
                                            vHTML += "<option value='" + this[vTemp[4]] + "'>" + this.Nombre + "</option>";
                                        }
                                    }
                                });
                                $(htmlObject).html(vHTML);
                            }
                        }
                    });
                }
            }
        };
    }
    catch (e) {
        console.log(e.Message);
    }
}


//Funciones Removidas
// getForm();
// function fillZone() Lista - Removida -> fillDropdown() 
// function fillTerritory() Lista - Removida -> fillDropdown()

//FINALES

/*function getView(type) { // se debe obtener el Id de algún lado
    switch (type) {
        case 'List':
            getE
            break;
        case 'Form':
            break;
    }
}*/



$(document).on("change", "#txt_F_Planeada_Inicio", function () {

    var int = document.getElementById("txt_TiempoEst").value
    var dateOffset = (24 * 60 * 60 * 1000) * parseInt(int);
    var myDate = new Date();
    var FechaTemp = document.getElementById("txt_F_Planeada_Inicio").value;
    var k = FechaTemp.split('-');
    myDate.setFullYear(k[0], parseInt(k[1]) - 1, k[2]);


    myDate.setTime(myDate.getTime() + dateOffset);

    var filter = '';
    filter += myDate.getFullYear().toString() + "-" + (myDate.getMonth() + 1).toString() + "-" + myDate.getDate().toString();
    var string = filter.split('-');
    var filter2 = '';
    filter2 += string[0] + '-';
    if (string[1].length == 1) {
        filter2 += '0' + string[1] + '-';
    }
    else {
        filter2 += '' + string[1] + '-';
    }
    if (string[2].length == 1) {
        filter2 += '0' + string[2];
    }
    else {
        filter2 += '' + string[2];
    }
    $('#txt_F_Planeada_Fin').val(filter2);

});

$(document).on("input", "#txt_TiempoEst", function () {

    var int = document.getElementById("txt_TiempoEst").value
    var dateOffset = (24 * 60 * 60 * 1000) * parseInt(int);
    var myDate = new Date();
    var FechaTemp = document.getElementById("txt_F_Planeada_Inicio").value;
    var k = FechaTemp.split('-');
    myDate.setFullYear(k[0], parseInt(k[1]) - 1, k[2]);


    myDate.setTime(myDate.getTime() + dateOffset);

    var filter = '';
    filter += myDate.getFullYear().toString() + "-" + (myDate.getMonth() + 1).toString() + "-" + myDate.getDate().toString();
    var string = filter.split('-');
    var filter2 = '';
    filter2 += string[0] + '-';
    if (string[1].length == 1) {
        filter2 += '0' + string[1] + '-';
    }
    else {
        filter2 += '' + string[1] + '-';
    }
    if (string[2].length == 1) {
        filter2 += '0' + string[2];
    }
    else {
        filter2 += '' + string[2];
    }
    $('#txt_F_Planeada_Fin').val(filter2);

});

$("#dt-Proyecto").on('click-row.bs.table', function (e, row, $element) {
    if (SecundaryList.length > 0) {
        console.log("awñrfkamw");

    }
});

$("#dt-Proyecto").on('click', 'tr', function (event) {
    if (SecundaryList.length > 0) {
        console.log("awñrfkamw");
    }
});

function registerTrans(id) {
    try {
        var entity = new Entity('Trans_Act');

        entity = listGetQuery('Trans_Act')

        //Join 1
        var entityChild = new Entity('Transacciones');

        var fields = [];

        fields.push('FK_Proyecto.Id_Proyecto.Proyecto.select.Id.Nombre');

        entityChild = listFields(fields, entityChild);

        var atrMain = new Attribute('FK_Transacciones', "", "", 'FK_Transacciones');

        var atrChild = new Attribute('Id', "", "", 'Id');

        var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);

        var joins = [];

        joins.push(selectJoin);

        //Join 2

        var entityChild2 = new Entity('Proyecto');

        var fields2 = [];

        fields2.push('FP_init.F_Planeada_Inicio.string.inputDate');
        fields2.push('FP_fin.F_Planeada_Fin.string.inputDate');

        entityChild2 = listFields(fields2, entityChild2);

        var atrMain2 = new Attribute('FK_Proyecto', "", "", 'FK_Proyecto');

        var atrChild2 = new Attribute('Id', "", "", 'Id');

        var selectJoin2 = new selectJoinEntity(logicalOperator.And, atrMain2, atrChild2);

        var joins2 = [];

        joins2.push(selectJoin2);

        var join2 = new JoinEntity(entityChild2, JoinType.Inner, logicalOperator.And, joins2);

        entityChild.ChildEntities.push(join2)

        //Join 3
        var entityChild3 = new Entity('Transacciones');

        var fields3 = [];

        fields3.push('Id.Clave.int.input');
        fields3.push('Duracion.Duracion.Duracion.input');

        entityChild3 = listFields(fields3, entityChild3);

        var atrMain3 = new Attribute('FK_Actividades', "", "", 'FK_Actividades');

        var atrChild3 = new Attribute('Id', "", "", 'Id');

        var selectJoin3 = new selectJoinEntity(logicalOperator.And, atrMain3, atrChild3);

        var joins3 = [];

        joins3.push(selectJoin3);



        var join = new JoinEntity(entityChild, JoinType.Inner, logicalOperator.And, joins);

        entity.ChildEntities.push(join)


        var join3 = new JoinEntity(entityChild3, JoinType.Inner, logicalOperator.And, joins3);

        entity.ChildEntities.push(join3)


        //Fin de Joins

        var WhereAttr;
        var lwhere = [];

        WhereAttr = $.extend({}, entity.Attributes[0]);

        WhereAttr.AttrValue = id;

        var where = new Where(WhereAttr, whereOperator.Equal);
        lwhere.push(where);


        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

        lGroupWhere.push(groupWhere);
        entity.GroupWheres = lGroupWhere;

        wsGetListEntity(entity, function (val) {
            if (val != undefined) {

            }
        });

    } catch (e) {
        console.error(e.Message);
    }
}
