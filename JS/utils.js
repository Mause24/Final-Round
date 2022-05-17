const colissionRectangle = (rectangle1, rectangle2) => {
    return (
        (
            /* RIGHT ATTACK */
            (
                rectangle1.position.x + rectangle1.attackBox.x >= rectangle2.position.x &&
                rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
                (rectangle1.lastKey === 'ArrowRight' || rectangle1.lastKey === 'd')
            )
            ||
            /* LEFT ATTACK */
            (
                rectangle1.position.x + rectangle1.width - rectangle1.attackBox.x <= rectangle2.position.x + rectangle2.width &&
                rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
                (rectangle1.lastKey === 'ArrowLeft' || rectangle1.lastKey === 'a')
            )
        )
        &&
        rectangle1.position.y + rectangle1.attackBox.y >= rectangle2.position.y
    )
}

const timer = document.getElementById('timer');
const info = document.getElementById('info');

const determinateWinner = (player, enemy) => {
    clearInterval(time)
    info.style.opacity = 1;
    if (player.life.currentLife > enemy.life.currentLife) {
        info.textContent = `${player.name.toUpperCase()} WINS`
    } else if (enemy.life.currentLife > player.life.currentLife) {
        info.textContent = `${enemy.name.toUpperCase()} WINS`
    } else {
        info.textContent = `DRAW`
    }
}

const time = setInterval(() => {
    if (+timer.textContent > 0) {
        timer.innerText = (+timer.textContent) - 1
    } else {
        determinateWinner(player, enemy)
    }
}, 1000)