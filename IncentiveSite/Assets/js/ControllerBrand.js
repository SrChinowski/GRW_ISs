function getQueryListBrand(nameEntity) {

    var newEntity = getBrandIdForForm(nameEntity);
    var entity = new Entity(nameEntity);

    var fields = [];
    fields.push('BrandId.Clave');
    fields.push('Name.Marca');
    listFields(fields, entity);

    return entity;
}
function getQueryBrand(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var fields = [];
    fields.push('BrandId.BrandId');
    fields.push('Name.Name');

    listFields(fields, entity);

    if (id != '') {
        var atr = new Attribute('BrandId', id, "string", 'Clave');
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

function fillFieldsBrand(nameEntity, objdata) {

    console.log(objdata);

    try {
        $('#txt_Numero').val(objdata[0].Clave);
        $('#txt_Name').val(objdata[0].Name);
    } catch (e) {

    }


}

function formEntityBrandToSave(page) {

    var msj = controlsValidate();
    if (msj == '') {


        var newEntity = true;
        var varBrand = '';
        var id = $('#hdnId').val();

        var entity = new Entity('Brand');
        if (id != undefined && id != '') {
            newEntity = false;
            varBrand = id;
        }
        else {
            varBrand = $('#txt_Brand').val();
        }

        /*var atr = new Attribute('BrandId', varBrand, "string");
        entity.Attributes.push(atr);*/

        var nameBrand = $('#txt_Name').val();
        var atr = new Attribute('Name', nameBrand, "string");
        entity.Attributes.push(atr);

        if (newEntity == true) {
            wsSaveEntity(entity, page, varBrand);
        }
        else {

            var atr = new Attribute('BrandId', id, "string");
            var lwhere = [];
            var where = new Where(atr, whereOperator.Equal);
            lwhere.push(where);

            var lGroupWhere = [];
            var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

            lGroupWhere.push(groupWhere);
            entity.GroupWheres = lGroupWhere;
            wsUpdateEntity(entity, page, varBrand);

            $("#lblInfo").text('Guardado exitosamente');
            $("#dvInfo").show();

        }
    }
    else {
        $("#lblInfo").text(msj);
        $("#dvInfo").show();
    }
}

function controlsValidate() {
    var result = '';
    var name = $('#txt_Name').val();
    if (name == '') {
        result = 'Favor de Ingresar la información correctamente. ';
    }

    return result;
}

function formEntityBrandToDelete(nameEntity, id) {

    var entity = new Entity(nameEntity);
    var field = 'BrandId';
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

function getBrandIdForForm(nameEntity) {

    var entity = new Entity(nameEntity);
    entity.getLastIdentity = true;

    var fields = [];
    fields.push('BrandId.Clave');

    return entity;

}

function createOptionsBrand() {
    var options = [];

    options.push('Ver');
    options.push('Eliminar');
    return options;
}

function controlsDisabledBrand(val) {
    $('#txt_Numero').prop("disabled", val);

}