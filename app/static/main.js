const title = window.document.title;
const timerElem = window.document.getElementById("progressBar");
let timerText = window.document.getElementById("progressText");
let roomText = window.document.getElementById("roomHeader");

async function main() {
    setInterval(updateEverything, 1000)
}

function updateEverything () {
    sendGet().then(
        response => {
            t = checkForActiveSession(response);
            updateProgressBar(t);
            timerText.innerText = updateProgressText(t);
            roomText.innerText = updateRoomHeader(response, title)
        }
    )
}

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