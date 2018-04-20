function Game(player1, player2, numOfRounds)
{
	this.player1 = player1;
	this.player2 = player2;
	this.player1Resources = 0;
	this.player2Resources = 0;
	
	this.numOfRounds = numOfRounds;
	
	this.costOfWorkers = 1;
	this.costOfSoldiers = 2;
	
	this.addResource = function(amount, playerNum)
	{
		if (playerNum == 1)
		{
			this.player1Resources += amount;
		}
		else
		{
			this.player2Resources += amount;
		}
	}
	
	this.createWorkers = function(amount, player)
	{
		player.addWorker(amount);
	}
	
	this.createSoldiers = function(amount, player)
	{
		player.addSoldier(amount);
	}
	
	this.deductResource = function (amount, playerNum)
	{
		if (playerNum == 1)
		{
			player1Resources -= amount;
		}
		else if (playerNum == 2)
		{
			player2Resources -= amount;
		}
	}
	
	this.verifyResource = function(amount, playerNum)
	{
		if (checkPlayer(playerNum) == 1)
		{
			return this.player1Resources >= amount;
		}
		else if (checkPlayer(playerNum == 2))
		{
			return this.player2Resources >= amount;
		}
	}
	
	this.checkPlayer = function(playerNum)
	{
		if (playerNum == 1)
		{
			return 1;	
		}
		else
		{
			return 2;
		}
	}
}

Game.prototype.Player1 = function()
{
	return this.player1;
}

Game.prototype.Player2 = function()
{
	return this.player2;
}

Game.prototype.compareSoldierCount = function()
{
	return this.player1.Soldiers > this.player2.Soldiers;	
}

Game.prototype.evaluateRound = function()
{
	//both attack, no advantage
	if (this.player1.attack && this.player2.attack)
	{
		return this.compareSoldierCount();
	}
	else
	{
		//p1 attacks losese advantage
		if (this.player1.attack)
		{
			//could instead return count + 1 and not modifiy internal
			this.player2.addSoldier(1);
		}			
		else if (this.player2.attack)
		{
			this.player1.addSoldier(1);
		}
		//return this count comparison always
		return this.compareSoldierCount();
	}	
}

Game.prototype.createWorkers = function(amount, player)
{
	this.createWorkers(amount, player);
}

Game.prototype.createSoldiers = function(amount, player)
{
	this.createSoldiers(amount, player);
}
