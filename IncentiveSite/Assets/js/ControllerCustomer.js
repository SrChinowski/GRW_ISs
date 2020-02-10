
function getFields() { //Listo
    //El valor de Id del registro siempre se tiene que poner primero
    var fields = [];
    fields.push('CustId.Clave.Customer.input');
    fields.push('Name.Nombre.Name.input');
    fields.push('RFC.RFC.RFC.input');
    fields.push('ParentCustId.Cadena.Cadena.select');
    fields.push('KAMName.KAM.KAM.select');

    return fields;
} //Listo No Borrar

function getFieldsWithChilds() { //Nueva Listo
    var fields = [];
    fields.push('CustId.Clave.Customer.input');
    fields.push('Name.Nombre.Name.input');
    fields.push('RFC.RFC.RFC.input');
    fields.push('ParentCustId.Cadena.Cadena.select');
    fields.push('KAMName.KAM.KAM.select');
    fields.push('TerritoryId.Territorio.Territory.select');
    fields.push('ZoneId.Zona.Zone.select');

    return fields;
}//Nueva

function getChildEntities() { // Listo
    var entity = [];

    //TERRITORY
    var entChildEntity = new Entity('Territory');
    var fields = [];
    fields.push('TerritoryId.Territorio.Territory.select');
    entChildEntity = listFields(fields, entChildEntity);

    var atrMain = new Attribute('TerritoryId', "", "Territory", 'TerritoryId', 'select');
    var atrChild = new Attribute('TerritoryId', "", "Territory", 'TerritoryId', 'select');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);

    var join = new JoinEntity(entChildEntity, JoinType.Left, logicalOperator.And, joins);
    entity.push(join);

    //ZONE

    var entChildEntity = new Entity('Zone');
    var fields = [];
    fields.push('ZoneId.Zona.Zone.select');
    entChildEntity = listFields(fields, entChildEntity);

    var atrMain = new Attribute('ZoneId', "", "Zone", 'ZoneId', 'select');
    var atrChild = new Attribute('ZoneId', "", "Zone", 'ZoneId', 'select');
    var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
    var joins = [];
    joins.push(selectJoin);

    var join = new JoinEntity(entChildEntity, JoinType.Left, logicalOperator.And, joins);
    entity.push(join);

    return entity;
} //Listo No Borrar

//Funciones Removidas
//Function fillFIeldsCustomer() Listo - Removida -> FillFields()
//Function createOptionsCustomer() Listo - Removida -> CreateOptions()
//Function formEntityCustomerToSave() Listo - Removida -> FormEntityToSave()
//Function formEntityCustomeroToDelete() Listo - Removida -> FormEntityCustomerToDelete()
//Function controlsDisabledCustomer() Listo - Removida -> FormControlsDisabled()
//Function getQueryCustomer() Listo - Removida -> formGetQuery()
