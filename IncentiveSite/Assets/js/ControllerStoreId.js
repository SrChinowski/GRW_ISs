function getQueryListStoreId(nameEntity) {

    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('StoreId.Clave');
    listFields(fields, entity);

    listChildEntitiesStoreId(entity);

    return entity;
}
function getQueryStoreId(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push('StoreId.StoreId');
    fields.push('CustId.CustId');

    listFields(fields, entity);
    listChildEntitiesStoreId(entity);

    if (id != '') {
        var atr = new Attribute('StoreId', id, "string", 'Clave');
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
function listChildEntitiesStoreId(entity) {
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

function fillFieldsStoreId(nameEntity, objdata) {

    console.log(objdata);

    try {
        $('#txt_StoreId').val(objdata[0].StoreId);
        $('#txt_CustId').val(objdata[0].CustId);

    } catch (e) {

    }


}

function getEntityStoreId(nameEntity, id) {
    var entity = getQueryStoreId(nameEntity, id);
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillFieldsStoreId(nameEntity, val)
        }
    });
}

function getListEntityStoreId(nameEntity) {
    var table = $('#dt-' + nameEntity).DataTable();
    if (table != undefined) {
        table.clear();
        table.destroy();
    }
    var entity = getQueryListStoreId(nameEntity);
    var options = createOptionsStoreId();
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillTable(nameEntity, val, options);
        }
    });
}

function formEntityStoreIdToSave(page) {
    var newEntity = true;
    var storeId = '';
    var id = $('#hdnId').val();

    var entity = new Entity('StoreId');
    if (id != undefined && id != '') {
        newEntity = false;
        storeId = id;
    }
    else {
        storeId = $('#txt_StoreId').val();
    }
    var atr = new Attribute('StoreId', storeId, "string");
    entity.Attributes.push(atr);

    var custId = $('#txt_CustId').val();
    var atr = new Attribute('CustId', custId, "string");
    entity.Attributes.push(atr);

    if (newEntity == true) {
        wsSaveEntity(entity, page, storeId);
    }
    else {

        var atr = new Attribute('StoreId', id, "string");
        var lwhere = [];
        var where = new Where(atr, whereOperator.Equal);
        lwhere.push(where);

        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

        lGroupWhere.push(groupWhere);
        entity.GroupWheres = lGroupWhere;
        wsUpdateEntity(entity, page, storeId);

    }

}
function formEntityStoreIdToDelete(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var field = 'StoreId'
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

function createOptionsStoreId() {
    var options = [];

    options.push('Ver');
    options.push('Eliminar');
    return options;
}
function controlsDisabledStoreId(val) {

}