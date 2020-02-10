function login() {
    var email = $("#email").val();
    var password = $("#password").val();
    var encrypted = CryptoJS.MD5(password);
    var wordEncrypted = (encrypted.toString());


    if (email == undefined || email == '') {
        $("#errorMessage").text('El Correo es obligatorio.');
        $("#errorMessage").show();

        return false;
    }

    else if (password == undefined || password == '') {
        $("#errorMessage").text('La Contraseña es obligatoria.');
        $("#errorMessage").show();
        return false;
    }
    else {
        var entity = getQueryLogin(email, wordEncrypted);

        //wsGetIsAuthenticated(entity, function (val) {
        //    if (val != undefined && val.length > 0) {
              
        //        Redirect('CustomerList.aspx');
        //    }
        //    else {
        //        $("#errorMessage").text('Datos incorrectos.');
        //        $("#errorMessage").show();
        //    }
        //});
    }

}

function getQueryLogin(email, psw) {

    var entity = new Entity('SystemUser');
    var fields = [];
    fields.push('UserId');
    listFields(fields, entity);

    var atrEmail = new Attribute('Email', email, "string");
    entity.Attributes.push(atrEmail);
    var atrPsw = new Attribute('Password', psw, "string");
    entity.Attributes.push(atrPsw);

    var lwhere = [];
    var where = new Where(atrEmail, whereOperator.Equal);
    lwhere.push(where);
    var where = new Where(atrPsw, whereOperator.Equal);
    lwhere.push(where);

    var lGroupWhere = [];
    var groupWhere = new GroupWhere(logicalOperator.And, lwhere, logicalOperator.And);

    lGroupWhere.push(groupWhere);
    entity.GroupWheres = lGroupWhere;

    return entity;
}
function wsGetIsAuthenticated(entity, callback) {

    $.ajax({
        type: "POST",
        url: 'ControllerWebMethod.asmx/GetIsAuthenticated',
        data: "{'DataEntity':" + JSON.stringify(entity) + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (result) {
            var objdata = $.parseJSON(result.d);
            callback(objdata);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var error = eval("(" + XMLHttpRequest.responseText + ")");
            console.log(error.Message);


        }
    });
}