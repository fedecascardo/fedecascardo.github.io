//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction ||
    window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
    window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const employeeData = [
    { id: "00-01", name: "gopal", age: 35, email: "gopal@tutorialspoint.com" },
    { id: "00-02", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" }
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
    var objectStore = db.createObjectStore("employee", { keyPath: "id" });

    for (var i in employeeData) {
        objectStore.add(employeeData[i]);
    }
}

function readAll() {
    var objectStore = db.transaction("employee").objectStore("employee");
    let nombres = "Read all:"
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            //alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
            nombres = nombres + '<span class="mdl-chip mdl-chip--contact"><span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">' + cursor.value.name.charAt(0).toUpperCase() + '</span><span class="mdl-chip__text">' + cursor.value.name + '</span></span>'
            cursor.continue();
        } else {
            //alert("No more entries!");
            document.getElementById("resultadosbusq").innerHTML = nombres;
        }
    };

}

function cargarCombo() {
    var objectStore = db.transaction("employee").objectStore("employee");
    var select = document.getElementById("claves")
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            //alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
            option = document.createElement('option');
            option.setAttribute('value', cursor.key);
            option.appendChild(document.createTextNode(cursor.key));
            select.appendChild(option);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    };

}

function search() {
    var objectStore = db.transaction("employee").objectStore("employee");
    var nomu = document.getElementById("nombrebus").value;
    let nombres = "Search: "
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            //alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
            if (cursor.value.name.toLowerCase().includes(nomu.toLowerCase())) {
                //nombres = nombres + "-" + cursor.value.name
                nombres = nombres + '<span class="mdl-chip"><span class="mdl-chip__text">' + cursor.value.name + '</span></span>'
            }

            cursor.continue();
        } else {
            //alert("No more entries!");
            document.getElementById("resultadosbusq").innerHTML = nombres;
        }
    };
}

function add() {
    var idu = document.getElementById("idUser").value;
    var nomu = document.getElementById("nombreUser").value;
    var edadu = document.getElementById("edadUser").value;
    var emailu = document.getElementById("emailUser").value;
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({ id: idu, name: nomu, age: edadu, email: emailu });

    request.onsuccess = function (event) {
        alert(nomu + " has been added to your database.");
    };
    request.onerror = function (event) {
        alert("Unable to add data\r\n" + nomu + " is aready exist in your database! ");
    }
}

function edit() {
    var clave = document.getElementById("claveEditar").value;
    console.log(clave)
    var transaction = db.transaction(["employee"]);
    var objectStore = transaction.objectStore("employee");
    var request = objectStore.get(clave);
    request.onerror = function (event) {
        alert("Unable to retrieve data from database!");
    };
    request.onsuccess = function (event) {
        // Do something with the request.result!
        console.log("Va bien entro al success")
        var user = event.target.result;
        console.log(user)
        if (user !== undefined) {
            document.getElementById("idUser").value = user.id;
            document.getElementById("idUser").readOnly = true;
            document.getElementById("nombreUser").value = user.name;
            document.getElementById("edadUser").value = user.age;
            document.getElementById("emailUser").value = user.email;
            document.getElementById("btnUpdate").style.visibility = "visible";
            document.getElementById("btnCancelUpdate").style.visibility = "visible";
            document.getElementById("btnAgregar").style.visibility = "hidden";
            // show relevant buttons
        }
    };
}

function update() {
    var transaction = db.transaction(["employee"], "readwrite");
    var objectStore = transaction.objectStore("employee");
    var clave = document.getElementById("idUser").value;
    var request = objectStore.get(clave);
    alert(clave)
    request.onerror = function (event) {
        alert("Unable to retrieve data from database!");
    };
    request.onsuccess = function (event) {
        // Do something with the request.result!
        user = event.target.result;
        var nomu = document.getElementById("nombreUser").value;
        var edadu = document.getElementById("edadUser").value;
        var emailu = document.getElementById("emailUser").value;

        user.name = nomu;
        user.age = edadu;
        user.email = emailu;

        var putRequest = objectStore.put(user)
        putRequest.onsuccess = function (e) {
            console.log("actualziado")
        }
    };
    var user;
    var idu = document.getElementById("idUser").value;
}

function cancelUpdate() {
    document.getElementById("idUser").value = "";
    document.getElementById("nombreUser").value = "";
    document.getElementById("edadUser").value = "";
    document.getElementById("emailUser").value = "";
    document.getElementById("btnUpdate").style.visibility = "hidden";
    document.getElementById("btnAgregar").style.visibility = "visible";
    document.getElementById("btnCancelUpdate").style.visibility = "hidden";
}

function remove() {
    var clave = document.getElementById("claveeliminar").value;
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete(clave);

    request.onsuccess = function (event) {
        alert(clave + " entry has been removed from your database.");
    };
}

function start(){
registrarServiceWorker();
}

function registrarServiceWorker(){
    if('serviceWorker' in navigator){
        window.addEventListener('load',()=>{
            this.navigator.serviceWorker.register('/sw.js').then(reg=>{
                console.log('sw registrado');
            }).catch(err=>{
                console.error("SW fallo");
            })
        
        })
    }

}

window.addEventListener('DOMContentLoaded',start)