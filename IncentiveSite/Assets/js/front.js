

$(document).ready(function () {
    var bind = true

    $('#sidenav').hover(function () {
        if (bind) {
            $('#content').addClass("move-left");

        }
        else $('#content').removeClass("move-left");
        bind = !bind;
    });
});

var modal = document.getElementById('id01');
//onclick = "document.getElementById('id01').style.display = 'none'"

$(document).ready(function () {

    var x, i, j, selElmnt, a, b, c;

    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /*for each element, create a new DIV that will contain the option list:*/
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < selElmnt.length; j++) {
            /*for each option in the original select element,
            create a new DIV that will act as an option item:*/
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                var y, i, k, s, h;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                h = this.parentNode.previousSibling;
                for (i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }

        x[i].appendChild(b);


        a.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");

            var k = e.isTrusted;
            if (!k) {
                var whereFilter = this.innerHTML;
                boolTest = true;
                getListEntityMain(ActiveList, 'table', 'Yes', whereFilter);
            };
        });
    }

});

function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
    /*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);
}

function changeModule(module, secundary = "") {
    var i;
    var x = document.getElementsByClassName("module");

    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }

    if (module.localeCompare('Proyecto') != 0) {
        var y = document.getElementById('gantt');
        y.style.display = "none";
    }
    else {
        var y = document.getElementById('gantt');
        y.style.display = "block";

    }
    document.getElementById(module).style.display = "block";
    ActiveList = module;
    
    boolTest = true;
    getListEntityMain(module, "table", 'Yes');
    try {
        if (secundary != '') {
            SecundaryList = secundary.split('/');
        }
        else {
            SecundaryList = [];
        }
        if (SecundaryList.length > 0) {
            var k = 0;
            for (k = 0; k < SecundaryList.length; k++) {

                getListEntityMain(SecundaryList[k], "table" + (k + 1).toString(), 'No');
                document.getElementById('SecundaryTag').innerHTML = SecundaryList[k];
                document.getElementById('SecundaryTag').style.display = 'block';
                document.getElementById('table1').style.display = 'block';
            }

        }
        else {

            document.getElementById('SecundaryTag').innerHTML = '';
            document.getElementById('SecundaryTag').style.display = 'none';
            document.getElementById('table1').style.display = 'none';
        }
    }
    catch(e){

    }
}

format = function date2str(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}


var boolTest = true;