var COUNTDOWN_STEP = 500;
var COUNTDOWN_DURATION = 43200000;
var INTERVAL_ID = null;
var NOT_SECRET_ENCRYPTION_KEY = "FILL-ME";
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
    decrypt();
}
/**
 * Decrypt the password.
 */
function decrypt() {
    var button = document.getElementById("go-button");
    button.classList.remove("btn-danger");
    button.classList.add("btn-primary");
    button.innerHTML = "Clear";
    button.onclick = setup;
    //HTML to add
    var tbl = "<table class='table table-bordered table-striped'><tr><th>Key</th><th>Password</th><th></th></tr>";
    for (var key in window.localStorage) {
        var password = window.localStorage[key];
        try {
            password = sjcl.decrypt(NOT_SECRET_ENCRYPTION_KEY, password);
        } catch (e) {
            console.log("[ERROR] "+e);
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
function update(countdown) {
    var button = document.getElementById("go-button");
    button.classList.remove("btn-success");
    button.classList.add("btn-danger");
    button.innerHTML = "Decrypting... "+(countdown/1000).toFixed(2);
}
/**
 * Start the decryption counter
 */
function start() {
    //Ten hours
    var countdown = COUNTDOWN_DURATION;
    //Setup countdown function
    var closure = function() {
        countdown = countdown - COUNTDOWN_STEP;
        update(countdown);
        if (countdown <= 0) {
            decrypt();
            clearInterval(INTERVAL_ID);
        }
    };
    INTERVAL_ID = setInterval(closure, COUNTDOWN_STEP);
}
/**
 * A function designed to setup the encrypt button actions
 */
function setup() {
    var button = document.getElementById("go-button");
    button.classList.remove("btn-primary");
    button.classList.remove("btn-danger");
    button.classList.add("btn-success");
    button.innerHTML = "Decrypt";
    button.onclick = start;
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
