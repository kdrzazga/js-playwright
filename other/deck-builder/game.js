
let game = new Game();

document.getElementById("playActionCard").onclick = function() {
    game.playActionCard(game.player);
};

document.getElementById("playCurrencyCards").onclick = function() {
    const purchasingPower = game.playAllCurrencyCards(game.player);
    game.player.purchasingPower = purchasingPower;
    game.updateDisplay();
};

document.getElementById("buyCard").onclick = function() {
    game.buyCardFromSet(game.player.purchasingPower);
};

document.getElementById("nextRound").onclick = function() {
    game.nextRound();
};

game.checkVictory();