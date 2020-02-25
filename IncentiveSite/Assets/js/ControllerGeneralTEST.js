function getFields(val) { //Listo
    //El valor de Id del registro siempre se tiene que poner primero
    var fields = [];

    switch (val) {
        case "Proyecto":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.select');
            fields.push('FP_init.F_Planeada_Inicio.string.inputDate');
            fields.push('FP_fin.F_Planeada_Fin.string.inputDate');
            fields.push('FR_init.F_Real_Inicio.string.inputDate');
            fields.push('FR_fin.F_Real_Fin.string.inputDate');
            fields.push('TiempoEst.TiempoEst.TiempoEst.input');
            break;
        case "ActividadesLog":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.select');
            fields.push('FK_Proyecto.Proyecto.Proyecto.select.Id.Nombre');
            fields.push('Estatus.Estatus.Estatus.input');
            fields.push('FP_init.F_Planeada_Inicio.string.inputDate');
            fields.push('FP_fin.F_Planeada_Fin.string.inputDate');
            fields.push('FR_init.F_Real_Inicio.string.inputDate');
            fields.push('FR_fin.F_Real_Fin.string.inputDate');
            break;
        case "Servicios":
            fields.push('Id.Clave.int.input');
            fields.push('Tipo.Tipo.Tipo.input');
            fields.push('Descripcion.Descripcion.Descripcion.input');
            break;

        case "Actividades":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            fields.push('Duracion.Duracion.Duracion.input');
            fields.push('FK_Servicio.Servicio.Servicios.select.Id.Tipo');
            break;

        case "Cuenta":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            break;

        case "Vendedor":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            break;

        case "Transacciones":
            fields.push('Id.Clave.int.input');
            fields.push('F_Cap.F_Captura.string.inputDate');
            fields.push('F_Reg.F_Registro.string.inputDate');
            break;

        case "Trans_Act":
            fields.push('FK_Transacciones.Id_Transacción.int.input');
            fields.push('FK_Actividades.Actividades.Actividades.select.Id.Nombre');
            fields.push('F_init.F_Inicio.string.inputDate');
            fields.push('F_fin.F_fin.string.inputDate');
            fields.push('FK_Vendedor.Vendedor.Vendedor.select.Id.Nombre');
            break;

    };


    return fields;
} //Listo No Borrar

function getFieldsWithChilds(val) { //Nueva Listo
    var fields = [];

    switch (val) {
        case "Proyecto":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.select');
            fields.push('FK_Cuenta.Cuenta.Cuenta.select.Id.Nombre');
            fields.push('FK_Servicio.Servicio.Servicios.select.Id.Tipo');
            fields.push('FP_init.F_Planeada_Inicio.string.inputDate');
            fields.push('FP_fin.F_Planeada_Fin.string.inputDate');
            fields.push('FR_init.F_Real_Inicio.string.inputDate');
            fields.push('FR_fin.F_Real_Fin.string.inputDate');
            fields.push('TiempoEst.TiempoEst.TiempoEst.input');
            fields.push('FK_Vendedor.Vendedor.Vendedor.select.Id.Nombre');
            break;
        case "ActividadesLog":
            fields.push('Id.Clave.int.input');
            fields.push('Estatus.Estatus.Estatus.input');
            fields.push('FP_init.F_Planeada_Inicio.string.inputDate');
            fields.push('FP_fin.F_Planeada_Fin.string.inputDate');
            fields.push('FR_init.F_Real_Inicio.string.inputDate');
            fields.push('FR_fin.F_Real_Fin.string.inputDate');
            fields.push('FK_Actividades.Cuenta.Actividades.select.Id.Nombre');
            fields.push('FK_Proyecto.Clave.Proyecto.select.Id.Nombre');
            fields.push('FK_Vendedor.Vendedor.Vendedor.select.Id.Nombre');
            break;

        case "Servicios":
            fields.push('Id.Clave.int.input');
            fields.push('Tipo.Tipo.Tipo.input');
            fields.push('Descripcion.Descripcion.Descripcion.input');
            break;

        case "Actividades":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            fields.push('Duracion.Duracion.Duracion.input');
            fields.push('FK_Servicio.Servicio.Servicios.select.Id.Tipo');
            break;

        case "Cuenta":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            break;

        case "Vendedor":
            fields.push('Id.Clave.int.input');
            fields.push('Nombre.Nombre.Nombre.input');
            break;

        case "Transacciones":
            fields.push('Id.Clave.int.input');
            fields.push('F_Cap.F_Captura.string.inputDate');
            //fields.push('F_Reg.F_Registro.string.inputDate');
            fields.push('FK_Proyecto.Id_Proyecto.Proyecto.select.Id.Nombre');
            break;

        case "Trans_Act":
            fields.push('FK_Transacciones.Id_Transacción.int.input');
            fields.push('FK_Actividades.Actividad.Actividades.select.Id.Nombre');
            fields.push('F_init.F_Inicio.string.inputDate');
            fields.push('F_fin.F_fin.string.inputDate');
            fields.push('FK_Vendedor.Vendedor.Vendedor.select.Id.Nombre');
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
        case "Transacciones":

            //Transacciones
            var entChildEntity = new Entity('Proyecto');
            var fields = [];
            fields.push('Id.IdProyecto.Proyecto.select');
            entChildEntity = listFields(fields, entChildEntity);

            var atrMain = new Attribute('Id', "", "Proyecto", 'Id', 'select');
            var atrChild = new Attribute('Id', "", "Proyecto", 'Id', 'select');
            var selectJoin = new selectJoinEntity(logicalOperator.And, atrMain, atrChild);
            var joins = [];
            joins.push(selectJoin);

            var join = new JoinEntity(entChildEntity, JoinType.Left, logicalOperator.And, joins);
            entity.push(join);

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
