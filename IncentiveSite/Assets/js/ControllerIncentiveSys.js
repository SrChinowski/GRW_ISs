function getEntityDataIncentiveSys(nameEntity, id) {
    entity = getQueryincentiveSys(nameEntity, id);
    wsGetListEntity(entity, function (val) {
        if (val != undefined) {
            fillFieldsIncentiveSys(nameEntity, val)
            entitySecurity = getSecurityIncentiveSys(id);
            wsGetListEntity(entitySecurity, function (values) {
                if (values != undefined) {
                    fillTablePrivileges('SecurityPrivilege', values);
                    getUpdateSecurityIncentiveSys(id);
                }
            });
        }
    });
}

function getQueryIncentiveSys(nameEntity, id) {
    //AGREGO LOS CAMPOS A TRAER
    var entity = new Entity('IncentiveSys');
    var fields = [];
    fields.push('EmailUser.EmailUser');
    fields.push('Password.Password');
    fields.push('Host.Host');
    fields.push('Port.Port')
    listFields(fields, entity);
    //AGREGO EL WHERE
    var atr = new Attribute('RoleId', id, "string", 'Clave');
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