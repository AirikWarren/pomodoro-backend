const title = window.document.title;
const timerElem = window.document.getElementById("progressBar");
let timerText = window.document.getElementById("progressText");
let roomText = window.document.getElementById("roomHeader");

async function main() {
    setInterval(update_everything, 1000)
}

function update_everything () {
    sendGet().then(
        response => {
            t = check_for_active_session(response);
            updateProgressBar(t);
            timerText.innerText = updateProgressText(t);
            roomText.innerText = updateRoomHeader(response, title)
        }
    )
}

function check_for_active_session(serverResponseObj) {
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