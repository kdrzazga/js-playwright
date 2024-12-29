
let game = new Game();

document.getElementById("playActionCard").onclick = function() {
    game.player.playActionCard();
};

document.getElementById("playCurrencyCards").onclick = function() {
    const purchasingPower = game.playAllCurrencyCards(game.player);
    game.player.buyCardFromSet(purchasingPower);
};

document.getElementById("buyCard").onclick = function() {
    game.player.buyCardFromSet(0);
};

game.checkVictory();