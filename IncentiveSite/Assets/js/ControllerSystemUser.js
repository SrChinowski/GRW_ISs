function createOptionsSystemUser() {
    var options = [];

    options.push('Ver');
    options.push('Eliminar');
    return options;
}

function getEntityDataUser(nameEntity, id) {
    entity = getQueryUser(nameEntity, id);
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillFieldsUser(nameEntity, val)
        }
    });
}
function getQueryUser(nameEntity, id) {
    //AGREGO LOS CAMPOS A TRAER
    entity = new Entity('SystemUser');
    var fields = [];
    fields.push('FirstName.Nombre');
    fields.push('LastName.Paterno');
    fields.push('MiddleName.Materno');
    fields.push('Email.Correo');

    listFields(fields, entity);

    //AGREGO EL WHERE
    var atr = new Attribute('UserId', id, "string", 'Clave');
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

function fillFieldsUser(nameEntity, val) {
    try {

        $('#txt_Number').val(val[0].Clave);
        $('#txt_Name').val(val[0].Nombre);
        $('#txt_Paterno').val(val[0].Paterno);
        $('#txt_Materno').val(val[0].Materno);
        $('#txt_Correo').val(val[0].Correo);


    } catch (e) {

    }
}
function getQueryListSystemUser(nameEntity) {
    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('UserId.Clave');
    fields.push('FirstName.Nombre');
    fields.push('LastName.Paterno');
    fields.push('MiddleName.Materno');
    fields.push('Email.Correo');
    listFields(fields, entity);

    return entity;
}
function formEntityUserToSave(page) {
    var msj = controlsValidate();
    if (msj == '') {

        var newEntity = true;
        var varUser = '';
        var id = $('#hdnId').val();

        var entity = new Entity('SystemUser');
        if (id != undefined && id != '') {
            newEntity = false;
            varUser = id;
        }
        else {
            varUser = $('#txt_Number').val().trim();
        }
        var atr = new Attribute('UserId', varUser, "string");
        entity.Attributes.push(atr);

        var nameUser = $('#txt_Name').val().trim();
        var atr = new Attribute('FirstName', nameUser, "string");
        entity.Attributes.push(atr);

        var patUser = $('#txt_Paterno').val().trim();
        var atr = new Attribute('LastName', patUser, "string");
        entity.Attributes.push(atr);

        var matUser = $('#txt_Materno').val().trim();
        var atr = new Attribute('MiddleName', matUser, "string");
        entity.Attributes.push(atr);

        var emailUser = $('#txt_Correo').val().trim();
        var atr = new Attribute('Email', emailUser, "string");
        entity.Attributes.push(atr);


        if (newEntity == true) {
            var email = $('#txt_Correo').val();
            existEntity= checkExistUserByEmail(email);
            formEntityRoleByUserToSave(page, varUser, entity);
            wsSaveEntityUser(existEntity,entity, page, varUser);


        }
        else {

            var atr = new Attribute('UserId', id, "string");
            var lwhere = [];
            var where = new Where(atr, whereOperator.Equal);
            lwhere.push(where);

            var lGroupWhere = [];
            var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

            lGroupWhere.push(groupWhere);
            entity.GroupWheres = lGroupWhere;
            var entities = getEntitiesRoleByUserToSave(varUser);
            wsUpdateEntity(entity, page, varUser, entities);



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
    var paterno = $('#txt_Paterno').val();
    var correo = $('#txt_Correo').val();
    if (id == '' || name == '' || paterno == '' || correo == '') {
        result = 'Favor de ingresar la información correctamente.';
    }

    return result;
}
function formEntityRoleByUserToSave(page, varUser, entity) {
    var listItems = $("#sortable1 li");
    listItems.each(function (idx, li) {
        var role = $(li);
        console.log(role);
        var entRolesByUser = new Entity('UserRoles');
        var atr = new Attribute('UserId', varUser, "string", 'UserId');
        entRolesByUser.Attributes.push(atr);
        var atrBrand = new Attribute('RoleId', role[0].id, "string", 'RoleId');
        entRolesByUser.Attributes.push(atrBrand);

        var atrMain = new Attribute('RoleId', role[0].id, "", 'RoleId');
        var atrChild = new Attribute('RoleId', role[0].id, "", 'RoleId');

        var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
        var joins = [];
        joins.push(selectJoin);

        var join = new JoinEntity(entRolesByUser, JoinType.Inner, logicalOperator.And, joins);
        entity.ChildEntities.push(join)


    });

    return entity;
}
function getEntitiesRoleByUserToSave(varUser) {
    var entities = [];
    var listItems = $("#sortable1 li");
    listItems.each(function (idx, li) {
        var role = $(li);
        var entityRoleByGroup = new Entity('UserRoles');
        var atr = new Attribute('UserId', varUser, "string", 'UserId');
        entityRoleByGroup.Attributes.push(atr);
        var atrRole = new Attribute('RoleId', role[0].id, "string", 'RoleId');
        entityRoleByGroup.Attributes.push(atrRole);
        entities.push(entityRoleByGroup);
    });

    return entities;
}
function fillTablesRoleDrag(id) {

    if (id == '') {
        var entity = getQueryRole(id, 1);
        wsGetListEntity(entity, function (val) {
            if (val != undefined) {
                fillSortable(val, 'sortable2', 'ui-state-highlight');
            }
        });
    }
    else {
        var entity = getQueryRole(id, 1);
        wsGetListEntity(entity, function (val) {
            if (val != undefined) {
                var entityUserRoles = getQueryRole(id, 2);
                wsGetListEntity(entityUserRoles, function (values) {
                    if (values != undefined) {
                        for (var i = val.length - 1; i >= 0; i--) {
                            for (var j = 0; j < values.length; j++) {
                                if (val[i] && (val[i].RoleId === values[j].RoleId)) {
                                    val.splice(i, 1);
                                }
                            }
                        }
                        fillSortable(val, 'sortable2', 'ui-state-highlight');
                        fillSortable(values, 'sortable1', 'ui-state-default');
                    }
                });
            }
        });
    }
}

function getQueryRole(id, option) {

    if (option == 1) {
        //TRAE TODAS LOS ROLES
        var entity = new Entity('Role');
        var fields = [];
        fields.push('RoleId.RoleId');
        fields.push('Name.Name');
        listFields(fields, entity);
        return entity;
    }
    else {
        if (id != '') {
            //LOS ROLES DEL USUARIO
            var entity = new Entity('Role');
            var fields = [];
            fields.push('RoleId.RoleId');
            fields.push('Name.Name');
            listFields(fields, entity);
            whereUserRole(entity, id);
            return entity;
        }
    }

}
function whereUserRole(entity, id) {

    var entUserRole = new Entity('UserRoles');
    var fields = [];
    fields.push('UserId.UserId');
    listFields(fields, entUserRole);

    var atrMain = new Attribute('RoleId', "", "", 'RoleId');
    var atrChild = new Attribute('RoleId', "", "", 'RoleId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);


    var lwhere = [];
    var atr = new Attribute('UserId', id, "string", 'Clave');
    var where = new Where(atr, whereOperator.Equal);
    lwhere.push(where);


    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

    lGroupWhere.push(groupWhere);
    entUserRole.GroupWheres = lGroupWhere;


    var join = new JoinEntity(entUserRole, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join)

    return entity;
}

function checkExistUserByEmail(email) {
  
    existEntity = new Entity('SystemUser');
    var fields = [];
    fields.push('UserId.UserId');
    listFields(fields, existEntity);

    //AGREGO EL WHERE
    var atr = new Attribute('Email', email, "string", 'Email');
    existEntity.Attributes.push(atr);
    var lwhere = [];
    var where = new Where(atr, whereOperator.Equal);
    lwhere.push(where);
    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);
    lGroupWhere.push(groupWhere);
    existEntity.GroupWheres = lGroupWhere;


    return existEntity;
}
function fillSortable(val, nameelement, cssstyle) {
    var ul = document.getElementById(nameelement);
    val.forEach(
        function (item) {
            if (item != null)
                var li = document.createElement("li");
            li.setAttribute("id", item.RoleId);
            li.setAttribute("class", cssstyle);
            li.appendChild(document.createTextNode(item.Name));
            ul.appendChild(li);

        }
    );
}

