import {GameStatus} from './game-status.js';

describe('GameStatus', () =>
{
	describe('GameStatus.newGame', () =>
	{
		it('should be defined and the correct message', () => 
		{
			let newGame = GameStatus.newGame;
			expect(newGame).toBeDefined();
			expect(newGame).toEqual('NEW');
			expect(newGame).toEqual(GameStatus.newGame);
		});
	});
	describe('GameStatus.inProgress', () =>
	{
		it('should be defined and the correct message', () => 
		{
			let inProgress = GameStatus.inProgress;
			expect(inProgress).toBeDefined();
			expect(inProgress).toEqual('IN_PROGRESS');
			expect(inProgress).toEqual(GameStatus.inProgress);
		});
	});
	describe('GameStatus.finished', () =>
	{
		it('should be defined and the correct message', () => 
		{
			let finished = GameStatus.finished;
			expect(finished).toBeDefined();
			expect(finished).toEqual('FINISHED');
			expect(finished).toEqual(GameStatus.finished);
		});
	});
	
});