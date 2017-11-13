var COUNTDOWN_STEP = 500;
var COUNTDOWN_DURATION = 3600 * 1.5 * 1000;
var INTERVAL_ID = null;
var NOT_SECRET_ENCRYPTION_KEY = null;
/**
 * Clears the input boxes
 */
function clearInputs() {
    document.getElementById("key-input").value = "";
    document.getElementById("pass-input").value = "";
}
/**
 * Add record to the table
 */
function addRecord() {
    var key = document.getElementById("key-input").value;
    var password = document.getElementById("pass-input").value;
    window.localStorage[key] = sjcl.encrypt(NOT_SECRET_ENCRYPTION_KEY, password);
    clearInputs();
}
/**
 * Delete a record for the local storage
 */
function deleteRecord(e) {
    var key = e.target.getAttribute("key");
    window.localStorage.removeItem(key);
    decrypt(null);
}
/**
 * Decrypt the password.
 */
function decrypt(button) {
    if (button != null) {
        button.classList.remove("btn-danger");
        button.classList.add("btn-primary");
        button.innerHTML = "Clear";
        button.onclick = setup;
    }
    //HTML to add
    var tbl = "<table class='table table-bordered table-striped'><tr><th>Key</th><th>Password</th><th></th></tr>";
    for (var key in window.localStorage) {
        var password = window.localStorage[key];
        try {
            password = sjcl.decrypt(NOT_SECRET_ENCRYPTION_KEY, password);
            if (typeof(password) != "string") {
                password = "error";
            }
        } catch (e) {
            console.log("[ERROR] "+e);
            password = "error";
        }
        tbl += "<tr><td>"+key+"</td><td>"+password+"</td>";
        tbl += "<td><button class='btn btn-danger delete-record' key='"+key+"'>X</button></td></tr>";
    }
    tbl += "</table>";
    var div = document.getElementById("display");
    div.innerHTML = tbl;
    //Attach deletion events
    var deletes = document.getElementsByClassName("delete-record");
    for (var i = 0; i < deletes.length; i++) {
        deletes[i].onclick = deleteRecord;
    }
}
/**
 * Update the button
 */
function update(countdown, button) {
    button.classList.remove("btn-success");
    button.classList.add("btn-danger");
    button.innerHTML = "Decrypting... "+(countdown/1000).toFixed(0);
}
/**
 * Start the decryption counter
 * @param time: current external time
 */
function start(begin) {
    //Ten hours
    var end = begin + COUNTDOWN_DURATION;
    //Setup countdown function
    var closure = function(time) {
        update(end - time, this);
        if (time >= end) {
            decrypt(this);
            clearInterval(INTERVAL_ID);
        }
    };
    INTERVAL_ID = setInterval(get_external_time.bind(null, closure.bind(this), error), COUNTDOWN_STEP);
}
/**
 * An error function to display an error
 */
function error(err) {
    document.getElementById("derror").innerHTML =
        "<em>Error:</em> Internet connection required for externally sourced time";
}
/**
 * A function designed to setup the encrypt button actions
 */
function setup() {
    if (typeof(window.localStorage["NOT_SECRET_ENCRYPTION_KEY"]) == "undefined" ) {
        window.localStorage["NOT_SECRET_ENCRYPTION_KEY"] = new Date().getTime();
    }
    NOT_SECRET_ENCRYPTION_KEY = window.localStorage["NOT_SECRET_ENCRYPTION_KEY"];
    var button = document.getElementById("go-button");
    button.classList.remove("btn-primary");
    button.classList.remove("btn-danger");
    button.classList.add("btn-success");
    button.innerHTML = "Decrypt";
    button.onclick = get_external_time.bind(null, start.bind(button), error);
    var div = document.getElementById("display");
    div.innerHTML = "";
    //Setup add and clear buttons
    var adder = document.getElementById("add-button");
    adder.onclick = addRecord;
    var clearer1 = document.getElementById("clear1-button");
    clearer1.onclick = clearInputs;
    var clearer2 = document.getElementById("clear2-button");
    clearer2.onclick = clearInputs;
}
