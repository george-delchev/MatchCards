const cardsArea = document.getElementById("cardsArea");
let numberOfTries = 0;
let numberOfCards = 8;

class CardPair {
  constructor(cardImage, cardData) {
    this.cardImage = cardImage;
    this.cardData = cardData;
    this.matched = false;
    let color = getRandomColor();
    this.cardOne = new Card(this.cardImage, this.cardData, color);
    this.cardTwo = new Card(this.cardImage, this.cardData, color);

    this.cardHolderOne = this.createCardPair(this.cardOne);
    this.cardHolderTwo = this.createCardPair(this.cardTwo);
  }
  createCardPair = function (card) {
    const newCardHolder = document.createElement("div");
    newCardHolder.classList.add("cardHolder");

    newCardHolder.appendChild(card.frontSide);
    newCardHolder.appendChild(card.backSide);

    return newCardHolder;
  };
}
class Card {
  constructor(cardImage, cardData, color) {
    this.cardData = cardData;
    this.cardImage = cardImage;
    this.cardColor = color;
    this.frontSide = this.createFrontSide();
    this.backSide = this.createBackSide();
    this.setCardFrontSide();
  }
  createFrontSide = function () {
    const newCardFront = document.createElement("div");
    newCardFront.classList.add("card");
    newCardFront.classList.add("card-rotate-opposite");
    return newCardFront;
  };
  createBackSide = function () {
    const newCardBack = document.createElement("div");
    newCardBack.classList.add("card");
    newCardBack.classList.add("card-back");
    newCardBack.setAttribute("card-id", this.cardData);
    newCardBack.addEventListener("click", checkForMatch);

    return newCardBack;
  };
  checkForMatch = function (e) {
    console.log("checkForMatch: " + this);
  };
  setCardFrontSide = function () {
    switch (cardType) {
      case "color":
        this.frontSide.style.background = this.cardColor;
        break;
      case "cards":
        this.frontSide.style.backgroundImage = `url(${this.cardImage})`;
        break;
      default:
        alert("WRONG CARD TYPE");
        break;
    }
  };
}
//set type of card
let cardType = "cards";
let deckId;
const cardsTypeButtons = document.querySelectorAll("#card-type");
cardsTypeButtons.forEach((e) => e.addEventListener("change", setCardType));
function setCardType(e) {
  console.log(e.target.value);
  cardType = e.target.value;
  addCardsToArea();
  if (cardType === "cards") {
    shuffleCardDeckAPI();
  }
}
window.addEventListener("load", async () => {
  getCardDeckAPI()
    .then((res) => shuffleCardDeckAPI())
    .then((res) => addCardsToArea());
});
async function getCardDeckAPI() {
  deckId = localStorage.getItem("deckId");

  if (!deckId) {
    const url = `https://www.deckofcardsapi.com/api/deck/new?jokers_enabled=true`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        deckId = data.deck_id;
        localStorage.setItem("deckId", deckId);
      })
      .catch((err) => {
        alert(`error: ${err}`);
      });
  }
}
async function shuffleCardDeckAPI() {
  if (deckId) {
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(`Deck ${data.deck_id} shuffled: ${data.shuffled}`);
      })
      .catch((err) => {
        alert(`error: ${err}`);
      });
  } else {
    getCardDeckAPI();
  }
}

const numberOfTriesSpan = document.getElementById("numberOfTries");

let delayTime = 500;

const cardsButtons = document.querySelectorAll("#card-number");
cardsButtons.forEach((element) => {
  element.addEventListener("change", function (e) {
    numberOfCards = parseInt(e.target.value);
    shuffleCardDeckAPI().then((res) => addCardsToArea());
  });
});

const resetButton = document.querySelector("#game-reset");
resetButton.addEventListener("click", function () {
  shuffleCardDeckAPI().then((res) => addCardsToArea());
});
let cardsObjects = [];
let cardsInPlay = [];
async function addCardsToArea() {
  cardsArea.innerHTML = "";
  cardsObjects = [];
  cardsInPlay = [];
  numberOfTries = 0;
  numberOfTriesSpan.innerText = numberOfTries;

  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${
    numberOfCards / 2
  }`;
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.cards.forEach((x) => {
        let cardPair = new CardPair(x.image, x.code);
        cardsObjects.push(cardPair);
        cardsInPlay.push(cardPair.cardHolderOne);
        cardsInPlay.push(cardPair.cardHolderTwo);
      });
    })
    .then(() => {
      cardsInPlay = shuffleCards(cardsInPlay);
      let promise = Promise.resolve();
      cardsInPlay.forEach(function (element) {
        promise =  promise.then(function () {
          cardsArea.appendChild(element);
          return new Promise(function (resolve) {
            setTimeout(resolve, 50);
          });
        });
      });
      promise.then(function () {});
    })
    .catch((err) => {
      alert(`error: ${err}`);
    });
}

function shuffleCards(cardArray) {
  for (let index = cardArray.length - 1; index > 0; index--) {
    var j = Math.floor(Math.random() * (index + 1));
    var temp = cardArray[index];
    cardArray[index] = cardArray[j];
    cardArray[j] = temp;
  }
  return cardArray;
}
let cardElementOne;
let cardElementTwo;

function checkForMatch(event) {
  const cardElement = event.target;

  let holderElement = cardsInPlay.find(
    (card) => card.lastChild === cardElement
  );
  holderElement.firstChild.classList.remove("card-rotate-opposite");
  holderElement.lastChild.classList.add("card-rotate");
  holderElement.lastChild.removeEventListener("click", checkForMatch);

  if (cardElementOne === undefined) {
    cardElementOne = holderElement;
  } else if (cardElementTwo === undefined) {
    numberOfTries++;
    numberOfTriesSpan.innerText = numberOfTries;
    cardElementTwo = holderElement;
    checkForMatchInner(cardElementOne, cardElementTwo);
    resetMatches();
  }
  checkForWinner();
}

function checkForMatchInner(elementOne, elementTwo) {
  if (
    elementOne.lastChild.getAttribute("card-id") ===
    elementTwo.lastChild.getAttribute("card-id")
  ) {
    const cardId = elementOne.lastChild.getAttribute("card-id");
    var cardPair = cardsObjects.find((x) => x.cardData === cardId);
    cardPair.matched = true;
  } else {
    setTimeout(() => {
      returnToNormal(elementOne);
      returnToNormal(elementTwo);
    }, delayTime);
  }
}

function checkForWinner() {
  if (!cardsObjects.some((x) => x.matched === false)) {
    let playAgain = confirm("You win! Want to play again?");
    if (playAgain) {
      shuffleCardDeckAPI().then((res) => addCardsToArea());
    }
  }
}

function returnToNormal(element) {
  element.firstChild.classList.add("card-rotate-opposite");
  element.lastChild.classList.remove("card-rotate");
  element.lastChild.addEventListener("click", checkForMatch);
}

function resetMatches() {
  cardElementOne = undefined;
  cardElementTwo = undefined;
}

function getRandomColor() {
  let randomRed = getRandomNumber(255);
  let randomGreen = getRandomNumber(255);
  let randomBlue = getRandomNumber(255);
  return `rgb(${randomRed},${randomGreen},${randomBlue})`;
}
function getRandomNumber(number) {
  return Math.floor(Math.random() * number);
}
