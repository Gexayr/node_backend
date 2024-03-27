class Game {

    static steps = {
        1:10,
        2:20,
        3:50,
        4:100
    }

    constructor(id) {
        this.id = id;
        this.name = 'game1';
        this.houseEdgePercentage = 0.5;
    }

    play(data) {

        const playerBet = Game.steps[data?.step];

        // Generate a random number between 0 and 1
        const randomNumber = Math.random();

        // Determine if the player wins based on the house edge
        const playerWins = randomNumber > this.houseEdgePercentage;

        // Calculate payout multiplier (adjust as necessary)
        // Generate a random payout multiplier between 1 and 3
        const payoutMultiplier = Math.floor(Math.random() * 3) + 1;

        // Calculate payout amount based on player bet and payout multiplier
        const payoutAmount = playerWins ? playerBet * payoutMultiplier : 0;

        // const amount = payoutAmount - playerBet
        const amount = payoutAmount

        return { playerWins, payoutAmount, amount };
    }
}

module.exports = Game;
