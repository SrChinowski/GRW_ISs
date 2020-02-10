
function getFields(val) { //Listo
    //El valor de Id del registro siempre se tiene que poner primero
    var fields = [];

    switch (val)
    {
        case "Proyecto":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            fields.push('FP_init.FP_init.string.inputDate');
            fields.push('FP_fin.FP_fin.string.inputDate');
            fields.push('FR_init.FR_init.string.inputDate');
            fields.push('FR_fin.FR_fin.string.inputDate');
            fields.push('TiempoEst.TiempoEst.TiempoEst.input');
            break;
        case "ActividadesLog":
            fields.push('Id.Clave.int.input');
            fields.push('Estatus.Estatus.Estatus.input');
            fields.push('FP_init.FP_init.string.inputDate');
            fields.push('FP_fin.FP_fin.string.inputDate');
            fields.push('FR_init.FR_init.string.inputDate');
            fields.push('FR_fin.FR_fin.string.inputDate');
            fields.push('FK_Actividades.Cuenta.Actividades.input');
            fields.push('FK_Proyecto.Clave.Proyecto.input');
            break;
        case "Servicio":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            break;

        case "Actividades":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            fields.push('Encargado.Encargado.Nombre.input');
            fields.push('FK_Servicio.FK_Servicio.int.select');
            break;
    };


    return fields;
} //Listo No Borrar

function getFieldsWithChilds(val) { //Nueva Listo
    var fields = [];

    switch (val) {
        case "Proyecto":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            fields.push('FP_init.FP_init.string.inputDate');
            fields.push('FP_fin.FP_fin.string.inputDate');
            fields.push('FR_init.FR_init.string.inputDate');
            fields.push('FR_fin.FR_fin.string.inputDate');
            fields.push('TiempoEst.TiempoEst.TiempoEst.input');
            fields.push('FK_Cuenta.Cuenta.Cuenta.select.Id');
            fields.push('FK_Servicio.Servicio.Servicio.select.Id');
            break;
        case "ActividadesLog":
            fields.push('Id.Clave.int.input');
            fields.push('Estatus.Estatus.Estatus.input');
            fields.push('FP_init.FP_init.string.inputDate');
            fields.push('FP_fin.FP_fin.string.inputDate');
            fields.push('FR_init.FR_init.string.inputDate');
            fields.push('FR_fin.FR_fin.string.inputDate');
            fields.push('FK_Actividades.Cuenta.Actividades.input');
            fields.push('FK_Proyecto.Clave.Proyecto.input');
            break;

            break;
        case "Servicio":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            break;

        case "Actividades":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            fields.push('Encargado.Encargado.Nombre.input');
            fields.push('FK_Servicio.FK_Servicio.int.select');
            break;

    };


    return fields;
}//Nueva

function getChildEntities(val) { // Listo
    var entity = [];

    switch (val) {
        case "Proyecto":

            //Cuenta
            var entChildEntity = new Entity('Cuenta');
            var fields = [];
            fields.push('Id.Cuenta.Cuenta.select');
            entChildEntity = listFields(fields, entChildEntity);

            var atrMain = new Attribute('Id', "", "Cuenta", 'Id', 'select');
            var atrChild = new Attribute('Id', "", "Cuenta", 'Id', 'select');
            var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
            var joins = [];
            joins.push(selectJoin);

            var join = new JoinEntity(entChildEntity, JoinType.Left, logicalOperator.And, joins);
            entity.push(join);

            //Servicio

            var entChildEntity = new Entity('Servicio');
            var fields = [];
            fields.push('Id.Cuenta.Servicio.select');
            entChildEntity = listFields(fields, entChildEntity);

            var atrMain = new Attribute('Id', "", "Servicio", 'Id', 'select');
            var atrChild = new Attribute('Id', "", "Servicio", 'Id', 'select');
            var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
            var joins = [];
            joins.push(selectJoin);

            var join = new JoinEntity(entChildEntity, JoinType.Left, logicalOperator.And, joins);
            entity.push(join);

            break;

        case "ActividadesLog":

            //Activity
            var entChildEntity = new Entity('Activity');
            var fields = [];
            fields.push('ActivityId.Actividad.Activity.select');
            entChildEntity = listFields(fields, entChildEntity);

            var atrMain = new Attribute('ActivityId', "", "Activity", 'ActivityId', 'select');
            var atrChild = new Attribute('ActivityId', "", "Activity", 'ActivityId', 'select');
            var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
            var joins = [];
            joins.push(selectJoin);

            var join = new JoinEntity(entChildEntity, JoinType.Left, logicalOperator.And, joins);
            entity.push(join);

            break;
        case "Services":

            break;
    };

    return entity;
} //Listo No Borrar

//Funciones Removidas
//Function fillFIeldsCustomer() Listo - Removida -> FillFields()
//Function createOptionsCustomer() Listo - Removida -> CreateOptions()
//Function formEntityCustomerToSave() Listo - Removida -> FormEntityToSave()
//Function formEntityCustomeroToDelete() Listo - Removida -> FormEntityCustomerToDelete()
//Function controlsDisabledCustomer() Listo - Removida -> FormControlsDisabled()
//Function getQueryCustomer() Listo - Removida -> formGetQuery()
