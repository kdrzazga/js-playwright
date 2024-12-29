const CardType = Object.freeze({
    CURRENCY: 'CURRENCY',
    VICTORY: 'VICTORY',
    ACTION: 'ACTION'
});

class Card {
    constructor(type) {
        this.type = type;
        this.value = 0;
        this.score = 0;

        if (type === CardType.CURRENCY) {
            this.value = 1;
        } else if (type === CardType.VICTORY) {
            this.score = 1;
        }
    }
}

class Game {
    static POINTS_TO_WIN = 9;

    constructor() {
        this.cardSet = [];
        this.table = [];
        this.player = new Player();
        this.initDeck();
        this.messageElement = document.getElementById("message");

        this.start();
    }

    initDeck() {
        for (let i = 0; i < 10; i++) {
            this.cardSet.push(new Card(CardType.CURRENCY));
            this.cardSet.push(new Card(CardType.VICTORY));
            this.cardSet.push(new Card(CardType.ACTION));
        }
    }

    start() {
        this.drawInitialCards();
        this.updateDisplay();
    }

    nextRound(){
        this.player.discard.push(...this.table);
        this.player.discard.push(...this.player.hand);

        this.table = [];
        this.player.hand = [];
        this.player.drawCards();

        this.updateDisplay();
    }

    drawInitialCards() {
        for (let i = 0; i < 10; i++) {
            const card = this.cardSet.pop();
            this.player.deck.push(card);
        }

        this.player.drawCards();
    }

    updateDisplay() {
        document.getElementById("set").innerText = "Set: " + this.cardSet.map(card => card.type).join(", ") + `  [${this.cardSet.length}]`;
        document.getElementById("table").innerText = "Table: " + this.table.map(card => card.type).join(", ") + `  [${this.table.length}]`;
        document.getElementById("hand").innerText = "Hand: " + this.player.hand.map(card => card.type).join(", ") + `  [${this.player.hand.length}]`;
        document.getElementById("deck").innerText = "Deck: " + this.player.deck.map(card => card.type).join(", ") + `  [${this.player.deck.length}]`;
        document.getElementById("discard").innerText = "Discard: " + this.player.discard.map(card => card.type).join(", ") + `  [${this.player.discard.length}]`;
        document.getElementById("score").innerText = "Score: " + this.player.score;

    }

    playAllCurrencyCards(player) {
        const currencyCards = player.hand.filter(card => card.type === CardType.CURRENCY);
        if (currencyCards.length > 0) {
            player.hand = player.hand.filter(card => card.type !== CardType.CURRENCY);
            this.table.push(...currencyCards);
            let purchasingPower = currencyCards.reduce((total, card) => total + card.value, 0);
            console.log(`Player's purchasing power = ${purchasingPower}.`);
            this.updateDisplay();
            return purchasingPower;
        }
        return 0;
    }

    checkVictory() {
        if (this.player.score >= Game.POINTS_TO_WIN) {
            this.messageElement.innerText = `${this.player.name} won the game!`;
            return true;
        }
        return false;
    }

    buyCardFromSet() {
        const card = this.cardSet.pop();
        this.player.deck.push(card);
        this.player.purchasingPower -= 1;
        this.updateDisplay();
    }

    playActionCard(player){
        player.playActionCard();
        this.updateDisplay();
    }
}

class Player {
    constructor() {
        this.name = "PLAYER";
        this.deck = [];
        this.hand = [];
        this.discard = [];
        this.score = 0;
        this.purchasingPower = 0;
    }

    drawCards() {
        for (let i = 0; i < 5; i++) {
            this.drawCardFromDeck();
        }
    }

    drawCardFromDeck() {
        if (this.deck.length == 0) this.moveDiscardToDeck();

        const card = this.deck.pop();
        this.hand.push(card);
    }

    moveDiscardToDeck(){
        this.deck.push(...this.discard);
        this.discard = [];
    }

    playActionCard() {
        const actionCardIndex = this.hand.findIndex(card => card.type === CardType.ACTION);
        if (actionCardIndex !== -1) {
            const card = this.hand.splice(actionCardIndex, 1)[0];
            game.table.push(card);
            console.log('Player played ACTION card');
        }
    }

    buyCardFromSet() {
        console.log(`Player purchased card. Remaining purchasing power = ${this.purchasingPower}`);
    }

}
