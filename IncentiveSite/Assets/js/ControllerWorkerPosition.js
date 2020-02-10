function getQueryListWorkerPosition(nameEntity) {

    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('PositionId.Clave');
    fields.push('Name.Nombre');
    fields.push('IsSeller.EsVendedor');
    listFields(fields, entity);

    listChildEntitiesWorkerPosition(entity);

    return entity;
}
function getQueryWorkerPosition(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push('PositionId.PositionId');
    fields.push('Name.Name');
    fields.push('IsSeller.IsSeller');
    fields.push('IncentiveId.IncentiveId');

    listFields(fields, entity);
    listChildEntitiesWorkerPosition(entity);

    if (id != '') {
        var atr = new Attribute('PositionId', id, "string", 'Clave');
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
function listChildEntitiesWorkerPosition(entity) {
    //Incentive
    var entChildIncentive = new Entity('IncentiveSetup');
    var fields = [];
    fields.push('IncentiveType.Incentivo');
    entChildIncentive = listFields(fields, entChildIncentive);

    var atrMain = new Attribute('IncentiveId', "", "", 'IncentiveId');
    var atrChild = new Attribute('IncentiveId', "", "", 'IncentiveId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);

    var join = new JoinEntity(entChildIncentive, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join)

    return entity;
}

function fillFieldsWorkerPosition(nameEntity, objdata) {

    console.log(objdata);

    try {
        $('#txt_PositionId').val(objdata[0].PositionId);
        $('#txt_Name').val(objdata[0].Name);
        $('#txt_IsSeller').val(objdata[0].IsSeller);
        $('#txt_IncentiveId').val(objdata[0].IncentiveId);

    } catch (e) {

    }


}

function getEntityWorkerPosition(nameEntity, id) {
    var entity = getQueryWorkerPosition(nameEntity, id);
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillFieldsWorkerPosition(nameEntity, val)
        }
    });
}

function getListEntityWorkerPosition(nameEntity) {
    var table = $('#dt-' + nameEntity).DataTable();
    if (table != undefined) {
        table.clear();
        table.destroy();
    }
    var entity = getQueryListWorkerPosition(nameEntity);
    var options = createOptionsWorkerPosition();
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillTable(nameEntity, val, options);
        }
    });
}

function formEntityWorkerPositionToSave(page) {
    var newEntity = true;
    var idIncSys = '';
    var id = $('#hdnId').val();

    var entity = new Entity('WorkerPosition');
    if (id != undefined && id != '') {
        newEntity = false;
        idIncSys = id;
    }
    else {
        idIncSys = $('#txt_PositionId').val();
    }
    var atr = new Attribute('PositionId', idIncSys, "string");
    entity.Attributes.push(atr);

    var name = $('#txt_Name').val();
    var atr = new Attribute('Name', name, "string");
    entity.Attributes.push(atr);

    var isSeller = $('#txt_IsSeller').val();
    var atr = new Attribute('IsSeller', isSeller, "string");
    entity.Attributes.push(atr);

    var incId = $('#txt_IncentiveId').val();
    var atr = new Attribute('IncentiveId', incId, "string");
    entity.Attributes.push(atr);

    if (newEntity == true) {
        wsSaveEntity(entity, page, idIncSys);
    }
    else {

        var atr = new Attribute('PositionId', id, "string");
        var lwhere = [];
        var where = new Where(atr, whereOperator.Equal);
        lwhere.push(where);

        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

        lGroupWhere.push(groupWhere);
        entity.GroupWheres = lGroupWhere;
        wsUpdateEntity(entity, page, idCust);

    }

}
function formEntityWorkerPositionToDelete(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var field = 'PositionId'
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

function createOptionsWorkerPosition() {
    var options = [];

    options.push('Ver');
    options.push('Eliminar');
    return options;
}
function controlsDisabledWorkerPosition(val) {
    
}