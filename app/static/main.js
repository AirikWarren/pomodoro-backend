let title = window.document.title;
const timerElem = window.document.getElementById("progressBar");
let timerText = window.document.getElementById("progressText");
let roomText = window.document.getElementById("roomHeader");

const DEFAULT_BREAK_LEN = (5 * 60)
const DEFAULT_WORK_LEN = (25 * 60)

pageConfig = {
    flags : { isAutoplay : false, isSessionActive : false },
    audio : { maxNotificationDings : 10, dingsPlayedSinceReset : 0 },
    timer : { lengthOfBreak : DEFAULT_BREAK_LEN, lengthOfWorkCycle : DEFAULT_WORK_LEN},
    modeSequence : ['work', 'break', 'longBreak']
}

function main() {
    let u = window.document.URL;
    title = u.slice(u.lastIndexOf('/')+1);
    setInterval(updateEverything, 1000);
}

breakButton = async () => {
    t = new TimerClass(pageConfig.timer.lengthOfBreak, true, rightNow(), "password"); 
    pageConfig.audio.dingsPlayedSinceReset = 0;
    sendPost(t);
}

workButton = async () => {
    t = new TimerClass(pageConfig.timer.lengthOfWorkCycle, true, rightNow(), "password");
    pageConfig.audio.dingsPlayedSinceReset = 0;
    sendPost(t);
}

function updateEverything () {
    sendGet().then(
        response => {
            t = checkForActiveSession(response, pageConfig);
            updateProgressBar(t);
            window.document.title = updateProgressText(t, pageConfig);
            roomText.innerText = updateRoomHeader(response, title);
            timerText.innerText = updateProgressText(t, pageConfig);
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
function checkForActiveSession(serverResponseObj, config) {
    if (typeof(serverResponseObj) === typeof("")) {
        config.flags.isSessionActive = false;
        return new TimerClass(0, false, rightNow(), "password")
    } else if (typeof(serverResponseObj) === typeof({'foo':'bar'})){
        config.flags.isSessionActive = true;
        return new TimerClass(serverResponseObj.duration,
                              serverResponseObj.is_playing,
                              serverResponseObj.start_time)
    } else {
        console.log(serverResponseObj)
    }
}
