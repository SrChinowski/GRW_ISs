function getQueryListBudget(nameEntity) {

    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('CustId.Clave');
    fields.push('BudgetAmt.Presupuesto');
    fields.push('Month.Mes');
    fields.push('Year.Año');
    listFields(fields, entity);

    return entity;
}
function getQueryBudget(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push('CustId.CustId');
    fields.push('BudgetAmt.BudgetAmt');
    fields.push('Month.Month');
    fields.push('Year.Year');

    listFields(fields, entity);

    if (id != '') {
        var atr = new Attribute('CustId', id, "string", 'Clave');
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

function fillFieldsBudget(nameEntity, objdata) {

    console.log(objdata);

    try {
        $('#txt_CustId').val(objdata[0].CustId);
        $('#txt_BudgetAmt').val(objdata[0].BudgetAmt);
        $('#txt_Month').val(objdata[0].Month);
        $('#txt_Year').val(objdata[0].Year);

    } catch (e) {

    }


}

function getEntityBudget(nameEntity, id) {
    var entity = getQueryBudget(nameEntity, id);
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillFieldsBudget(nameEntity, val)
        }
    });
}

function getListEntityBudget(nameEntity) {
    var table = $('#dt-' + nameEntity).DataTable();
    if (table != undefined) {
        table.clear();
        table.destroy();
    }
    var entity = getQueryListBudget(nameEntity);
    var options = createOptionsBudget();
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillTable(nameEntity, val, options);
        }
    });
}

function formEntityBudgetToSave(page) {
    var newEntity = true;
    var custId = '';
    var id = $('#hdnId').val();

    var entity = new Entity('Budget');
    if (id != undefined && id != '') {
        newEntity = false;
        custId = id;
    }
    else {
        custId = $('#txt_CustId').val();
    }
    var atr = new Attribute('CustId', custId, "string");
    entity.Attributes.push(atr);

    var budget = $('#txt_BudgetAmt').val();
    var atr = new Attribute('BudgetAmt', budget, "string");
    entity.Attributes.push(atr);

    var month = $('#txt_Month').val();
    var atr = new Attribute('Month', month, "string");
    entity.Attributes.push(atr);

    var year = $('#txt_Year').val();
    var atr = new Attribute('Year', year, "string");
    entity.Attributes.push(atr);

    if (newEntity == true) {
        wsSaveEntity(entity, page, custId);
    }
    else {

        var atr = new Attribute('CustId', id, "string");
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
function formEntityBudgetToDelete(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var field = 'CustId'
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

function createOptionsBudget() {
    var options = [];

    options.push('Ver');
    options.push('Eliminar');
    return options;
}
function controlsDisabledBudget(val) {

}