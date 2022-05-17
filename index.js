const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)
const GROUND=95
/* CONSTANTS */
const GRAVITY = 0.7;
const COMBOS = {
    player: {
        combo1: [
            'ArrowUp',
            'ArrowUp',
            'ArrowDown',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'ArrowLeft',
            'ArrowRight',
            '0',
            '1',
        ]
    },
    enemy: {
        combo1: [
            'w',
            'w',
            's',
            's',
            'a',
            'd',
            'a',
            'd',
            ' ',
            'f',
        ]
    }
}
const BACKGROUND = new Sprite(
    { x: 0, y: 0 },
    canvas.height,
    canvas.width,
    './img/background.png'
);

const ARROWS = {
    ArrowDown: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false }
}
const CONTROLS = {
    enemy: [
        'w',
        'a',
        's',
        'd',
        ' ',
        'f',
    ],
    player: [
        'ArrowUp',
        'ArrowLeft',
        'ArrowDown',
        'ArrowRight',
        '0',
        '1',
    ],
}
const WASD = {
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false }
}
const RESET = {
    enemy: -1,
    player: -1,
}
/* CONSTANTS END */

const player = new Fighter(
    { x: 0, y: 0 },
    { x: 0, y: 10 },
    'royalblue',
    150,
    50,
    '',
    { x: 100, y: 50 },
    false,
    false,
    { maxHealth: 100, currentLife: 100 },
    5,
    'PLAYER',
    []
)
const enemy = new Fighter(
    { x: 975, y: 0 },
    { x: 0, y: 10 },
    'red',
    150,
    50,
    '',
    { x: 100, y: 50 },
    false,
    false,
    { maxHealth: 100, currentLife: 100 },
    5,
    'ENEMY',
    []
)




window.addEventListener('keydown', (e) => {
    if (!e.altKey && !e.ctrlKey && (CONTROLS.enemy.includes(e.key) || CONTROLS.player.includes(e.key))) {
        console.log("PLAYER: " + player.keysPressed);
        console.log("ENEMY: " + enemy.keysPressed);
        if (RESET.enemy !== -1 && CONTROLS.enemy.includes(e.key)) {
            clearTimeout(RESET.enemy)
            RESET.enemy = -1;
        }
        if (RESET.player !== -1 && CONTROLS.player.includes(e.key)) {
            clearTimeout(RESET.player)
            RESET.player = -1;
        }

        if (CONTROLS.enemy.includes(e.key)) {
            enemy.keysPressed.push(e.key)
            RESET.enemy = setTimeout(() => enemy.keysPressed = [], 3000)
        } else {
            player.keysPressed.push(e.key)
            RESET.player = setTimeout(() => player.keysPressed = [], 3000)
        }
        switch (true) {
            case (COMBOS.player.combo1.every((value, i) => value === player.keysPressed[i])):
                enemy.life.currentLife = 0;
                player.keysPressed = []
                break;
            case (COMBOS.enemy.combo1.every((value, i) => value === enemy.keysPressed[i])):
                player.life.currentLife = 0;
                enemy.keysPressed = []
                break;
        }
        switch (e.key) {
            case 'ArrowUp':
                if (Math.floor(player.position.y + player.height) >= canvas.height - GROUND) player.speed.y -= 20
                break;
            case 'ArrowDown':
                player.position.y += player.speed.y
                break;
            case 'ArrowRight':
                ARROWS.ArrowRight.pressed = true;
                player.lastKey = 'ArrowRight'
                break;
            case 'ArrowLeft':
                ARROWS.ArrowLeft.pressed = true;
                player.lastKey = 'ArrowLeft'
                break;
            case 'w':
                if (Math.floor(enemy.position.y + enemy.height) >= canvas.height - GROUND) enemy.speed.y -= 20
                break;
            case 's':
                enemy.position.y += enemy.speed.y
                break;
            case 'a':
                WASD.a.pressed = true;
                enemy.lastKey = 'a'
                break;
            case 'd':
                WASD.d.pressed = true;
                enemy.lastKey = 'd'
                break;
            case ' ':
                if (enemy.cooldown) return e.preventDefault()
                if (!enemy.attacking) enemy.attack()
                break;
            case '0':
                if (player.cooldown) return e.preventDefault()
                if (!player.attacking) player.attack()
                break;
            default:
                return;
        }
    }
})

window.addEventListener('keyup', (e) => {
    if (!e.altKey && !e.ctrlKey && (Object.keys(ARROWS).includes(e.key) || Object.keys(WASD).includes(e.key) || e.code === 'Space' || e.code === 'Numpad0')) {
        switch (e.key) {
            case 'ArrowUp':
                if (Math.floor(player.position.y + player.height) !== canvas.height - GROUND) player.speed.y += 5;
                break;
            case 'ArrowDown':
                player.position.y += player.speed.y
                break;
            case 'ArrowRight':
                ARROWS.ArrowRight.pressed = false;
                break;
            case 'ArrowLeft':
                ARROWS.ArrowLeft.pressed = false;
                break;
            case 'w':
                if (Math.floor(enemy.position.y + enemy.height) !== canvas.height - GROUND) enemy.speed.y += 5;
                break;
            case 's':
                enemy.position.y += enemy.speed.y
                break;
            case 'a':
                WASD.a.pressed = false;
                break;
            case 'd':
                WASD.d.pressed = false;
                break;
            default:
                return;
        }
    }
})
const playerHealth = document.getElementById("player")
const enemyHealth = document.getElementById("enemy")

const animate = () => {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    /* c.fillStyle = 'white'
    c.fillRect(0, 300, canvas.width, 5) */
    BACKGROUND.update()
    player.update()
    enemy.update()


    player.speed.x = 0
    enemy.speed.x = 0

    if (ARROWS.ArrowRight.pressed && player.lastKey === 'ArrowRight') {
        player.speed.x = 3
    } else if (ARROWS.ArrowLeft.pressed && player.lastKey === 'ArrowLeft') {
        player.speed.x = -3
    }
    if (WASD.d.pressed && enemy.lastKey === 'd') {
        enemy.speed.x = 3
    } else if (WASD.a.pressed && enemy.lastKey === 'a') {
        enemy.speed.x = -3
    }

    if (colissionRectangle(player, enemy) && player.attacking) {
        player.attacking = false;
        if (enemy.life.currentLife > 0) enemy.life.currentLife -= player.damage
    }

    if (colissionRectangle(enemy, player) && enemy.attacking) {
        enemy.attacking = false;
        if (player.life.currentLife > 0) player.life.currentLife -= player.damage
    }

    enemyHealth.style.width = `${enemy.life.currentLife > 0 ? ((enemy.life.currentLife * enemy.life.maxHealth) / 100) : 0}%`
    playerHealth.style.width = `${player.life.currentLife > 0 ? ((player.life.currentLife * player.life.maxHealth) / 100) : 0}%`

    if ((enemy.life.currentLife <= 0 || player.life.currentLife <= 0) && info.style.opacity !== "1") {
        determinateWinner(player, enemy)
    }
}

animate()

/* canvas.addEventListener('mousemove', (e) => {
    console.log(e);
    player.setPosition({x:e.offsetX,y:e.offsetY})
    player.draw()
}) */