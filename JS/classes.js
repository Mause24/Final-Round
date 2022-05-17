class Fighter {
    constructor(position, speed, color, height, width, lastKey, attackBox, attacking, cooldown, life, damage, name, keysPressed) {
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
        this.keysPressed = keysPressed;
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
        if (this.position.y + this.height + this.speed.y >= canvas.height - GROUND || this.position.y + this.height + this.speed.y <= this.height) {
            this.speed.y = 0;
        } else {
            this.speed.y += GRAVITY;
        }
        if (this.position.x <= 0) {
            this.position.x = 0
            this.speed.x = 0
        } else if (this.position.x + this.width >= canvas.width) {
            this.position.x = canvas.width - this.width
            this.speed.x = 0
        }
    }

    attack() {
        this.attacking = true;
        setTimeout(() => this.attacking = false, 200)
        this.cooldown = true
        this.resetAttack()
    }

    resetAttack() {
        setTimeout(() => {
            this.cooldown = false
        }, 1000)
    }
}

class Sprite {
    constructor(position, height, width, imageSrc) {
        this.position = position;
        this.height = height;
        this.width = width;
        this.image = new Image();
        this.image.src = imageSrc;
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
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update() {
        this.draw()
    }


}