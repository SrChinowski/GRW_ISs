
function getQueryListEmployee(nameEntity) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push('EmployeeId.Clave');
    fields.push('Name.Nombre');
    fields.push('EmpType.Tipo');
    fields.push('Status.Estado');

    listFields(fields, entity);
    listChildEntitiesEmployee(entity);

    return entity;
}
function getQueryEmployee(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push('EmployeeId.EmployeeId');
    fields.push('Name.Name');
    fields.push('PositionId.PositionId');
    fields.push('EmpType.EmpType');
    fields.push('Status.Status');

    listFields(fields, entity);
    listChildEntitiesEmployee(entity);

    if (id != '') {
        var atr = new Attribute('EmployeeId', id, "string", 'Empleado');
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
function listChildEntitiesEmployee(entity) {
    //WORKERPOSITION
    var entChildTerritory = new Entity('WorkerPosition');
    var fields = [];
    fields.push('Name.Puesto');
    entChildTerritory = listFields(fields, entChildTerritory);

    var atrMain = new Attribute('PositionId', "", "", 'PositionId');
    var atrChild = new Attribute('PositionId', "", "", 'PositionId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);

    var join = new JoinEntity(entChildTerritory, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join)

    return entity;
}

function fillFieldsEmployee(nameEntity, objdata) {

    console.log(objdata);

    try {
        $('#txt_Employee').val(objdata[0].Clave);
        $('#txt_Name').val(objdata[0].Name);
        $('#txt_Position').val(objdata[0].RFC);
        $('#drp_EmployeeType').val(objdata[0].TerritoryId);
        $('#drp_Status').val(objdata[0].ZoneId);

    } catch (e) {

    }


}

function formEntityEmployeeToSave(page) {
    var newEntity = true;
    var idEmp = '';
    var id = $('#hdnId').val();

    var entity = new Entity('Employee');
    if (id != undefined && id != '') {
        newEntity = false;
        idEmp = id;
    }
    else {
        idEmp = $('#txt_Employee').val();
    }
    var atr = new Attribute('EmployeeId', idEmp, "string");
    entity.Attributes.push(atr);

    var nameEmp = $('#txt_Name').val();
    var atr = new Attribute('Name', nameEmp, "string");
    entity.Attributes.push(atr);

    var positionEmp = $('#txt_Position').val();
    var atr = new Attribute('PositionId', positionEmp, "string");
    entity.Attributes.push(atr);

    var typeEmp = $('#drp_EmployeeType').val();
    var atr = new Attribute('EmpType', typeEmp, "string");
    entity.Attributes.push(atr);

    var status = $('#drp_Status').val();
    var atr = new Attribute('Status', status, "string");
    entity.Attributes.push(atr);

    if (newEntity == true) {
        saveEntity(entity, page, idEmp);
    }
    else {

        var atr = new Attribute('EmployeeId', id, "string");
        var lwhere = [];
        var where = new Where(atr, whereOperator.Equal);
        lwhere.push(where);

        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

        lGroupWhere.push(groupWhere);
        entity.GroupWheres = lGroupWhere;
        updateEntity(entity, page, idEmp);

    }

}

function createOptionsEmployee() {
    var options = [];

    return options;
}