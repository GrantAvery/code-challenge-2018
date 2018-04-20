var context, canvas;
var counter = 0;
//placeholder names
var player1Name = "Bill";
var player1Soldiers=0, player1Workers = 0;
var player2Name = "Ted";
var player2Soldiers=0, player2Workers = 0;
var attacked = "You have";

//These are the values to pass to the games functions for adding, deducting resource
const player1Num = 1;
const player2Num = 2;

//ui element position variables, replace once positions set
var player1BoxX = 100;
var player2BoxX = 580;
var soldierImageY = 400;
var workerImageY = 300;

//this works for now
var myGame = new Game(new Player(player1Name, 1), new Player(player2Name, 2), 10);
console.log(myGame);
var player1Request, player2Request;
//console.log(myGame.Player1.prototype.Name);
//console.log(myGame.Player2.prototype.Name);

context = document.querySelector('canvas').getContext('2d');

//create a box to host the game info inside of
context.canvas.width = 1000;
context.canvas.height = 800;

var workerImage = document.getElementById("worker");
var soldierImage = document.getElementById("soldier");

update = function()
{
	while(counter < myGame.numOfRounds)
	{
		//This is just some very bad math to try to generate a "random" set of build order instructions
		var randWorker = Math.floor(1* Math.random(Math.floor, 1*myGame.costOfWorkers));
		var randSoldier = Math.floor(1* Math.random(Math.floor, 1*myGame.costOfSoldiers));
		
		console.log(randWorker);
		console.log(randSoldier);
		
		//add resource to each player *= number of the round
		//players will also get resource per worker so above option may go
		var amount = 1 * counter;
		myGame.addResource(amount,1);
		myGame.addResource(amount,2);
		
		myGame.addResource(1*myGame.player1.workers, 1);
		myGame.addResource(1*myGame.player2.workers, 2);
		
		//use random int probably just to do simple testing of calculation, resources, costs
		player1Request = myGame.player1.executeStrategy(randWorker,randSoldier,0,0);
		player2Request = myGame.player2.executeStrategy(randWorker,randSoldier,0,0);
		
		//check validity of each player request, that they have funds for workers, soldiers
		
		console.log(player1Request);
		console.log(player2Request);
		
		//get each players build and move requests
		
		//need to upate the rounds after each player has made whatever move
		counter++;
		//window.requestAnimationFrame(loop);
	}
	//window.requestAnimationFrame(loop);
}

//loop is serving as a draw loop function, can rename
loop = function()
{
	
//paint background, dark grey
context.fillStyle = '#202020';
context.fillRect(0, 0, context.canvas.width, context.canvas.height);

//inner white border box for arena
context.fillStyle = '#ffffff';
context.fillRect(10, 60, 980, 700);

//draw surrounding boxes for each player's army, 
context.fillStyle = '#000000';
context.fillRect(60, 100, 400, 500);
context.fillRect(540, 100, 400, 500);

context.font = "30px Arial";
context.fillStyle = '#ffffff';
context.fillText("Code Clash", 10, 50);

//draw players info
context.fillStyle = '#ffffff';
//player 1
context.fillText("Player 1:   " + myGame.player1.Name, 160, 160);
context.fillText("Resources: " + myGame.player1Resources, 100, 240);
context.drawImage(workerImage, 100, 300);
//context.fillText("workers:" + myGame.player1.workers, 80, 200);
context.drawImage(soldierImage, 100, 400);
//context.fillText("soldiers:" + player1Soldiers, 80, 200);

//player 2
context.fillText("Player 2:   " + myGame.player2.Name, 620, 160);
context.fillText("Resources: " + myGame.player1Resources, 580, 240);
//context.fillText("workers:" + myGame.player2.workers, 80, 200);
context.drawImage(workerImage, 580, 300);
//context.fillText("soldiers:" + player2Soldiers, 80, 200);
context.drawImage(soldierImage, 580, 400);

//player 1 UI line
context.strokeStyle = '#ffffff';
context.lineWidth = 8;
context.beginPath();
context.moveTo(60, 180);
context.lineTo(460, 180);
context.stroke();

//player 2 UI line
context.strokeStyle = '#ffffff';
context.lineWidth = 8;
context.beginPath();
context.moveTo(540, 180);
context.lineTo(940, 180);
context.stroke();

//Draw Current Round Display
context.font = "60px Arial Bold";
context.fillStyle = '#000000';
context.fillText("Round# " + counter, 320, 700);

update();

	window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);
//console.log(new Game(new Player("me"), new Player("you"), 10));