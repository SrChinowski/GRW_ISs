function getListEntityPermanency(nameEntity) {
    try {
        entity = getQueryListPermanency(nameEntity);
        var options = createOptionsPermanency();
        wsGetListEntity(entity, function (val) {
            if (val != undefined) {
                fillTablePermanency(nameEntity, val, options);
            }
        });
    } catch (e) {
        console.error(e.Message);

    }

}
function fillTablePermanency(nameEntity, objdata, options) {

    var columns = [];

    columns.push({ title: 'EmployeeId' });
    columns.push({ title: 'CustId' });
    columns.push({ title: 'Empleado' });
    columns.push({ title: 'Tienda' });
    columns.push({ title: 'Fecha Inicial' });
    columns.push({ title: 'Fecha Final' });

    var vHtmlTable = createTableHTML(nameEntity, columns, options);

    $('#dvTable').html(vHtmlTable);

    var table = $('#dt-' + nameEntity).DataTable({
        data: objdata,
        searching: false,

        columns: [
            {
                data: null,
                width: "5%",
                render: function (a, b, data, d) {
                    var buttonID = data.CustId;
                    var buttons = ''
                    buttons = '<i  id="' + buttonID + '" employeId="' + data.EmployeeId + '" fechainicial="' + data.FechaInicial + '" fechafinal="' + data.FechaFinal + '" class="ms-Icon ms-Icon--Delete btnDelete" style="cursor: pointer;" aria-hidden="true"></i>';
                    return buttons;
                }
            },
            {
                data: 'EmployeeId',
                visible: false

            },
            {
                data: 'CustId',
                visible: false
            },
            {
                data: 'Empleado'
            },
            {
                data: 'Tienda'
            },
            {
                "render": function (data, type, full, meta) {
                    if (full.FechaInicial != null) {
                        full.FechaInicial = full.FechaInicial.replace("p. m.", '')
                        full.FechaInicial = full.FechaInicial.replace("a. m.", '')
                        var date = full.FechaInicial;
                        date = moment(date, 'DD/MM/YYYY');
                        var fecha = moment(date).format("DD/MM/YYYY");
                        return fecha;
                    }
                    else {
                        return null;
                    }
                }
            },
            {
                "render": function (data, type, full, meta) {
                    if (full.FechaFinal != null) {
                        full.FechaFinal = full.FechaFinal.replace("p. m.", '');
                        full.FechaFinal = full.FechaFinal.replace("a. m.", '');
                        var dateFinal = full.FechaFinal;
                        dateFinal = moment(dateFinal, 'DD/MM/YYYY');
                        var fecha = moment(dateFinal).format("DD/MM/YYYY");
                        return fecha;
                    }
                    else {
                        return null;
                    }
                }
            }
        ],
        fixedColumns: true,
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                title: 'DataExport',
                exportOptions: {
                    columns: [3, 4, 5, 6]
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


        //// puts a filters in columns
        initComplete: function () {
            this.api().columns([3, 4]).every(function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')

                    .appendTo($(column.header()).empty())
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
    //$('.buttons-excel').detach();
    //$('.buttons-excel').detach().prependTo('.card-table');
}
function getQueryListPermanency(nameEntity) {

    var entity = new Entity(nameEntity);



    listChildEntitiesPermanency(entity);
    var fields = [];
    fields.push('InitDate.FechaInicial');
    fields.push('FinalDate.FechaFinal');
    fields.push('EmployeeId.EmployeeId');
    fields.push('CustId.CustId');
    listFields(fields, entity);

    return entity;
}
function listChildEntitiesPermanency(entity) {
    //EMPLEADO
    var entChildEmployee = new Entity('Employee');
    var fields = [];
    fields.push('Name.Empleado');
    entChildEmployee = listFields(fields, entChildEmployee);

    var atrMain = new Attribute('EmployeeId', "", "", 'EmployeeId');
    var atrChild = new Attribute('EmployeeId', "", "", 'EmployeeId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);

    var join = new JoinEntity(entChildEmployee, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join)
    //CUSTOMER

    var entChildCustomer = new Entity('Customer');
    var fields = [];
    fields.push('Name.Tienda');
    entChildCustomer = listFields(fields, entChildCustomer);

    var atrMain = new Attribute('CustId', "", "", 'CustId');
    var atrChild = new Attribute('CustId', "", "", 'CustId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);

    var joins = [];
    joins.push(selectJoin);
    var join = new JoinEntity(entChildCustomer, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join)

    return entity;
}
function createOptionsPermanency() {
    var options = [];
    options.push('Eliminar');
    return options;
}