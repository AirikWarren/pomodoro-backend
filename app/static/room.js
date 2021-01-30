title = window.document.title
message = window.document.getElementById("test")

rightNow = () => Math.floor(Date.now() / 1000) // Unix timestamp, in seconds

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        this.is_playing = false;
        this.duration = this.endTime - rightNow()
        this.startTime = null;
    }

    timeLeft () {
        currentTime = rightNow();
        if (currentTime < this.endTime) {
            return this.endTime - currentTime
        } else {
            return "BEEP" }
    }

    progressMade () {
        if (rightNow() < this.endTime) {
            return Math.floor((this.timeLeft() / this.duration) * 100);
        } else {
            return 0;
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

f = fetch('/api/room/' + String(title), {method : 'get'})
    .then(response => response.json())
    .then(data => message.innerText=data);

t = new TimerClass(30, false, rightNow(), "bruhpass");

fs = fetch('/api/room/' + String(title), {
            method : 'post',
            headers : {
            "Content-Type" : "application/json"
            },
            body : t.jsonRepr()})
            .then(response => response.json())
            .then(data => console.log('the original POST ran: ' + data));

function ensure_client_timer_is_up_to_date(timer_obj) {
    return fetch('/api/room/' + String(title), {method : 'get'})
        .then(response => response.json())
        .then(data => console.log(typeof(data)));
}

rr = ensure_client_timer_is_up_to_date(t)
