'use strict';

const TOTAL_NUM_EPIDEMIC_CARDS = 5;
const CARDS_PER_TURN = 2;

class PlayerDeck {
    constructor(numPlayers, numEventCards) {
        this.numPlayers = numPlayers;
        this.numStartingCards = 2 * numPlayers;
        // nine starting cards if a 3-player game
        if (numPlayers === 3)
        {
            this.numStartingCards++;
        }

        var numCards = 0;
        this.numCityCards = {};
        for (var diseaseKey in Diseases) {
            var disease = Diseases[diseaseKey];
            this.numCityCards[disease.name] = CityPlayerCards.filter(card => card.city.disease === disease).length;
            numCards += this.numCityCards[disease.name];
        }
        
        this.numEventCards = numEventCards;
        numCards += numEventCards;

        this.numEpidemicCards = TOTAL_NUM_EPIDEMIC_CARDS;
        numCards += this.numEpidemicCards;

        var numNonStartingCards = numCards - this.numStartingCards;
        
        var basePileSize = Math.floor(numNonStartingCards / TOTAL_NUM_EPIDEMIC_CARDS);
        var cardsLeftOver = numNonStartingCards % TOTAL_NUM_EPIDEMIC_CARDS;
        this.numCardsPerPile = new Array(TOTAL_NUM_EPIDEMIC_CARDS).fill(basePileSize);
        for(var i = 0; i < cardsLeftOver; i++)
        {
            this.numCardsPerPile[i] += 1;
        }
    }

    _removeCard() {
        if (this.numStartingCards > 0) {
            this.numStartingCards--;
        }
        else {
            this.numCardsPerPile[0]--;
            if (this.numCardsPerPile[0] === 0) {
                this.numCardsPerPile.shift();
            }
        }
        
    }

    removeCityCard(disease) {
        var before = this.numCityCards[disease.name];
        if (before <= 0) {
            throw "No cards of that type left";
        }
        this.numCityCards[disease.name] = before - 1;
        this._removeCard();
    }

    removeEpidemicCard() {
        this.checkStarted();
        if (this.numEpidemicCards <= 0) {
            throw "No cards of that type left";
        }
        this.numEpidemicCards--;
        this._removeCard();
    }

    removeEventCard() {
        if (this.numEventCards <= 0) {
            throw "No cards of that type left";
        }
        this.numEventCards--;
        this._removeCard();
    }

    checkStarted() {
        if (this.numStartingCards > 0)
        {
            throw "Still dealing starting cards";
        }
    }

    turnsLeft() {
        this.checkStarted();
        var numCards = 0;
        for (var i = 0; i < this.numCardsPerPile.length; i++)
        {
            numCards += this.numCardsPerPile[i];
        }
        return numCards / CARDS_PER_TURN;
    }

    cardsLeftInPile() {
        this.checkStarted();
        return this.numCardsPerPile.length > 0 ? this.numCardsPerPile[0] : 0;
    }
}

class InfectionDeck {
    constructor() {
        this.discardPile = [];
        // top of the deck first
        this.cardSets = [InfectionCards.slice()];
    }

    _removeCard(setIndex, cardIndex) {
        if (setIndex < 0 || setIndex >= this.cardSets.length)
        {
            throw "Invalid set index";
        }

        if (cardIndex < 0 || cardIndex >= this.cardSets[setIndex].length)
        {
            throw "Invalid card index";
        }

        this.discardPile.push(this.cardSets[setIndex][cardIndex]);
        this.cardSets[setIndex].splice(cardIndex, 1);
        if (this.cardSets[setIndex].length == 0)
        {
            this.cardSets.splice(setIndex, 1);
        }
    }

    takeInfectCard(cardIndex) {
        this._removeCard(0, cardIndex);
    }

    takeIntensifyCard(setIndex, cardIndex) {
        this._removeCard(setIndex, cardIndex);
        this.cardSets.unshift(this.discardPile);
        this.discardPile = [];
    }
}


class Disease {
    constructor(name) {
        this.name = name;
    }
}

class City {
    constructor(name, disease) {
        this.name = name;
        this.disease = disease;
    }
}

class Card {
    constructor(name) {
        this.name = name;
    }
}

class PlayerCard extends Card {}

class CityPlayerCard extends PlayerCard {
    constructor(city) {
        super(city.name);
        this.city = city;
    }
}

class EpidemicPlayerCard extends PlayerCard {
    constructor() {
        super("Epidemic");
    }
}

class FundingPlayerCard extends PlayerCard {
    constructor(name, description) {
        super(name);
        this.description = description;
    }
}

class InfectionCard extends Card {
    constructor(city) {
        super(city.name);
        this.city = city;
    }
}

var Diseases = {
    BLUE : new Disease("Blue", "#0000FF"),
    RED : new Disease("Red", "#FF0000"),
    YELLOW : new Disease("Yellow", "#FFFF00"),
    BLACK : new Disease("Black", "#000000")
};

var Cities = [
    new City("Algiers", Diseases.BLACK),
    new City("Atlanta", Diseases.BLUE),
    new City("Baghdad", Diseases.BLACK),
    new City("Bangkok", Diseases.RED),
    new City("Beijing", Diseases.RED),
    new City("Bogota", Diseases.YELLOW),
    new City("Buenos Aries", Diseases.YELLOW),
    new City("Cairo", Diseases.BLACK),
    new City("Chennai", Diseases.BLACK),
    new City("Chicago", Diseases.BLUE),
    new City("Delhi", Diseases.BLACK),
    new City("Essen", Diseases.BLUE),
    new City("Ho Chi Minh City", Diseases.RED),
    new City("Hong Kong", Diseases.RED),
    new City("Istanbul", Diseases.BLACK),
    new City("Jakarta", Diseases.RED),
    new City("Johannesburg", Diseases.YELLOW),
    new City("Karachi", Diseases.BLACK),
    new City("Khartoum", Diseases.YELLOW),
    new City("Kinshasa", Diseases.YELLOW),
    new City("Kolkata", Diseases.BLACK),
    new City("Lagos", Diseases.YELLOW),
    new City("Lima", Diseases.YELLOW),
    new City("London", Diseases.BLUE),
    new City("Los Angeles", Diseases.YELLOW),
    new City("Madrid", Diseases.BLUE),
    new City("Manila", Diseases.RED),
    new City("Mexico City", Diseases.YELLOW),
    new City("Miami", Diseases.YELLOW),
    new City("Milan", Diseases.BLUE),
    new City("Montreal", Diseases.BLUE),
    new City("Moscow", Diseases.BLACK),
    new City("Mumbai", Diseases.BLACK),
    new City("New York", Diseases.BLUE),
    new City("Osaka", Diseases.RED),
    new City("Paris", Diseases.BLUE),
    new City("Riyadh", Diseases.BLACK),
    new City("San Francisco", Diseases.BLUE),
    new City("Santiago", Diseases.YELLOW),
    new City("Sao Paulo", Diseases.YELLOW),
    new City("Seoul", Diseases.RED),
    new City("Shanghai", Diseases.RED),
    new City("St. Petersburg", Diseases.BLUE),
    new City("Sydney", Diseases.BLUE),
    new City("Taipei", Diseases.RED),
    new City("Tehran", Diseases.BLACK),
    new City("Tokyo", Diseases.RED),
    new City("Washington", Diseases.BLUE)
];

var InfectionCards = Cities.map(city => new InfectionCard(city));

var CityPlayerCards = Cities.map(city => new CityPlayerCard(city));

var FundingPlayerCards = [
    //todo
];


