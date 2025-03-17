//npx jest deck-builder.test.js

const { Card, UnitCard, ActionCard, ResourceCard, DeckCreator, Player, Game } = require('./deck-builder');

describe('Card and its subclasses', () => {
    test('Card should have a type', () => {
        const card = new Card('Test Type');
        expect(card.type).toBe('Test Type');
    });

    test('UnitCard should have hp and attack', () => {
        const unitCard = new UnitCard();
        expect(unitCard.hp).toBe(1);
        expect(unitCard.attack).toBe(1);
        expect(unitCard.type).toBe('Unit');
    });

    test('ActionCard should have a cost', () => {
        const actionCard = new ActionCard();
        expect(actionCard.cost).toBe(3);
        expect(actionCard.type).toBe('Action');
    });

    test('ResourceCard should have an amount', () => {
        const resourceCard = new ResourceCard();
        expect(resourceCard.amount).toBe(1);
        expect(resourceCard.type).toBe('Resource');
    });
});

describe('DeckCreator', () => {
    test('createDeck should return an array of 110 shuffled cards', () => {
        const deck = DeckCreator.createDeck();
        expect(deck.length).toBe(110);
        expect(deck).toEqual(expect.arrayContaining([expect.any(UnitCard), expect.any(ActionCard), expect.any(ResourceCard)]));
    });
});

describe('Player', () => {
    let player;

    beforeEach(() => {
        player = new Player('Test Player');
        player.activeDeck = DeckCreator.createDeck().slice(0, 20); // mock activeDeck with 20 cards
    });

    test('drawCards should add cards to hand', () => {
        player.drawCards(5);
        expect(player.hand.length).toBe(5);
        expect(player.activeDeck.length).toBe(15); // 20 - 5
    });

    test('play should move card from hand to discardDeck', () => {
        player.drawCards(5);
        const cardIndex = 0; // play first card in hand
        player.play(cardIndex);
        expect(player.hand.length).toBe(4); // played one card
        expect(player.discardDeck.length).toBe(1); // card was moved to discard
    });

    test('refillActiveDeck should refill and shuffle if hand is less than 5', () => {
        player.drawCards(5); // Draw 5 cards
        player.refillActiveDeck(); // Attempt to refill
        expect(player.activeDeck.length).toBeLessThan(20); // Active deck should have decreased
        expect(player.activeDeck.length).toBeGreaterThan(0); // Active deck should have cards
    });
});

describe('Game', () => {
    test('initializeGame should correctly distribute cards to players', () => {
        const game = new Game();
        expect(game.players.length).toBe(2);
        game.players.forEach(player => {
            expect(player.hand.length).toBe(5); // Each player has 5 cards
            expect(player.activeDeck.length).toBe(15); // 20 cards minus initial 5 drawn
        });
    });
});
