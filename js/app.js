// Enemies our player must avoid
class Enemy {
	constructor(x, y) {
	    this.x = x;
	    this.y = y;
	    // initial speed is randomized for each enemy instance
	    this.speed = 120 + Math.floor(Math.random() * 200);
	    // The image/sprite for our enemies, this uses
	    // a helper we've provided to easily load images
	    this.sprite = 'images/enemy-bug.png';
	}
	// Update the enemy's position, required method for game
	// Parameter: dt, a time delta between ticks
	update(dt) {
		// You should multiply any movement by the dt parameter
	    // which will ensure the game runs at the same speed for
	    // all computers.
	    this.x += this.speed * dt;
	    // Make the enemies instances move non-stop
		for (const enemy of allEnemies) {
			if (enemy.x > 506) {
				enemy.x = -100;
			}
		}
	}
	// Draw the enemy on the screen, required method for game
	render() {
	    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
};


const cellHeight = 83;
const cellWidth = 101;
// initial position of the player in terms of cells formed within the canvas
const initCellX = 2;
const initCellY = 5;
//tracks on which the enemies are moving
const track1 = cellHeight - cellHeight / 4;
const track2 = cellHeight * 2 - cellHeight / 4;
const track3 = cellHeight * 3 - cellHeight / 4;
// a const that is needed for player's position adjuctment
const diff = 20; 

// this function transforms pixel coordinates into cell numbers
function pixToCell(x, y) {
	let cellX = Math.floor(x / cellWidth);
	let cellY = Math.floor(y / cellHeight);
	return [cellX, cellY];
}

// this function transforms cell numbers into pixel coordinates
function cellToPix(cellX, cellY) {
	let x = cellX * cellWidth;
	let y = cellY * cellHeight;
	return [x, y];
}

// Place all enemy objects in an array called allEnemies

let allEnemies = [];

// this function generates enemy instances and places them to allEnemies
function generateEnemies(track) {
	let i = Math.floor(Math.random() * 3);
	if (i === 0) {
		allEnemies.push(new Enemy(-300, track));
	}
	for (j = 0; j < i; j++) {
		allEnemies.push(new Enemy(-300, track));
	}
}



class Player { 
	constructor(cellX, cellY) {
		this.cellX = cellX;
		this.cellY = cellY;
		//calculate x and y coordinates
		[this.x, this.y] = cellToPix(cellX, cellY);
		this.cmd = null;
		this.sprite = 'images/char-boy.png';
	}
	//adjusts the player's position in the cell
	adjustY() {
		this.y -= diff;
	}

	update(dt) {

		//player's position updated
		[this.x, this.y] = cellToPix(this.cellX, this.cellY);
		this.adjustY();


        // generates enemies
		if (allEnemies.length === 0) {
			generateEnemies(track1);
			generateEnemies(track2);
			generateEnemies(track3);
		}

		// switch statement controls the player's movements

		switch (this.cmd) {
		case 'left':
			if (this.cellX === 0) {
				break;
			}
			this.cellX--;
			break; 

		case 'up':
			if (this.cellY === 1) {
				// if the player reaches water, enemies are cleared to be re-generated
				allEnemies.length = 0;
				this.cellX = initCellX;
				this.cellY = initCellY;
				[this.x, this.y] = cellToPix(this.cellX, this.cellY);
				// the player is sent back to its initial position
				this.adjustY();
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
		}

		// if statement controls player-enemy collisions
		// 4 is the row where the grass starts, there can be no enemies
		if (this.cellY < 4) {
			for (const enemy of allEnemies) {
				[enemy.cellX, enemy.cellY] = pixToCell(enemy.x, enemy.y);
				if (enemy.cellX === this.cellX && enemy.cellY === (this.cellY - 1)) {
					this.cellX = initCellX;
					this.cellY = initCellY;
				}
			}
		}
		
		// clear the input value in order to handle the following one
		this.cmd = null;
	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	handleInput(cmd) {
		// in this method I only save the keycode value while the handling is reserved for update function
		this.cmd = cmd;
	}
};

// Now instantiate your objects.

// Place the player object in a variable called player
const player = new Player(initCellX, initCellY);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
