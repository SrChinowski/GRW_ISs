
function getQueryListTerritory(nameEntity) {

    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('TerritoryId.Clave');
    fields.push('Name.Territorio');
    listFields(fields, entity);

    return entity;
}
function getQueryTerritory(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push('TerritoryId.TerritoryId');
    fields.push('Name.Name');

    listFields(fields, entity);

    if (id != '') {
        var atr = new Attribute('TerritoryId', id, "string", 'Clave');
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


function fillFieldsTerritory(nameEntity, objdata) {

    console.log(objdata);

    try {
        $('#txt_Territory').val(objdata[0].Clave);
        $('#txt_Name').val(objdata[0].Name);
    } catch (e) {

    }


}

function formEntityTerritoryToSave(page) {
    var newEntity = true;
    var varTerritory = '';
    var id = $('#hdnId').val();

    var entity = new Entity('Territory');
    if (id != undefined && id != '') {
        newEntity = false;
        varTerritory = id;
    }
    else {
        varTerritory = $('#txt_Territory').val();
    }
    
    var atr = new Attribute('TerritoryId', varTerritory, "string");
    entity.Attributes.push(atr);

    var nameterritory = $('#txt_Name').val();
    var atr = new Attribute('Name', nameterritory, "string");
    entity.Attributes.push(atr);

    if (newEntity == true) {
        saveEntity(entity, page, varTerritory);
    }
    else {

        var atr = new Attribute('TerritoryId', id, "string");
        var lwhere = [];
        var where = new Where(atr, whereOperator.Equal);
        lwhere.push(where);

        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

        lGroupWhere.push(groupWhere);
        entity.GroupWheres = lGroupWhere;
        updateEntity(entity, page, varTerritory);

    }

}
function formEntityTerritoryToDelete(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var field = 'TerritoryId'
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

function createOptionsTerritory() {
    var options = [];

    return options;
}