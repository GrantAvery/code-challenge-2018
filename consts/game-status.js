const newGame = 'NEW';
const inProgress = 'IN_PROGRESS';
const finished = 'FINISHED';

class GameStatus
{
	static get newGame(){return newGame;}
	static get inProgress(){return inProgress;}
	static get finished() {return finished;}
}

export {GameStatus}