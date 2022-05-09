const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const GRAVITY = 0.7;

const ARROWS = {
    ArrowDown: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false }
}
const WASD = {
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false }
}

class Sprite {
    constructor(position, speed, color, height, width, lastKey, attackBox, attacking, cooldown, life, damage,name) {
        this.position = position;
        this.speed = speed;
        this.color = color;
        this.height = height;
        this.width = width;
        this.lastKey = lastKey;
        this.attackBox = attackBox;
        this.attacking = attacking;
        this.cooldown = cooldown;
        this.life = life;
        this.damage = damage;
        this.name = name;
    }

    getPosition() {
        return this.position;
    }

    setPosition(newPosition) {
        try {
            if (Object.values(newPosition).length === 2) {
                this.position = newPosition;
                return true;
            } else {
                console.error('El objeto position debe tener 2 variables numericas');

            }
        } catch (error) {
            console.error('No se puede asignar ese objeto al position');
            console.error("TYPE ERROR:" + error);
        }
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if (this.attacking && (this.lastKey === 'a' || this.lastKey === 'ArrowLeft')) {
            c.fillStyle = 'green'
            c.fillRect(this.position.x + this.width, this.position.y + this.attackBox.y, -this.attackBox.x, -this.attackBox.y)
        } else if (this.attacking && (this.lastKey === 'd' || this.lastKey === 'ArrowRight')) {
            c.fillStyle = 'green'
            c.fillRect(this.position.x, this.position.y, this.attackBox.x, this.attackBox.y)
        }
    }

    update() {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.draw()
        if (this.position.y + this.height + this.speed.y >= canvas.height || this.position.y + this.height + this.speed.y <= this.height) {
            this.speed.y = 0;
        } else {
            this.speed.y += GRAVITY;
        }
    }

    attack() {
        this.attacking = true;
        setTimeout(() => this.attacking = false, 500)
    }
}

const player = new Sprite(
    { x: 0, y: 0 },
    { x: 0, y: 10 },
    'royalblue',
    150,
    50,
    '',
    { x: 100, y: 50 },
    false,
    1000,
    { maxHealth: 100, currentLife: 100 },
    5,
    'PENECITA'
)
const enemy = new Sprite(
    { x: 975, y: 0 },
    { x: 0, y: 10 },
    'red',
    150,
    50,
    '',
    { x: 100, y: 50 },
    false,
    1000,
    { maxHealth: 100, currentLife: 100 },
    5,
    'MAPEAN'
)


window.addEventListener('keydown', (e) => {
    if (!e.altKey && !e.ctrlKey && (Object.keys(ARROWS).includes(e.key) || Object.keys(WASD).includes(e.key) || e.code === 'Space' || e.code === 'Numpad0')) {
        switch (e.key) {
            case 'ArrowUp':
                if (Math.floor(player.position.y + player.height) >= canvas.height) player.speed.y -= 20
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
                if (Math.floor(enemy.position.y + enemy.height) >= canvas.height) enemy.speed.y -= 20
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
                if (!enemy.attacking) enemy.attack()
                break;
            case '0':
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
                if (Math.floor(player.position.y + player.height) !== canvas.height) player.speed.y += 5;
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
                if (Math.floor(enemy.position.y + enemy.height) !== canvas.height) enemy.speed.y += 5;
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
            /* case ' ':
                enemy.attacking = false;
                break;
            case '0':
                player.attacking = false;
                break; */
            default:
                return;
        }
    }
})


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
console.log(+timer.textContent);
const time = setInterval(() => {
    if (+timer.textContent > 0) {
        timer.innerText = (+timer.textContent) - 1
    }else{
        clearInterval(time)
        if (player.life.currentLife>enemy.life.currentLife) {
            info.textContent=`${player.name.toUpperCase()} WINS`
        }else if (enemy.life.currentLife>player.life.currentLife) {
            info.textContent=`${enemy.name.toUpperCase()} WINS`
        }else{
            info.textContent=`DRAW`
        }
    }
    
}, 1000)

const animate = () => {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    /* c.fillStyle = 'white'
    c.fillRect(0, 300, canvas.width, 5) */
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
        const enemyHealth = document.getElementById("enemy")
        if (enemy.life.currentLife > 0) enemy.life.currentLife -= player.damage
        enemyHealth.style.width = `${enemy.life.currentLife > 0 ? ((enemy.life.currentLife * enemy.life.maxHealth) / 100) : 0}%`

    }
    if (colissionRectangle(enemy, player) && enemy.attacking) {
        enemy.attacking = false;
        const playerHealth = document.getElementById("player")
        if (player.life.currentLife > 0) player.life.currentLife -= player.damage
        playerHealth.style.width = `${player.life.currentLife > 0 ? ((player.life.currentLife * player.life.maxHealth) / 100) : 0}%`
    }
}

animate()

/* canvas.addEventListener('mousemove', (e) => {
    console.log(e);
    player.setPosition({x:e.offsetX,y:e.offsetY})
    player.draw()
}) */