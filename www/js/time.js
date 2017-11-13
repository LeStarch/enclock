var TIME_URL = "http://tycho.usno.navy.mil/cgi-bin/timer.pl";
var TIME_RE = new RegExp("<BR>(.*)Universal Time");

/**
 * Parse time from an unmodifiable source
 * @param success: sucess function to call
 * @param error: error function to call
 */
function parse_external_time(text, success) {
    var time = TIME_RE.exec(text);
    if (time != null) {
        time = new Date(time[1].trim()).getTime();
        success(time);
    }
}
/**
 * Get time from an unmodifiable source
 * @param success: sucess function to call
 * @param error: error function to call
 */
function get_external_time(success, error) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            parse_external_time(this.response, success);
        } else if (this.readyState == 4) {
            error(this.response);
        }
    };
    xhttp.open("GET", TIME_URL, true);
    xhttp.send();
}
