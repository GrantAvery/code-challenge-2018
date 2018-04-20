describe('round', () => {
    it('should be instantiable', () => {
        let round = new Round();
        expect(round).toBeDefined();
    });

    describe('initial state', () => {
        it('should have a default turn count', () => {
            expect(new Round().turns).toBeDefined();
        });
        
        it('should have a configurable turn count', () => {
            expect(new Round(3).turns).toBe(3);
        });

        it('should have an initial turns remaining equal to turn count', () => {
            expect(new Round(5).turnsRemaining).toBe(5);
        })

        it('should have an initial status of "NEW"', () => {
            expect(new Round().status).toBe('NEW');
        });
    });

    describe('first turn execution', () => {
        it('should set the status to "IN_PROGRESS"', () => {
            let round = new Round();
            round.executeTurn();
            expect(round.status).toBe('IN_PROGRESS');
        });
    });

    describe('turn execution', () => {
        it('should decrement the remaining turns', () => {
            let round = new Round(5);
            round.executeTurn();
            round.executeTurn();
            expect(round.turnsRemaining).toBe(3);
        });

        it('should trigger a clash on the last turn', () => {
            let round = new Round(1);
            let executeClash = spyOn(round, 'executeClash');

            round.executeTurn();

            expect(round.turnsRemaining).toBe(0);
            expect(executeClash).toHaveBeenCalled();
        });

        it('should fail if the round is already FINISHED', () => {
            let round = new Round();
            round.status = 'FINISHED';

            expect(() => { round.executeTurn() }).toThrow();
        });
    });

    describe('clash', () => {
        it('should set the status to "FINISHED"', () => {
            let round = new Round(1);

            round.executeClash();

            expect(round.status).toBe('FINISHED');
        });
    })
});

describe('match', () => {
    it('should be instantiable', () => {
        let match = new Match(new DumbPlayer(), new DumbPlayer(), {});
        expect(match).toBeDefined();
    });
});