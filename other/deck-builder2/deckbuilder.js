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
            this.playingDeck.unshift(...this.discard);//push to the beginning of the list
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
        this.setA = [new Card('sa'), new Card('sa'), new Card('sa'), new Card('sa'), new Card('sa'), new Card('sa')
                                    , new Card('sa') , new Card('sa'), new Card('sa'), new Card('sa'), new Card('sa')];//11 cards
        this.setB = [new Card('sb'), new Card('sb'), new Card('sb'), new Card('sb'), new Card('sb'), new Card('sb')
                                    , new Card('sb') , new Card('sb'), new Card('sb'), new Card('sb'), new Card('sb')];
        this.setC = [new Card('sc'), new Card('sc'), new Card('sc'), new Card('sc'), new Card('sc'), new Card('sc')
                                    , new Card('sc') , new Card('sc'), new Card('sc'), new Card('sc'), new Card('sc')];
        this.table = [];
    }

    pickCardFromSetA(player){
        if (this.setA.length < 1){
            console.log('Set A empty');
            return
        }
        let card = this.setA.splice(this.setA.length - 1, 1)[0];
        player.discard.push(card);
    }

    pickCardFromSetB(player){
        if (this.setB.length < 1){
            console.log('Set B empty');
            return
        }
        let card = this.setB.splice(this.setB.length - 1, 1)[0];
        player.discard.push(card);
    }

    pickCardFromSetC(player){
        if (this.setC.length < 1){
            console.log('Set C empty');
            return
        }

        let card = this.setC.splice(this.setC.length - 1, 1)[0];
        player.discard.push(card);
    }

    playHand(player) {
        game.table = [...player.hand];
        player.hand.length = 0;
    }
}

class UI{
    update(game){
        const setA = document.getElementById('setA');
        const setB = document.getElementById('setB');
        const setC = document.getElementById('setC');
        const deck1 = document.getElementById('deck1');
        const deck2 = document.getElementById('deck2');
        const hand1 = document.getElementById('hand1');
        const hand2 = document.getElementById('hand2');
        const discard1 = document.getElementById('discard1');
        const discard2 = document.getElementById('discard2');
        const table = document.getElementById('table');

        setA.value = '';
        game.setA.forEach(card => {
                const newText = setA.innerText + ' ' + card.id + ' ' + card.name + ', ';
                setA.value += newText;
        });
        setB.value = '';
        game.setB.forEach(card => {
                const newText = setB.innerText + ' ' + card.id + ' ' + card.name + ', ';
                setB.value += newText;
        });
        setC.value = '';
        game.setC.forEach(card => {
                const newText = setC.innerText + ' ' + card.id + ' ' + card.name + ', ';
                setC.value += newText;
        });

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

        table.value = '';
        game.table.forEach(card => {
            const newText = table.innerText + ' ' + card.id + ' ' + card.name + ', ';
            table.value += newText;
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
