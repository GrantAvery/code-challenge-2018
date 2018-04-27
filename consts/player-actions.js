
const buildDefense = 'BUILD_DEFENSE';
const trainAttacker = 'TRAIN_ATTACKER';
const attack = 'ATTACK';
const invalid = 'INVALID';

class PlayerActions 
{
	
	static get buildDefense(){return buildDefense;}
	static get trainAttacker(){return trainAttacker;}
	static get attack(){return attack;}
	static get invalid() {return invalid;}
}

export {PlayerActions};