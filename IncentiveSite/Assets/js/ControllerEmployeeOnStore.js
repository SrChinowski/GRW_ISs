function getQueryListEmployeeOnStore(nameEntity) {

    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('StoreEmployeeId.Clave');
    listFields(fields, entity);

    listChildEntitiesEmployeeOnStore(entity);

    return entity;
}
function getQueryEmployeeOnStore(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push('StoreEmployeeId.StoreEmployeeId');
    fields.push('EmployeeId.EmployeeId');
    fields.push('CustId.CustId');

    listFields(fields, entity);
    listChildEntitiesEmployeeOnStore(entity);

    if (id != '') {
        var atr = new Attribute('StoreEmployeeId', id, "string", 'Clave');
        entity.Attributes.push(atr);

        var lwhere = [];
        var where = new Where(atr, whereOperator.Equal);
        lwhere.push(where);

        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

        lGroupWhere.push(groupWhere);
        entity.GroupWheres = lGroupWhere;
    }
    return entity;
}

//put ChildEntities to entity
function listChildEntitiesEmployeeOnStore(entity) {
    //Employee
    var entChildIncentive = new Entity('Employee');
    var fields = [];
    fields.push('Name.Empleado');
    entChildIncentive = listFields(fields, entChildIncentive);

    var atrMain = new Attribute('EmployeeId', "", "", 'EmployeeId');
    var atrChild = new Attribute('EmployeeId', "", "", 'EmployeeId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);

    var join = new JoinEntity(entChildIncentive, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join)

    //Customer
    var entChildIncentive = new Entity('Customer');
    var fields = [];
    fields.push('Name.Cliente');
    entChildIncentive = listFields(fields, entChildIncentive);

    var atrMain = new Attribute('CustId', "", "", 'CustId');
    var atrChild = new Attribute('CustId', "", "", 'CustId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);

    var join = new JoinEntity(entChildIncentive, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join)

    return entity;
}

function fillFieldsEmployeeOnStore(nameEntity, objdata) {

    console.log(objdata);

    try {
        $('#txt_StoreEmployeeId').val(objdata[0].StoreEmployeeId);
        $('#txt_EmployeeId').val(objdata[0].EmployeeId);
        $('#txt_CustId').val(objdata[0].CustId);

    } catch (e) {

    }


}

function getEntityEmployeeOnStore(nameEntity, id) {
    var entity = getQueryEmployeeOnStore(nameEntity, id);
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillFieldsEmployeeOnStore(nameEntity, val)
        }
    });
}

function getListEntityEmployeeOnStore(nameEntity) {
    var table = $('#dt-' + nameEntity).DataTable();
    if (table != undefined) {
        table.clear();
        table.destroy();
    }
    var entity = getQueryListEmployeeOnStore(nameEntity);
    var options = createOptionsEmployeeOnStore();
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillTable(nameEntity, val, options);
        }
    });
}

function formEntityEmployeeOnStoreToSave(page) {
    var newEntity = true;
    var storeEmployeeId = '';
    var id = $('#hdnId').val();

    var entity = new Entity('EmployeeOnStore');
    if (id != undefined && id != '') {
        newEntity = false;
        storeEmployeeId = id;
    }
    else {
        storeEmployeeId = $('#txt_StoreEmployeeId').val();
    }
    var atr = new Attribute('StoreEmployeeId', storeEmployeeId, "string");
    entity.Attributes.push(atr);

    var name = $('#txt_EmployeeId').val();
    var atr = new Attribute('EmployeeId', name, "string");
    entity.Attributes.push(atr);

    var custId = $('#txt_CustId').val();
    var atr = new Attribute('CustId', custId, "string");
    entity.Attributes.push(atr);

    if (newEntity == true) {
        wsSaveEntity(entity, page, storeEmployeeId);
    }
    else {

        var atr = new Attribute('StoreEmployeeId', id, "string");
        var lwhere = [];
        var where = new Where(atr, whereOperator.Equal);
        lwhere.push(where);

        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

        lGroupWhere.push(groupWhere);
        entity.GroupWheres = lGroupWhere;
        wsUpdateEntity(entity, page, storeEmployeeId);

    }

}
function formEntityEmployeeOnStoreToDelete(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var field = 'StoreEmployeeId'
    var atr = new Attribute(field, id, "string");
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

function createOptionsEmployeeOnStore() {
    var options = [];

    options.push('Ver');
    options.push('Eliminar');
    return options;
}
function controlsDisabledEmployeeOnStore(val) {

}