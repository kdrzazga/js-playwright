
let game = new Game();

document.getElementById("playActionCard").onclick = function() {
    game.playActionCard(game.player);
};

document.getElementById("playCurrencyCards").onclick = function() {
    const purchasingPower = game.playAllCurrencyCards(game.player);
    game.player.buyCardFromSet(purchasingPower);
};

document.getElementById("buyCard").onclick = function() {
    game.buyCardFromSet(0);
};

document.getElementById("nextRound").onclick = function() {
    game.nextRound();
};

game.checkVictory();