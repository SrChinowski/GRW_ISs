
function getQueryBrand(id, option) {

    if (option == 1) {
        //TRAE TODAS LAS MARCAS
        var entity = new Entity('Brand');
        var fields = [];
        fields.push('BrandId.BrandId');
        fields.push('Name.Name');
        listFields(fields, entity);
        return entity;
    }
    else {
        if (id != '') {
            //Trae las marcas que pertenecen al grupo
            var entity = new Entity('Brand');
            whereBrandGroup(entity, id);
            return entity;
        }
    }

}

function whereBrand(entity, id) {
    if (id != '') {
        var entBrandByGroup = new Entity('BrandByGroup');
        var fields = [];
        fields.push('GroupId.GroupId');
        listFields(fields, entBrandByGroup);

        var atrMain = new Attribute('BrandId', "", "", 'BrandId');
        var atrChild = new Attribute('BrandId', "", "", 'BrandId');
        var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
        var joins = [];
        joins.push(selectJoin);


        var lwhere = [];
        var atr = new Attribute('GroupId', id, "string", 'Numero');
        var where = new Where(atr, whereOperator.NotEqual);
        lwhere.push(where);
        var atrNull = new Attribute('GroupId', 'null', "string", 'Numero');
        var where = new Where(atrNull, whereOperator.IsNull);
        lwhere.push(where);

        var lGroupWhere = [];
        var groupWhere = new GroupWhere(logicalOperator.Or, lwhere, logicalOperator.Or);

        lGroupWhere.push(groupWhere);
        entBrandByGroup.GroupWheres = lGroupWhere;


        var join = new JoinEntity(entBrandByGroup, JoinType.Inner, logicalOperator.And, joins);
        entity.ChildEntities.push(join)
    }


    return entity;
}

function whereBrandGroup(entity, id) {

    var entBrandByGroup = new Entity('BrandByGroup');
    var fields = [];
    fields.push('GroupId.GroupId');
    listFields(fields, entBrandByGroup);

    var atrMain = new Attribute('BrandId', "", "", 'BrandId');
    var atrChild = new Attribute('BrandId', "", "", 'BrandId');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);


    var lwhere = [];
    var atr = new Attribute('GroupId', id, "string", 'Numero');
    var where = new Where(atr, whereOperator.Equal);
    lwhere.push(where);


    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

    lGroupWhere.push(groupWhere);
    entBrandByGroup.GroupWheres = lGroupWhere;


    var join = new JoinEntity(entBrandByGroup, JoinType.Left, logicalOperator.And, joins);
    entity.ChildEntities.push(join)

    return entity;
}


function fillFieldsGroup(nameEntity, val) {
    try {
   
        $('#txt_Number').val(val[0].Clave);
        $('#txt_Name').val(val[0].Name);


    } catch (e) {

    }
}

function formEntityGroupToSave(page) {
    var msj = controlsValidate();
    if (msj == '') {
        var newEntity = true;
        var idGroup = '';
        var id = $('#hdnId').val();

        var entity = new Entity('Group');
        if (id != undefined && id != '') {
            newEntity = false;
            idGroup = id;
        }
        else {
            idGroup = $('#txt_Number').val();
        }
        var atr = new Attribute('GroupId', idGroup, "string", 'GroupId');
        entity.Attributes.push(atr);

        var nameGroup = $('#txt_Name').val();
        var atr = new Attribute('Name', nameGroup, "string", 'Name');
        entity.Attributes.push(atr);


        if (newEntity == true) {

            formEntityBrandByGroupToSave(page, idGroup, entity);
            wsSaveEntity(entity, page, idGroup);
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
            var entities = getEntitiesBrandByGroupToSave(idGroup);
            wsUpdateEntity(entity, page, idGroup, entities);


        }

    }
    else {
        $("#lblInfo").text(msj);
        $("#dvInfo").show();
    }
}


function formEntityBrandByGroupToSave(page, idGroup, entity) {
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

    return entity;
}

function getEntitiesBrandByGroupToSave(idGroup) {
    var entities = [];
    var listItems = $("#sortable1 li");
    listItems.each(function (idx, li) {
        var brand = $(li);
        var entityBrandByGroup = new Entity('BrandByGroup');
        var atr = new Attribute('GroupId', idGroup, "string", 'GroupId');
        entityBrandByGroup.Attributes.push(atr);
        var atrBrand = new Attribute('BrandId', brand[0].id, "string", 'BrandId');
        entityBrandByGroup.Attributes.push(atrBrand);
        entities.push(entityBrandByGroup);
    });

    return entities;
}



function controlsValidate() {
    var result = '';
    var idGroup = $('#txt_Number').val();
    var nameGroup = $('#txt_Name').val();
    if (idGroup == '' || nameGroup == '') {
        result = 'Favor de ingresar la información correctamente.';
    }

    return result;
}


function fillTablesDrag(id) {
    if (id == '') {
        var entity = getQueryBrand(id, 1);
        wsGetListEntity(entity, function (val) {
            if (val != undefined) {
                fillSortable(val, 'sortable2', 'ui-state-highlight');
            }
        });
    }
    else {
        var entity = getQueryBrand(id, 1);
        wsGetListEntity(entity, function (val) {
            if (val != undefined) {
                var entityGroupBrand = getQueryBrand(id, 2);
                wsGetListEntity(entityGroupBrand, function (values) {
                    if (values != undefined) {
                        for (var i = val.length - 1; i >= 0; i--) {
                            for (var j = 0; j < values.length; j++) {
                                if (val[i] && (val[i].BrandId === values[j].BrandId)) {
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



function fillSortable(val, nameelement, cssstyle) {
    var ul = document.getElementById(nameelement);
    val.forEach(
        function (item) {
            if (item != null)
                var li = document.createElement("li");
            li.setAttribute("id", item.BrandId);
            li.setAttribute("class", cssstyle);
            li.appendChild(document.createTextNode(item.Name));
            ul.appendChild(li);

        }
    );
}