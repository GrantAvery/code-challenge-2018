import {PlayerActions} from './player-actions.js';

describe('PlayerActions', () =>
{
	// it('should not be instantiable', () =>
	// {
		// //i think this will fail at first
		// let playerActions = new PlayerActions();
		// expect(playerActions).not.toBeDefined();
	// });
	
	describe('PlayerActions.attack', () =>
	{
		it('should be defined and the correct message', () => 
		{
			//attack const game action message
			let attack = PlayerActions.attack;
			expect(attack).toBeDefined();
			expect(attack).toEqual('ATTACK');
			expect(attack).toEqual(PlayerActions.attack);
			
		});
		
	});
	describe('PlayerActions.trainAttacker', () =>
	{
		it('should be defined and the correct message', () => 
		{
			let trainAttacker = PlayerActions.trainAttacker;
			expect(trainAttacker).toBeDefined();
			expect(trainAttacker).toEqual('TRAIN_ATTACKER');
			expect(trainAttacker).toEqual(PlayerActions.trainAttacker);
		});
		
	});
	describe('PlayerActions.buildDefense', () =>
	{
		it('should be defined and the correct message', () => 
		{
			let buildDefense = PlayerActions.buildDefense;
			expect(buildDefense).toBeDefined();
			expect(buildDefense).toEqual('BUILD_DEFENSE');
			expect(buildDefense).toEqual(PlayerActions.buildDefense);
		});
		
	});
	describe('PlayerActions.invalid', () =>
	{
		it('should be defined and the correct message', () => 
		{
			let invalid = PlayerActions.invalid;
			expect(invalid).toBeDefined();
			expect(invalid).toEqual('INVALID');
			expect(invalid).toEqual(PlayerActions.invalid);
		});
		
	});
	
});