const {Game} = require('./cards.js');

function playCurrencyCards() {
    const purchasingPower = game.playAllCurrencyCards(game.player);
    game.player.purchasingPower = purchasingPower;
    game.updateDisplay();
}

let game = new Game();

if (typeof(document) === undefined)
    document.getElementById("playActionCard").onclick = function() {
        game.playActionCard(game.player);
    };

if (typeof(document) === undefined)
    document.getElementById("playCurrencyCards").onclick = playCurrencyCards;

if (typeof(document) === undefined)
    document.getElementById("buyCard").onclick = function() {
        game.buyCardFromSet(game.player.purchasingPower);
    };

if (typeof(document) === undefined)
    document.getElementById("nextRound").onclick = function() {
        game.nextRound();
    };

game.checkVictory();

module.exports = {playCurrencyCards};
