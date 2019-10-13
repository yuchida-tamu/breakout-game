let context = document.querySelector('#context').getContext('2d');
context.font = '20px Calibri';
context.fillText('Click me to start the game', 150,250);


//canvas size
const WIDTH = 500;
const HEIGHT = 500;

let numOfTiles, tileList, score, intervalVar, hitCount, running;

score = 0;
running = false

//ball and base object
let ball = {
	x:0,
	y:0,
	radius:5,
	color:'blue',
	spdX: -5,
	spdY: -5,
};

let base = {
	x:0,
	y:400,
	height: 20,
	width: 100,
	color: 'red',
	spd: 6,
	pressingLeft: false,
	pressingRight: false,
	lives: 3,
};

//tile object

let tile = {
	height: 20,
	width: 40,
	color: 'orange',
};

document.getElementById('context').onmousedown = () => {
	if(running){
		running = false;
		clearInterval(intervalVar);
	}
	startGame();
}

//key detection

document.onkeydown = function(event){
	if(event.keyCode == 37){
		base.pressingLeft = true;
		base.pressingRight = false;
	} else if (event.keyCode == 39) {
		base.pressingLeft = false;
		base.pressingRight = true;
	}
};

document.onkeyup = function(event){
	if(event.keyCode == 37){
		base.pressingLeft = false;
	} else if (event.keyCode == 39) {
		base.pressingRight = false;
	}
};


let testCollision = function(base, ball){
	return (
			(base.x < ball.x + 2*ball.radius) &&
			(ball.x < base.x + base.width) &&
			(base.y < ball.y + 2*ball.radius) &&
			(ball.y < base.y + base.height)
		);
}

let testCollisionTile = function (t, ball) {
	return (
			(t.x < ball.x + 2*ball.radius) &&
			(ball.x < t.x + tile.width) &&
			(t.y < ball.y + 2*ball.radius) &&
			(ball.y < t.y + tile.height)
		);
}





let drawBall = function() {
	context.save();
	context.fillStyle = ball.color;
	context.beginPath();
	//arc(x_pos,y_pos,radius, start_angle, end_angle)
	//2*Math.PI = 360deg
	context.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
	context.fill();
	context.restore();
};

let drawBase = function () {
	context.save();
	context.fillStyle = base.color;
	context.fillRect(base.x, base.y, base.width, base.height);
	context.restore();
};

let drawTile = function (t, i) {
	context.save();
	context.fillStyle = tile.color;
	context.fillRect(t.x, t.y, tile.width, tile.height);
	context.restore();
}

let updateBasePosition = function () {
	if(base.pressingLeft){
		base.x = base.x - base.spd;
	} else if (base.pressingRight){
		base.x = base.x + base.spd;
	}

	//check if the base touches the edge of the canvas
	if(base.x < 0){
		base.x = 0;
	}
	if (base.x > WIDTH - base.width){
		base.x = WIDTH - base.width;
	}

};

let updateBallPosition = function (){
	ball.x += ball.spdX;
	ball.y += ball.spdY;
	console.log(hitCount);
	//if a ball hit the edge it goes to oposite direction
	if(ball.x > WIDTH || ball.x < 0){
		hitCount++;
		if(hitCount % 10 == 0){
			if(ball.spdX < 0) {
				//abs = absolute value
				ball.spdX = -(Math.abs(ball.spdX)+1);
			} else {
				ball.spdX += 1;
			}
		}
		ball.spdX = -ball.spdX;
	} else if ( ball.y < 0){
		hitCount++;
		if(hitCount % 10 == 0){
			if(ball.spdY < 0) {
				//abs = absolute value
				ball.spdY = -(Math.abs(ball.spdY)+1);
			} else {
				ball.spdY += 1;
			}
		}
		ball.spdY = -ball.spdY;
	}

	if (ball.y > HEIGHT){
		hitCount++;
		if(hitCount % 10 == 0){
			if(ball.spdY < 0) {
				//abs = absolute value
				ball.spdY = -(Math.abs(ball.spdY)+1);
			} else {
				ball.spdY += 1;
			}
		}
		ball.spdY = -ball.spdY;
		base.lives -= 1;
	}	

};

let isGameOver = function (){
	if(base.lives == 0 || score == 330){
		clearInterval(intervalVar);
		context.fillText('Game Over! Click to restart', 150,250);
	}
}

let update = function() {
	context.clearRect(0,0,WIDTH,HEIGHT);
	tileList.forEach(drawTile);
	drawBall();
	drawBase();
	
	if(testCollision(base, ball)){
		ball.spdY = -ball.spdY;
	}

	for(key in tileList){
		if(testCollisionTile(tileList[key], ball)){
			delete tileList[key];
			ball.spdY = -ball.spdY;
			score += 5;
		}
	}

	
	isGameOver();
	updateBasePosition();
	updateBallPosition();
	context.fillText('Score: '+ score, 10, 490);
	context.fillText('lives: '+ base.lives, 400, 490);
};

let startGame = function () { 
	running = true;
	base.x = 150;
	ball.x = Math.random()*490;
	ball.y = 250;
	score = 0;
	hitCount = 0;
	base.lives = 3;
	//initialize tiles
	numOfTiles = 0;
	//x_pos and y_pos of a tile
	let tileX = 5;
	let tileY = 5;
	tileList = [];
	//assign tile pos to each
	for(let i = 1; i<=6; i++){
		tileX = 5;

		for(let j =1; j<=11; j++){
			//column
			tileList[numOfTiles] = {x:tileX, y:tileY};
			numOfTiles++;
			tileX += 45;
		}
		//row
		tileY += 25;
	}

	intervalVar = setInterval(update, 20);
};

