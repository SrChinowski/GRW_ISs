

function getFields() { //Listo
    //El valor de Id del registro siempre se tiene que poner primero
    var fields = [];
    fields.push('ZoneId.Clave.Zone.input');
    fields.push('Name.Zona.Zone.input');

    return fields;
} //Listo No Borrar

function getFieldsWithChilds() { //Nueva Listo
    var fields = [];
    fields.push('ZoneId.Clave.Zone.input');
    fields.push('Name.Zona.Zone.input');

    return fields;
}//Nueva

function getChildEntities() { // Listo
    var entity = [];

    return entity;
} //Listo No Borrar