class Card {
    constructor(type) {
        this.type = type;
    }
}

class UnitCard extends Card {
    constructor() {
        super('Unit');
        this.hp = 1;
        this.attack = 1;
    }
}

class ActionCard extends Card {
    constructor() {
        super('Action');
        this.cost = 3;
    }
}

class ResourceCard extends Card {
    constructor() {
        super('Resource');
        this.amount = 1;
    }
}

class DeckCreator {
    static createDeck() {
        const deck = [];

        // Add Unit Cards
        for (let i = 0; i < 30; i++) {
            deck.push(new UnitCard());
        }

        // Add Action Cards
        for (let i = 0; i < 30; i++) {
            deck.push(new ActionCard());
        }

        // Add Resource Cards
        for (let i = 0; i < 50; i++) {
            deck.push(new ResourceCard());
        }

        return this.shuffleDeck(deck);
    }

    static shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.activeDeck = [];
        this.hand = [];
        this.discardDeck = [];
        this.currentResource = 0;
    }

    drawCards(count) {
        const drawnCards = this.activeDeck.splice(0, count);
        this.hand.push(...drawnCards);
    }

    play(cardIndex) {
        const card = this.hand[cardIndex];
        if (card) {
            this.hand.splice(cardIndex, 1);
            this.discardDeck.push(card);
            // Implement any other game logic for playing the card here
        }
    }

    refillActiveDeck() {
        if (this.activeDeck.length < 5) {
            this.activeDeck = this.activeDeck.concat(this.discardDeck);
            this.discardDeck = [];
            this.activeDeck = DeckCreator.shuffleDeck(this.activeDeck);
        }
    }
}

class Game {
    constructor() {
        this.players = [new Player('Player 1'), new Player('Player 2')];
        this.initializeGame();
    }

    initializeGame() {
        const fullDeck = DeckCreator.createDeck();

        // Distribute the cards to each player
        this.players.forEach(player => {
            player.activeDeck = fullDeck.splice(0, 20);
            player.drawCards(5); // Draw the initial 5 cards
        });
    }

    nextTurn() {
        this.players.forEach(player => {
            // Player's turn logic
            player.refillActiveDeck();
            // Implement more turn logic and UI update here
        });
    }
}

function preload() {
    // Load assets here if required
}

function create() {
    const gameInstance = new Game();

}

function update() {
    // Game looping logic can be handled here
}
