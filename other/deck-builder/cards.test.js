//npm i -g jest-cli
//jest cards.test.js

const {Card, Game} = require('./cards.js');

describe("End 2 End test", () => {
    let game = new Game();//dependent tests (not recommended by ISTQB)

  it('1. check initial status', () => {
    expect(game.cardSet.length).toBe(20);
    expect(game.table.length).toBe(0);
    expect(game.player.hand.length).toBe(5);
    expect(game.player.deck.length).toBe(5);
    expect(game.player.discard.length).toBe(0);
    expect(game.player.purchasingPower).toBe(0);
  });

  it('2. Next round -> the whole hand goes to discard', () => {
    const oldHand = game.player.hand;
    game.nextRound();
    const sortedOldHand = oldHand.slice().sort();
    const sortedNewDiscard = game.player.discard.slice().sort();

    expect(sortedOldHand.length).toBe(sortedNewDiscard.length);
    sortedOldHand.every((value, index) => expect(value).toBe(sortedNewDiscard[index]));
  });
});

