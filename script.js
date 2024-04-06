function updateCountdown() {
    const countdownDate = new Date("April 7, 2024 12:00:00 UTC").getTime();
    const now = new Date().getTime();
    const difference = countdownDate - now;

    if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("timer").innerHTML = hours + "h " + minutes + "m " + seconds + "s";
    } else {
        document.getElementById("timer").innerHTML = "The countdown is over!";
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);
