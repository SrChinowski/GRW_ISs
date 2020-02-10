function getQueryListGroup(nameEntity) {

    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('GroupId.Clave');
    fields.push('Name.Marca');
    listFields(fields, entity);

    return entity;
}
function getQueryGroup(nameEntity, id) {
    if (id != '') {
        var entity = new Entity(nameEntity);
        var fields = [];
        fields.push('GroupId.Clave');
        fields.push('Name.Name');


        listFields(fields, entity);

        var atr = new Attribute('GroupId', id, "string", 'Clave');
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
    else { return '' }
}


function fillFieldsGroup(nameEntity, objdata) {

    console.log(objdata);

    try {
        $('#txt_Group').val(objdata[0].Clave);
        $('#txt_Name').val(objdata[0].Name);
    } catch (e) {

    }


}

function formEntityGroupToSave(page) {
    var newEntity = true;
    var varGroup = '';
    var id = $('#hdnId').val();

    var entity = new Entity('Group');
    if (id != undefined && id != '') {
        newEntity = false;
        varGroup = id;
    }
    else {
        varGroup = $('#txt_Group').val();
    }

    var atr = new Attribute('GroupId', varGroup, "string");
    entity.Attributes.push(atr);

    var nameGroup = $('#txt_Name').val();
    var atr = new Attribute('Name', nameGroup, "string");
    entity.Attributes.push(atr);

    if (newEntity == true) {
        saveEntity(entity, page, varGroup);
    }
    else {

        var atr = new Attribute('GroupId', id, "string");
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
function formEntityGroupToDelete(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var field = 'GroupId';
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

function completeGroupDelete(nameEntity, groupId) {
    var listItems = $("#sortable1 li");
    listItems.each(function (idx, li) {
        var brand = $(li);
        var entityBrandByGroup = new Entity('BrandByGroup');
        var atr = new Attribute('GroupId', idGroup, "string", 'GroupId');
        entityBrandByGroup.Attributes.push(atr);
        var atrBrand = new Attribute('BrandId', brand[0].id, "string", 'BrandId');
        entityBrandByGroup.Attributes.push(atrBrand);

        var atrMain = new Attribute('BrandId', brand[0].id, "", 'BrandId');
        var atrChild = new Attribute('BrandId', brand[0].id, "", 'BrandId');

        var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
        var joins = [];
        joins.push(selectJoin);

        var join = new JoinEntity(entityBrandByGroup, JoinType.Inner, logicalOperator.And, joins);
        entity.ChildEntities.push(join)
    });
    return;
}

function whereGroupByBrand(entity, id) {

    var entUserRole = new Entity('BrandByGroup');
    var fields = [];
    fields.push('GroupId.GroupId');
    listFields(fields, entUserRole);

    var atrMain = new Attribute('BrandId', "", "", 'BrandId');
    var atrChild = new Attribute('BrandId', "", "", 'BrandId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);


    var lwhere = [];
    var atr = new Attribute('GroupId', id, "string", 'Clave');
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

function createOptionsGroup() {
    var options = [];

    options.push('Ver');
    options.push('Eliminar');
    return options;
}