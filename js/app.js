// Enemies our player must avoid
const Enemy = function(x, y) {
    
    this.x = x;
    this.y = y;
    this.speed = 120 + Math.floor(Math.random() * 200);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
	for (const enemy of allEnemies) {
		if (enemy.x > 506) {
			enemy.x = -100;
		}
	}

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const cellHeight = 83;
const cellWidth = 101;
const initCellX = 2;
const initCellY = 5;
const track1 = cellHeight - cellHeight / 4;
const track2 = cellHeight * 2 - cellHeight / 4;
const track3 = cellHeight * 3 - cellHeight / 4;

function pixToCell(x, y) {
	let cellX = Math.floor(x / cellWidth);
	let cellY = Math.floor(y / cellHeight);

	return [cellX, cellY];

};

function cellToPix(cellX, cellY) {
	let x = cellX * cellWidth;
	let y = cellY * cellHeight;

	return [x, y];
};

// function backToStart (cellX, cellY, x, y) {
// 	cellX = initCellX;
// 	cellY = initCellY;
// 	[newX, newY] = cellToPix(cellX, cellY);
// 	x = newX;
// 	y = newY - 20;]
// }

const Player = function(cellX, cellY) {
	this.cellX = cellX;
	this.cellY = cellY;
	[this.x, this.y] = cellToPix(cellX, cellY);
	this.y -= 20;
	this.cmd = null;
	this.sprite = 'images/char-boy.png';
};

function generateEnemies(track) {
	let i = Math.floor(Math.random() * 3);
	if (i === 0) {
		allEnemies.push(new Enemy(-300, track));
	};
	for (j = 0; j < i; j++) {
		allEnemies.push(new Enemy(-300, track));
	};
}



Player.prototype.update = function(dt) {

	[newX, newY] = cellToPix(this.cellX, this.cellY);
	[this.x, this.y] = [newX, newY - 20];


	//console.log("after", this.cellX, this.cellY, this.x, this.y);

	if (allEnemies.length === 0) {
		generateEnemies(track1);
		generateEnemies(track2);
		generateEnemies(track3);
	};

	switch (this.cmd) {
		case 'left':
			if (this.cellX === 0) {
				break;
			}
			this.cellX--;
			break; 

		case 'up':
			if (this.cellY === 1) {
				allEnemies.length = 0;
				this.cellX = initCellX;
				this.cellY = initCellY;
				[newX, newY] = cellToPix(this.cellX, this.cellY);
				this.x = newX;
				this.y = newY - 20;
				break;
			}
			this.cellY--;
			break;

		case 'right':
			if (this.cellX === 4) {
				break;
			}
			this.cellX++;
			break;

		case 'down':
			if (this.cellY === 5) {
				break;
			}
			this.cellY++;
			break;
	};

	if (this.cellY < 4) {
		for (const enemy of allEnemies) {
			[enemyX, enemyY] = pixToCell(enemy.x, enemy.y);
			if (enemyX === this.cellX && enemyY === (this.cellY - 1)) {
				this.cellX = 2;
				this.cellY = 5;
			}
		}
	}
	
	this.cmd = null;
};

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(cmd) {
	this.cmd = cmd;
};

// This class requires an update(), render() and
// a handleInput() method.
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];
const player = new Player(initCellX, initCellY);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
