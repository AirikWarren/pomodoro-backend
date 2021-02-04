let title = window.document.title;
const timerElem = window.document.getElementById("progressBar");
let timerText = window.document.getElementById("progressText");
let roomText = window.document.getElementById("roomHeader");

function main() {
    let u = window.document.URL;
    title = u.slice(u.lastIndexOf('/')+1);
    setInterval(updateEverything, 1000);
}

breakButton = async () => {
    t = new TimerClass(); 
    sendPost(t);
}

workButton = async () => {
    t = new TimerClass(1500, true, rightNow(), "password");
    sendPost(t);
}

function updateEverything () {
    sendGet().then(
        response => {
            t = checkForActiveSession(response);
            updateProgressBar(t);
            window.document.title = updateProgressText(t);
            timerText.innerText = updateProgressText(t);
            roomText.innerText = updateRoomHeader(response, title);
        }
    )
}

/**
 * Intended to be used with a function that retrieves JSON from the server.
 * 
 * Will return a TimerClass object if the Promise was fulfilled. 
 *
 * TimerClass object will be constructed with the parameters laid out in the
 * JSON if possible, otherwise it will construct the object with default values. 
 * 
 * @param {String | Object} serverResponseObj
 * 
 * @returns {TimerClass}
 */
function checkForActiveSession(serverResponseObj) {
    if (typeof(serverResponseObj) === typeof("")) {
        return new TimerClass(0, false, rightNow(), "password")
    } else if (typeof(serverResponseObj) === typeof({'foo':'bar'})){
        return new TimerClass(serverResponseObj.duration,
                              serverResponseObj.is_playing,
                              serverResponseObj.start_time)
    } else {
        console.log(serverResponseObj)
    }
}