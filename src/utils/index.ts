
export default {
    secondsToString(time: number) {
        const minutes = Math.floor(time / 60) % 60;
        const seconds = Math.floor(time - minutes * 60);
        let mins = minutes.toString();
        let secs = seconds.toString();
        if (minutes < 10) mins = "0" + minutes;
        if (seconds < 10) secs = "0" + seconds;
        return mins + ":" + secs

    }
}