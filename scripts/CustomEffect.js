class CustomEffect {
    constructor(id) {
        this.element = document.getElementById(id);
        this.context = this.element.getContext("2d");
        this.entities = [];


        var that = this;
        this.WindowResize();
        window.addEventListener("resize", function() {that.WindowResize()});
        setInterval(function() {that.Update()}, 1000/60);
    }

    AddEntity(e) {
        this.entities.push(e);
    }

    WindowResize() {
        this.element.width = window.innerWidth;
        this.element.height = this.element.offsetHeight;
    }

    Update() {
        for (var i = 0; i < this.entities.length; i++) this.entities[i].Update(this.element);
        for (var i = 0; i < this.entities.length; i++) this.entities[i].Draw(this.context, this.element);
    }
}

class EffectEntity {
    Update() {}
    Draw() {}
}

class Background extends EffectEntity {
    constructor(color) {
        super();
        this.color = color;
    }

    Draw(ctx, canvas) {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

class ParticleEffect extends EffectEntity {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.velX = 0;
        this.velY = 0;
        this.size = 2;
    }

    Update(canvas) {
        this.Move();
        this.Collision(canvas);
    }

    Collision(c) {
        if (this.y > c.height - this.size) {
            this.y = c.height - this.size;
            this.velY = -this.velY * 0.8;
        }
        if (this.x < 0) {
            this.x = 0;
            this.velX = -this.velX * 0.8;
        }
        else if (this.x > c.width - this.size) {
            this.x = c.width - this.size;
            this.velX = -this.velX * 0.8;
        }
    }

    Move() {
        // this.velY += 1;
        this.x += this.velX;
        this.y += this.velY;
    }

    Draw(ctx, canvas) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class BgStart extends EffectEntity { 
    constructor(color) {
        super();
        this.done = false;
        this.color = color;

        var that = this;
        window.addEventListener("resize", function(){that.done = false;});
    }

    Draw(ctx, canvas) {
        if (this.done) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.done = true;
    }
}

class RandomFractile extends EffectEntity {
    constructor(x = 0, y = 0, color = "white") {
        super();
        this.cellSize = 10;
        this.x = x * this.cellSize;
        this.y = y * this.cellSize;
        this.dirX = 1;
        this.dirY = 0;
        this.time = 0;
        this.lx = this.x;
        this.ly = this.y;
        this.color = color;
        this.rainbow = false;

        var that = this;

        window.addEventListener('keydown', function(e) {that.Key(e)});
    }

    RandomColor() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        var rgb = `rgb(${r}, ${g}, ${b})`;
        this.color = rgb;
    }

    Update(canvas) {
        this.time++;
        if (this.time < 2) return;

        this.time = 0;
        this.lx = this.x;
        this.ly = this.y;
        this.x += this.dirX * this.cellSize;
        this.y += this.dirY * this.cellSize;
        if (this.rainbow) this.RandomColor();

        if (this.x < this.cellSize * 3) this.x = this.cellSize * 3
        else if (this.x > canvas.width - this.cellSize * 3) this.x = canvas.width - this.cellSize * 3

        if (this.y < this.cellSize * 3) this.y = this.cellSize * 3;
        else if (this.y > canvas.height - this.cellSize * 3) this.y = canvas.height - this.cellSize * 3

        var d = Math.floor(Math.random() * 4);
        if (d % 2 == 0) {
            this.dirX = d == 0 ? -1 : 1;
            this.dirY = 0;
        }
        else {
            this.dirX = 0;
            this.dirY = d == 1 ? -1 : 1;
        }
    }

    Key(e) {
        if (e.key == 'd') {
            this.dirX = 1;
            this.dirY = 0;
        }
        else if (e.key == 'a') {
            this.dirX = -1;
            this.dirY = 0;
        }
        else if (e.key == 'w') {
            this.dirX = 0;
            this.dirY = -1;
        }
        else if (e.key == 's') {
            this.dirX = 0;
            this.dirY = 1;
        }
    }

    Draw(ctx) {
        ctx.strokeStyle = this.color;
    
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.lx, this.ly);
        ctx.stroke();
    }
}

const startEffect = new CustomEffect("starteff");
startEffect.AddEntity(new BgStart("black"));

var maxX = startEffect.element.width / 10;
var maxY = startEffect.element.height / 10;

for (var i = 0; i < 10; i++) {
    var x = Math.floor(Math.random() * maxX);
    var y = Math.floor(Math.random() * maxY);

    var eff = new RandomFractile(x, y);

    if (Math.random() * 1000 > 990) eff.rainbow = true;
    eff.RandomColor();

    startEffect.AddEntity(eff);
}
