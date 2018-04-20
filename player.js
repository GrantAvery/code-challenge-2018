

function Player(name, playerNumber)
{
	this.name = name;
	this.workers = 0;
	this.soldiers = 0;
	this.spy = false;
	this.attack = false;
	this.playerNumber = playerNumber;
	
	this.addWorker = function(amount)
	{
		this.workers += amount;
	}
	this.addSoldier = function(amount)
	{
		this.soldiers += amount;
	}
	
	this.executeStrategy = function(numWorkers, numSoldiers, attack, spy)
	{
		var strat = {
			"playerNumber" : this.playerNumber,
			"workersRequested": numWorkers,
			"soldiersRequested": numSoldiers,
			"attack": attack,
			"spy": spy
		};
		return (strat);
	}
	
	Object.defineProperty(this, "Name", {get: function(){return name;}});
}

Player.prototype.SubmitTurnRequest = function(workersToBuild, soldiersToBuild, attack, spy)
{
	return this.executeStrategy(workersToBuild, soldiersToBuild, attack, spy);
}
Player.prototype.Name = function()
{
	return (this.name);
}

Player.prototype.Workers = function()
{
	return this.workers;	
}
Player.prototype.Soldiers = function()
{
	return this.soldiers;	
}

Player.prototype.addWorkers = function(amount)
{
		this.addWorker(amount);
}

Player.prototype.addSoldiers = function(amount)
{
		this.addSoldier(amount);
}