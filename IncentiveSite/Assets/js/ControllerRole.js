function createOptionsRole() {
    var options = [];

    options.push('Ver');
    options.push('Eliminar');
    return options;
}
function getQueryListRole(nameEntity) {
    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('RoleId.Clave');
    fields.push('Name.Nombre');
    listFields(fields, entity);

    return entity;
}

function formEntityRoleToSave(page) {

    var msj = controlsValidate();
    if (msj == '') {
        var newEntity = true;
        var idRole = '';
        var id = $('#hdnId').val();

        var entity = new Entity('Role');
        if (id != undefined && id != '') {
            newEntity = false;
            idRole = id;
        }
        else {
            idRole = $('#txt_Number').val().trim();
        }
        var atr = new Attribute('RoleId', idRole, "string");
        entity.Attributes.push(atr);

        var name = $('#txt_Name').val().trim();
        var atr = new Attribute('Name', name, "string");
        entity.Attributes.push(atr);

        if (newEntity == true) {
            wsSaveEntity(entity, page, idRole);
        }
        else {

            var atr = new Attribute('RoleId', idRole, "string");
            var lwhere = [];
            var where = new Where(atr, whereOperator.Equal);
            lwhere.push(where);

            var lGroupWhere = [];
            var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

            lGroupWhere.push(groupWhere);
            entity.GroupWheres = lGroupWhere;
            var entities = getUpdateSecurityRole('SecurityPrivilege', idRole);
            wsUpdateEntity(entity, page, idRole, entities);

        }
    }
    else {
        $("#lblInfo").text(msj);
        $("#dvInfo").show();
    }
}
function controlsValidate() {
    var result = '';
    var id = $('#txt_Number').val();
    var name = $('#txt_Name').val();
    if (id == '' || name == '') {
        result = 'Favor de ingresar la información correctamente.';
    }

    return result;
}
function getEntityData(nameEntity, id) {
    entity = getQueryRole(nameEntity, id);
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillFieldsRole(nameEntity, val)
            entitySecurity = getSecurityRole(id);
            wsGetListEntity(entitySecurity, function (values) {
                if (values != undefined) {
                    fillTablePrivileges('SecurityPrivilege', values);
                    getUpdateSecurityRole(id);
                }
            });
        }
    });
}
function getQueryRole(nameEntity, id) {
    //AGREGO LOS CAMPOS A TRAER
    var entity = new Entity('Role');
    var fields = [];
    fields.push('Name.Name');
    listFields(fields, entity);
    //AGREGO EL WHERE
    var atr = new Attribute('RoleId', id, "string", 'Clave');
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

function getSecurityRole(id) {


    var entitySecurityPrivilege = new Entity('SecurityPrivilege');
    var fields = [];
    fields.push('EntityId.EntityId');
    fields.push('RoleId.RoleId');
    fields.push('Privilege.Privilegios');
    listFields(fields, entitySecurityPrivilege);
    var atr = new Attribute('RoleId', id, "string", 'Clave');

    var lwhere = [];
    var where = new Where(atr, whereOperator.Equal);
    lwhere.push(where);
    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);
    lGroupWhere.push(groupWhere);
    entitySecurityPrivilege.GroupWheres = lGroupWhere;


    var entChildZone = new Entity('Entity');
    var fields = [];
    fields.push('Name.Permisos');
    entChildZone = listFields(fields, entChildZone);

    var atrMain = new Attribute('EntityId', "", "", 'EntityId');
    var atrChild = new Attribute('EntityId', "", "", 'EntityId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);

    var joins = [];
    joins.push(selectJoin);
    var join = new JoinEntity(entChildZone, JoinType.Left, logicalOperator.And, joins);
    entitySecurityPrivilege.ChildEntities.push(join)


    return entitySecurityPrivilege;

}
function fillFieldsRole(nameEntity, val) {
    try {

        $('#txt_Number').val(val[0].Clave);
        $('#txt_Name').val(val[0].Name);


    } catch (e) {

    }
}


function fillTablePrivileges(nameEntity, objdata) {
    try {

        var privilegesOption = securityPrivilege();

        var options = [];
        var columns = [];
        columns.push({ title: 'EntityId' });
        columns.push({ title: 'Permisos' });
        columns.push({ title: 'Privilegios' });

        var vHtmlTable = createTableHTML(nameEntity, columns, options);

        $('#dvTable').html(vHtmlTable);

        var table = $('#dt-' + nameEntity).DataTable({
            data: objdata,
            fixedColumns: true,
            columns: [
                {
                    data: 'EntityId',
                    visible: false

                },
                {
                    data: 'Permisos'
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        var $select = $('<select class="privilege_ddl"></select>');
                        $.each(privilegesOption, function (k, v) {

                            var $option = $("<option></option>",
                                {
                                    text: v.name,
                                    value: v.id
                                });


                            if (row.Privilegios == v.id) {
                                $option.attr("selected", "selected");
                            }
                            $select.append($option);

                        });
                        return $select.prop("outerHTML");

                    }
                }


            ],
            initComplete: function () {
                $('#dt-SecurityPrivilege tbody').on('change', 'select.privilege_ddl', function () {
                    //get selected value
                    var changed = $(this).find(":selected").val();

                    var row = table.row($(this).closest('tr'));
                    var data = row.data();
                    data.Privilegios = changed;
                    row.invalidate().draw(false);
                });
            }

        });

    } catch (e) {
        console.log(e);


    }


}

function getUpdateSecurityRole(nameEntity, idRole) {

    var entities = [];
    var table = $('#dt-' + nameEntity).DataTable();

    var data = table.rows().data();
    data.each(function (value, index) {
        var entitySecurity = new Entity(nameEntity);
        var atr = new Attribute('RoleId', idRole, "string", 'RoleId');
        entitySecurity.Attributes.push(atr);
        var atrEntity = new Attribute('EntityId', value.EntityId, "string", 'EntityId');
        entitySecurity.Attributes.push(atrEntity);
        var atrPrivilege = new Attribute('Privilege', value.Privilegios, "int", 'Privilege');
        entitySecurity.Attributes.push(atrPrivilege);
        entities.push(entitySecurity);

    });

    return entities;
}

function addChildToDeleteRole(entity, id) {
    //DELETE TO USER ROLES
    var entUserRole = new Entity('UserRoles');
    var fields = [];
    fields.push('RoleId.RoleId');
    listFields(fields, entUserRole);

    var atrMain = new Attribute('RoleId', "", "", 'RoleId');
    var atrChild = new Attribute('RoleId', "", "", 'RoleId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);


    var lwhere = [];
    var atr = new Attribute('RoleId', id, "string", 'Clave');
    var where = new Where(atr, whereOperator.Equal);
    lwhere.push(where);


    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

    lGroupWhere.push(groupWhere);
    entUserRole.GroupWheres = lGroupWhere;


    var join = new JoinEntity(entUserRole, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join);

    //DELETE TO SECURITY

    var entSecurity = new Entity('SecurityPrivilege');
    var fields = [];
    fields.push('RoleId.RoleId');
    listFields(fields, entSecurity);

    var atrMain = new Attribute('RoleId', "", "", 'RoleId');
    var atrChild = new Attribute('RoleId', "", "", 'RoleId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);


    var lwhere = [];
    var atr = new Attribute('RoleId', id, "string", 'Clave');
    var where = new Where(atr, whereOperator.Equal);
    lwhere.push(where);


    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

    lGroupWhere.push(groupWhere);
    entSecurity.GroupWheres = lGroupWhere;


    var join = new JoinEntity(entSecurity, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join);

    return entity;
}