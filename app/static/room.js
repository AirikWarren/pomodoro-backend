const title = window.document.title;
const timerElem = window.document.getElementById("progressBar");
let timerText = window.document.getElementById("progressText");;

rightNow = () => Math.floor(Date.now() / 1000); // Unix timestamp, in seconds

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

t = new TimerClass(100, false, rightNow(), "bruhpass");

sendPost = () => 
    fetch('/api/room/' + String(title), {
            method : 'post',
            headers : {
            "Content-Type" : "application/json"
            },
            body : t.jsonRepr()})
            .then(response => response.json())
            .then(data => console.log('the original POST ran: ' + data));

let obj;

sendGet = () =>  {
    fetch('/api/room/' + String(title), {method : 'get'})
    .then(response => response.json())
    .then(data => obj = data)
}

g = sendGet
p = sendPost

t.start()

setInterval(
    (
        () => {
            updateProgressBar(t);
            timerText.innerText = updateProgressText(t);
            console.log(window.document.URL)
        }
    ), 1000)