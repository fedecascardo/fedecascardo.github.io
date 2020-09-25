//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction ||
    window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
    window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Su Navegador no soporta la base de datos utilizada por el sistema.")
}

const dataLotes = [
    { id: "VA1231A", campo: "Campo123", superficie: 35, hibrido: "Hibrido1" },
    { id: "VA1231B", campo: "Campo123", superficie: 32, hibrido: "Hibrido2" },
    { id: "VA1231C", campo: "Campo123", superficie: 38, hibrido: "Hibrido3" },
    { id: "VA1231D", campo: "Campo123", superficie: 47, hibrido: "Hibrido1" },
    { id: "VA0776B", campo: "Campo123", superficie: 56, hibrido: "Hibrido1" },
    { id: "VA0776C", campo: "Campo123", superficie: 86, hibrido: "Hibrido2" },
    { id: "VA0776D", campo: "Campo123", superficie: 43, hibrido: "Hibrido3" },
    { id: "VA0776E", campo: "Campo123", superficie: 24, hibrido: "Hibrido4" },
    { id: "VB066C7", campo: "El Sesenta", superficie: 37.5, hibrido: "Hibrido8" },
    { id: "VB066C8", campo: "El Sesenta", superficie: 24.5, hibrido: "Hibrido8" },
    { id: "VB066C9", campo: "El Sesenta", superficie: 62.9, hibrido: "Hibrido9" },
    { id: "VB011C7", campo: "El Once", superficie: 40.5, hibrido: "Hibrido6" },
    { id: "VB011C8", campo: "El Once", superficie: 87.5, hibrido: "Hibrido6" },
    { id: "VB011C9", campo: "El Once", superficie: 60.9, hibrido: "Hibrido6" }
];
var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
};

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("tablaLotes", { keyPath: "id" });
    for (var i in dataLotes) {
        objectStore.add(dataLotes[i]);
    }

    var objectStoreLoteActual = db.createObjectStore("loteActual", { keyPath: "identificador" });
    objectStoreLoteActual.add({ identificador: 1, id: "", campo: "", superficie: 0, hibrido: "" });
}

function cargarCombo() {
    var objectStore = db.transaction("tablaLotes").objectStore("tablaLotes");
    var select = document.getElementById("claves")
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            //alert("campo for id " + cursor.key + " is " + cursor.value.campo + ", superficie: " + cursor.value.superficie + ", hibrido: " + cursor.value.hibrido);
            option = document.createElement('option');
            option.setAttribute('value', cursor.key);
            option.appendChild(document.createTextNode(cursor.key));
            select.appendChild(option);
            cursor.continue();
        } else {
            //alert("No more entries!");
        }
    };

}

function search() {
    var objectStore = db.transaction("tablaLotes").objectStore("tablaLotes");
    var nomu = document.getElementById("nombrebus").value;
    let infoLotes = ""
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            //alert("campo for id " + cursor.key + " is " + cursor.value.campo + ", superficie: " + cursor.value.superficie + ", hibrido: " + cursor.value.hibrido);
            if (cursor.value.campo.toLowerCase().includes(nomu.toLowerCase())) {
                //alert("campo for id " + cursor.key + " is " + cursor.value.campo + ", superficie: " + cursor.value.superficie + ", hibrido: " + cursor.value.hibrido);
                //infoLotes = infoLotes + '<span class="mdl-chip mdl-chip--contact"><span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">' + cursor.value.campo.charAt(0).toUpperCase() + '</span><span class="mdl-chip__text">' + cursor.value.campo + '</span></span>'
                //`+ cursor.value.id + `
                infoLotes = infoLotes + `<tr>
                <th class="mdl-data-table__cell--non-numeric">`+ cursor.value.id + `</th>
                <th>`+ cursor.value.campo + `</th>
                <th>`+ cursor.value.superficie + `</th>
                <th>`+ cursor.value.hibrido + `</th>
                <th> <a class="mdl-list__item-secondary-action" onclick="javascript:seleccionar('`+ cursor.value.id + `')"><i class="material-icons">open_in_browser</i></a></th>
              </tr>`
                cursor.continue();
            }

            else {
                cursor.continue();
            }


        } else {
            //alert("No more entries!");
            document.getElementById("resultadosbusq").innerHTML = infoLotes;
            document.getElementById("nombrebus").value = "";
        }
    };
}

function add() {
    var idu = document.getElementById("idLote").value;
    var nomu = document.getElementById("nombreCampo").value;
    var edadu = document.getElementById("superficieLote").value;
    var hibridou = document.getElementById("hibridoLote").value;
    alert(idu)
    var request = db.transaction(["tablaLotes"], "readwrite")
        .objectStore("tablaLotes")
        .add({ id: idu, campo: nomu, superficie: edadu, hibrido: hibridou });

    request.onsuccess = function (event) {
        alert(idu + " fue agregado a la base.");
    };
    request.onerror = function (event) {
        alert("No se pudo agregar \r\n" + idu + " ya existe en la base de datos! ");
    }
}

function cambiaSolapa(solapa) {
    console.log("Cambio a solapa" + solapa)
    var transaction = db.transaction(["loteActual"]);
    var objectStore = transaction.objectStore("loteActual");
    var request = objectStore.get(1);
    request.onerror = function (event) {
        alert("No se pudo leer la base de datos!");
    };
    request.onsuccess = function (event) {
        console.log("seleccionado")
        console.log(event.target.result);

        if(event.target.result.campo.toLowerCase()==""){
            console.log("Lote vacío");
        }
        else
        {
            console.log("lote" + event.target.result.id.toLowerCase());
        }

    };

}

function seleccionar(clave) {
    console.log("Seleccionada" + clave)
    var transaction = db.transaction(["tablaLotes"]);
    var objectStore = transaction.objectStore("tablaLotes");
    var request = objectStore.get(clave);
    request.onerror = function (event) {
        alert("No se pudo leer la base de datos!");
    };
    request.onsuccess = function (event) {
        // Do something with the request.result!
        //console.log("Va bien entro al success")
        var elemento = event.target.result;
        console.log("seleccionado" + elemento)
        if (elemento !== undefined) {
            var transaction2 = db.transaction(["loteActual"], "readwrite");
            var objectStoreLoteActual = transaction2.objectStore("loteActual");
            var request2 = objectStoreLoteActual.get(1);

            request2.onerror = function (event) {
                alert("No se pudo leer la base de datos!");
            };
            request2.onsuccess = function (event) {
                // Do something with the request.result!
                lote = event.target.result;
                lote.id = elemento.id;
                lote.campo = elemento.campo;
                lote.superficie = elemento.superficie;
                lote.hibrido = elemento.hibrido;
                //console.log(event)
                //console.log(lote)

                var putRequest = objectStoreLoteActual.put(lote)
                putRequest.onsuccess = function (e) {
                    console.log("Actualizado el actual")
                    document.getElementById("idLoteCabecera").innerHTML = lote.id + "-" + lote.campo + "-" + lote.hibrido;
                    document.getElementById("idLoteCabeceraSiembra").innerHTML = lote.id + "-" + lote.campo + "-" + lote.hibrido;
                }
            };



        }
    };
}

function update() {
    var transaction = db.transaction(["tablaLotes"], "readwrite");
    var objectStore = transaction.objectStore("tablaLotes");
    var clave = document.getElementById("idLote").value;
    var request = objectStore.get(clave);
    alert(clave)
    request.onerror = function (event) {
        alert("No se pudo leer la base de datos!");
    };
    request.onsuccess = function (event) {
        // Do something with the request.result!
        elemento = event.target.result;
        var nomu = document.getElementById("nombreCampo").value;
        var edadu = document.getElementById("superficieLote").value;
        var hibridou = document.getElementById("hibridoLote").value;

        elemento.campo = nomu;
        elemento.superficie = edadu;
        elemento.hibrido = hibridou;

        var putRequest = objectStore.put(elemento)
        putRequest.onsuccess = function (e) {
            console.log("Actualziado")
        }
    };
    var elemento;
    var idu = document.getElementById("idLote").value;
}

function cancelUpdate() {
    document.getElementById("idLote").value = "";
    document.getElementById("nombreCampo").value = "";
    document.getElementById("superficieLote").value = "";
    document.getElementById("hibridoLote").value = "";
    document.getElementById("btnUpdate").style.visibility = "hidden";
    document.getElementById("btnAgregar").style.visibility = "visible";
    document.getElementById("btnCancelUpdate").style.visibility = "hidden";
}

function remove() {
    var clave = document.getElementById("claveeliminar").value;
    var request = db.transaction(["tablaLotes"], "readwrite")
        .objectStore("tablaLotes")
        .delete(clave);

    request.onsuccess = function (event) {
        alert(clave + " se eliminó de la base de datos.");
    };
}

function removeClave(c) {
    var request = db.transaction(["tablaLotes"], "readwrite")
        .objectStore("tablaLotes")
        .delete(c);

    request.onsuccess = function (event) {
        alert(c + " se eliminó de la base de datos.");
    };
}

function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            this.navigator.serviceWorker.register('/sw.js').then(reg => {
                console.log('SW registrado');
            }).catch(err => {
                console.error("Ha ocurrido un error al registrar el Service Worker");
            })

        })
    }

}

document.addEventListener('readystatechange', event => { 
  
    if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
        //alert("hi 1");
    }

    // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
    if (event.target.readyState === "complete") {
        //alert("hi 2");
        search();
        registrarServiceWorker();
    }
});