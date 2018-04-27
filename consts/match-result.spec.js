import {MatchResult} from './match-result.js';

describe('MatchResult', () => 
{
	describe('MatchResult.player1', () => 
	{
		it('should be defined and the correct message', () =>
		{
			let player1 = MatchResult.player1;
			expect(player1).toBeDefined();
			expect(player1).toEqual('PLAYER 1');
			expect(player1).toEqual(MatchResult.player1);
			
		});
		
	});
	describe('MatchResult.player2', () => 
	{
		it('should be defined and the correct message', () =>
		{
			let player2 = MatchResult.player2;
			expect(player2).toBeDefined();
			expect(player2).toEqual('PLAYER 2');
			expect(player2).toEqual(MatchResult.player2);
			
		});
		
	});
	describe('MatchResult.draw', () => 
	{
		it('should be defined and the correct message', () =>
		{
			let draw = MatchResult.draw;
			expect(draw).toBeDefined();
			expect(draw).toEqual('DRAW');
			expect(draw).toEqual(MatchResult.draw);
			
		});
		
	});
	describe('MatchResult.error', () => 
	{
		it('should be defined and the correct message', () =>
		{
			let error = MatchResult.error;
			expect(error).toBeDefined();
			expect(error).toEqual('ERROR');
			expect(error).toEqual(MatchResult.error);
			
		});
		
	});
	
	
});