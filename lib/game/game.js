"use strict";

const readline = require('readline-sync');
const { Shoe } = require('./cardClasses.js');
const { Player, MachinePlayer, Dealer } = require('./playerClasses.js');


class Game {
  constructor() {
    this.bustValue = 21;
    this.pushValue = 17;
    this.shoe = new Shoe();
    this.reshuffleLimit = this.shoe.length() * (0.17);
    this.seats = [];
    this.fillSeats();
    this.timer = ms => new Promise(res => setTimeout(res, ms));
  }

  fillSeats() {
    let humanSeat = Math.floor(Math.random() * 7);
    for (let idx = 0; idx < 7; idx++) {
      if (idx === humanSeat) {
        this.seats[idx] = new Player(this.shoe, this.bustValue);
      } else {
        this.seats[idx] =
          new MachinePlayer(this.shoe, this.bustValue);
      }
    }

    this.seats
      .push(
        new Dealer(this.shoe, this.bustValue, this.pushValue)
      );

    this.dealer = this.seats[this.seats.length - 1];
  }

  async deal() {
    for (let count = 0; count < 2; count++) {
      for (let seatNumber = 0; seatNumber < this.seats.length; seatNumber++) {
        this.seats[seatNumber].hand.addCard(this.shoe.draw());
        await this.timer(1000);
        console.clear();
        this.showPlayerHands();
        this.showDealerUpcard();
      }
    }
  }

  reshuffle() {
    this.shoe.reshuffle();
  }

  prettyPrintHeaders() {
    let headerString = '|';
    this.seats.forEach(participant => {
      if (participant.constructor.name !== 'Dealer') {
        headerString += (participant.header + '|');
      }
    });

    console.log('_'.repeat(headerString.length));
    console.log(headerString);
    console.log(('|' + '='.repeat(this.seats[0].header.length)).repeat(7) + '|');
  }

  prettyPrintHands(cardNumber = 0) {
    let cardString = '|';
    let stopString = (('|' + ' '.repeat(24)).repeat(7)) + '|';
    this.seats.forEach(participant => {
      // eslint-disable-next-line max-len
      if (participant.cards().length > cardNumber && participant !== this.dealer) {
        cardString += ((participant.cards()[cardNumber].rank
          + " of "
          + participant.cards()[cardNumber].suit).padEnd(24, ' ')
          + '|');
      } else if (participant !== this.dealer) {
        cardString += (' '.repeat(24) + '|');
      }
    });

    if (cardString === stopString) {
      console.log(('|' + '_'.repeat(24)).repeat(7) + '|');
    } else {
      console.log(cardString);
      this.prettyPrintHands(cardNumber + 1);
    }
  }

  showPlayerHands() {
    this.prettyPrintHeaders();
    this.prettyPrintHands();
  }

  printDealerHeader() {
    console.log(('+' + '-'.repeat(24) + '+').padStart(101, ' '));
    console.log(('|' + this.dealer.header + '|').padStart(101, ' '));
    console.log(('|' + '='.repeat(24) + '|').padStart(101, ' '));
  }

  showDealerUpcard() {
    this.printDealerHeader();

    this.dealer.cards().forEach((card, idx) => {
      if (!card) {
        console.log(('|' + ' '.repeat(24) + '|').padStart(101, ' '));
      } else if (idx === 1 && card) {
        console.log(('|' + (card.rank + " of " + card.suit)
          .padEnd(24, ' ') + '|').padStart(101, ' '));
      } else {
        console.log(('|' + " ***".padEnd(24, ' ') + '|').padStart(101, ' '));
      }
    });

    console.log(('+' + '-'.repeat(24) + '+').padStart(101, ' '));
  }

  showDealerHand() {
    this.printDealerHeader();

    this.dealer.cards().forEach(card => {
      console.log(('|' + (card.rank + " of " + card.suit)
        .padEnd(24, ' ') + '|').padStart(101, ' '));
    });

    console.log('*'.repeat(26).padStart(101, ' '));
  }

  hitOrStay(player) {
    let choice;
    do {
      choice = readline.question('(H)it or (S)tay: ').toLowerCase();
    } while (!['s', 'h'].includes(choice));

    switch (choice) {
      case 'h':
        player.hit();
        return true;
      case 's':
        return false;
      default:
        return false;
    }
  }

  playerBusted(player) {
    if (player.hand.points > this.bustValue) {
      console.log(player.constructor.name + " busts!");
      return true;
    }

    return false;
  }

  playRound() {
    // TODO
  }

  playMatch() {

  }

  play() {
    this.deal();
    this.showDealerHand();
  }
}

// test client
let game = new Game();
game.play();

//State of play: must learn how to program asynchronously