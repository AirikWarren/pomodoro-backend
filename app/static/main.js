const title = window.document.title;
const timerElem = window.document.getElementById("progressBar");
let timerText = window.document.getElementById("progressText");
let roomText = window.document.getElementById("roomHeader");

function main() {
    let serverResponseObj;
    sendGet();
    t = check_for_active_session(serverResponseObj) 
    setInterval(
        (
            () => {
                updateProgressBar(t);
                timerText.innerText = updateProgressText(t);
                roomText.innerText = updateRoomHeader(obj, title)
            }
        ), 1000)
    // YES? 
        // then display it
    // NO?
        // update the HTMl to reflect this, suggest the user create one 
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