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

sendPost = (t) => 
    fetch('/api/room/' + String(title), {
            method : 'post',
            headers : {
            "Content-Type" : "application/json"
            }, body : t.jsonRepr()}
        ).then(response => response.json())
        .then(data => console.log('the original POST ran: ' + data));

function playSound(url, audioConfig) {
    timesPlayed = audioConfig.dingsPlayedSinceReset;
    max = audioConfig.maxNotificationDings;
    const audio = new Audio(url);
    if (timesPlayed < max) {
        audioConfig.dingsPlayedSinceReset++ 
        audio.play();
    } 
}

function updateProgressBar(t) {
    let secondsLeft = t.timeLeft();
    if (secondsLeft !== "BEEP") {
        timerElem.setAttribute('value', t.progressMade());
    } else {
        timerElem.setAttribute('value', 0)
    }
}

function updateProgressText(t, config) {
    let secondsLeft = t.timeLeft();
    let minutesLeft = 0;
    if (secondsLeft !== "BEEP") {
        minutesLeft = Math.floor(secondsLeft / 60);
        secondsLeft = secondsLeft % 60;
        if (secondsLeft >= 10) 
            return `${minutesLeft}:${secondsLeft}`;
        else
            return `${minutesLeft}:0${secondsLeft}`;
    } else {
        if (config.flags.isSessionActive) {
            playSound(document.location.origin + '/static/alarm.wav', config.audio)
            return "TIME IS UP"
        } else {
            return "Consider starting a session or checking to make sure the URL was entered properly"
        }
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

    /**
     * 
     * @param {Number} duration 
     * duration Timer should run for, in seconds
     * @param {Boolean} isPlaying 
     * Whether or not to instantiate the timer with a boolean used to indicate
     * whether or not the Timer is playing 
     * @param {Number} startTime 
     * Unix time stamp, seconds
     * @param {String} password 
     * plaintext password, the server-side equivalent of this object stores this hashed
     */
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

    /**
     * Returns how many seconds are left until the Timer is finished if the 
     * timer hasn't already finished. Otherwise returns a string literal "BEEP"
     */
    timeLeft () {
        let currentTime = rightNow();
        if (currentTime < this.endTime) {
            return this.endTime - currentTime
        } else {
            this.isPlaying = false;
            return "BEEP" }
    }

    /**
     *  Returns an integer representation the Timer instance's
     *  progress, expressed as a percentage.
     * 
     * e.g. Running this method on A 500 second timer with 250 seconds left
     * returns 250
     *   
     */
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

