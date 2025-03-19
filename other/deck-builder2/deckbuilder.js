class Card{
    static CURRENT_ID = 0;
    constructor(name){
        this.name = name;
        this.id = Card.CURRENT_ID;
        Card.CURRENT_ID++;
    }
}

class Player {

    constructor(name){
        this.name = name;
        this.playingDeck = [new Card('a'), new Card('a'), new Card('a'), new Card('a'), new Card('a'), new Card('a')
            , new Card('a') , new Card('a'), new Card('a'), new Card('a')];
        this.hand = [];
        this.discard = [];
    }

    conditionallyMoveDiscardToPlayingDeck(){
        if (this.playingDeck.length <= 5){
            this.discard = Helper.shuffle(this.discard);
            this.playingDeck.push(...this.discard);
            this.discard = [];
        }
    }

    drawHand(amount) {//max 5
        for (let i = 0; i < amount; i++) {
            this.conditionallyMoveDiscardToPlayingDeck();
            let card = this.playingDeck.splice(this.playingDeck.length - 1, 1)[0];
            this.hand.push(card);
        }
    }

    discardHand(){
        this.discard = this.discard.concat(this.hand);
        this.hand.length = 0;
    }
}

class Game {

    constructor(){
        this.player1 = new Player('1');
        this.player2 = new Player('2');
    }
}

class UI{
    update(game){
        const deck1 = document.getElementById('deck1');
        const deck2 = document.getElementById('deck2');
        const hand1 = document.getElementById('hand1');
        const hand2 = document.getElementById('hand2');
        const discard1 = document.getElementById('discard1');
        const discard2 = document.getElementById('discard2');

        deck1.value = '';
        game.player1.playingDeck.forEach(deck1Card => {
            const newText = deck1.innerText + ' ' + deck1Card.id + ' ' + deck1Card.name + ', ';
            deck1.value += newText;
        });

        hand1.value = '';
            game.player1.hand.forEach(handCard => {
            const newText = hand1.innerText + ' ' + handCard.id + ' ' + handCard.name + ', ';
            hand1.value += newText;
        });

        discard1.value = '';
            game.player1.discard.forEach(discardCard => {
            const newText = discard1.innerText + ' ' + discardCard.id + ' ' + discardCard.name + ', ';
            discard1.value += newText;
        });


    }
}

class Helper{
    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }
}

let game = new Game();
let ui = new UI();

ui.update(game);
