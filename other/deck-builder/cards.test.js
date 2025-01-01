//npm i -g jest-cli
//jest cards.test.js

const {CardType, Card, Game} = require('./cards.js');
const {playCurrencyCards} = require('./game.js');

describe("End 2 End test", () => {
    let testGame = new Game();//dependent tests (not recommended by ISTQB)

  it('1. Check initial status', () => {
    expect(testGame.cardSet.length).toBe(20);
    expect(testGame.table.length).toBe(0);
    expect(testGame.player.hand.length).toBe(5);
    expect(testGame.player.deck.length).toBe(5);
    expect(testGame.player.discard.length).toBe(0);
    expect(testGame.player.purchasingPower).toBe(0);
  });

  it('2. Next round -> the whole hand goes to discard', () => {
    const oldHand = testGame.player.hand;
    testGame.nextRound();
    const sortedOldHand = oldHand.slice().sort();
    const sortedNewDiscard = testGame.player.discard.slice().sort();

    expect(sortedOldHand.length).toBe(sortedNewDiscard.length);
    sortedOldHand.every((value, index) => expect(value).toBe(sortedNewDiscard[index]));
  });

  it('3. Play Currency Cards', () =>{
    testGame = new Game();
    const expectedCurrencyCards = 2;
    expect(testGame.player.hand.filter(c => c.type === CardType.CURRENCY).length).toBe(expectedCurrencyCards);
    const purchasingPower = testGame.playAllCurrencyCards(testGame.player);
    expect(purchasingPower).toBe(expectedCurrencyCards);
  });
});

