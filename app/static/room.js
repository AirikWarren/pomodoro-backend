/**
 * Returns a Unix timestamp, in seconds.
 */
rightNow = () => Math.floor(Date.now() / 1000);

/**
 * Sends a GET request to the /api/room/{Window.title} route, returns
 * a promise that will resolve to JSON.
 * 
 * @returns {Promise}
 */
async function sendGet() {
    let response = await fetch('/api/room/' + String(title, {method : 'get'}));
    let json = await response.json();

    return json
}

sendGetOld = (cb) =>  {
    fetch('/api/room/' + String(title), {method : 'get'})
    .then(response => response.json())
    .then(data => cb(data))
}

sendPost = (t) => 
    fetch('/api/room/' + String(title), {
            method : 'post',
            headers : {
            "Content-Type" : "application/json"
            }, body : t.jsonRepr()}
        ).then(response => response.json())
        .then(data => console.log('the original POST ran: ' + data));

function updateProgressBar(t) {
    let secondsLeft = t.timeLeft();
    if (secondsLeft !== "BEEP") {
        timerElem.setAttribute('value', t.progressMade());
    } else {
        timerElem.setAttribute('value', 0)
    }
}

function updateProgressText(t) {
    let secondsLeft = t.timeLeft();
    let minutesLeft = 0;
    if (secondsLeft !== "BEEP") {
        minutesLeft = Math.floor(secondsLeft / 60);
        secondsLeft = secondsLeft % 60;
        return `${minutesLeft} Minutes ${secondsLeft} Seconds`;
    } else {
        return "TIME IS UP!"
    }
}

function updateRoomHeader(serverResponseObj, roomName) {
    if (typeof(serverResponseObj) === typeof("")){
        return "There isn't an active session at this URL"
    } else {
        return `Room name: ${roomName}`
    }
}

class TimerClass {

    constructor (duration=300, isPlaying=false, startTime=rightNow(), password="password") {
        this.password = password

        if (startTime === null) {
            this.startTime = rightNow() 
        } else {
            this.startTime = startTime;
        }

        this.duration = duration;
        this.isPlaying = isPlaying;


        this.endTime = this.startTime + this.duration;
    }

    start() {
        this.isPlaying = true;
        this.startTime = rightNow();
        this.endTime = this.startTime + this.duration;
    }
    
    stop (){
        this.isPlaying = false;
        this.duration = this.endTime - rightNow()
        this.startTime = null;
    }

    timeLeft () {
        let currentTime = rightNow();
        if (currentTime < this.endTime) {
            return this.endTime - currentTime
        } else {
            this.isPlaying = false;
            return "BEEP" }
    }

    progressMade () {
        if (rightNow() < this.endTime) {
            return Math.floor((this.timeLeft() / this.duration) * 100);
        } else {
            this.isPlaying = false;
            return 0;
        }
    }

    objRepr () {
        this.timeLeft()
        return {
            "start_time" : this.startTime,
            "password" : this.password,
            "duration" : this.duration,
            "is_playing" : this.isPlaying
        }
    }

    jsonRepr () {
        return JSON.stringify({
            "start_time" : this.startTime,
            "password" : this.password,
            "duration" : this.duration,
            "is_playing" : this.isPlaying
        });
    }
}

