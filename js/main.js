let numberOfTries = 0;
let numberOfCards = 8;
let cardType = "cards";
let delayTime = 500;
let deckId;

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
async function makeRequestToAPI(url) {
  let response = await fetch(url);
  if (!response.ok) {
    alert(`HTTP error! status: ${response.status}`);
    return;
  }
  return response;
}
async function getCardDeckAPI() {
  deckId = localStorage.getItem("deckId");

  if (!deckId) {
    const url = `https://www.deckofcardsapi.com/api/deck/new?jokers_enabled=true`;
    let response = await makeRequestToAPI(url);
    let data = await response.json();

    deckId = data.deck_id;
    localStorage.setItem("deckId", deckId);
  }
}
async function shuffleCardDeckAPI() {
  if (deckId) {
    const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/`;
    let response = await makeRequestToAPI(url);
    let data = await response.json();
    console.log(`Deck ${data.deck_id} shuffled: ${data.shuffled}`);
  } else {
    getCardDeckAPI();
  }
}
async function getCardsAPI() {
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${
    numberOfCards / 2
  }`;
  let response = await makeRequestToAPI(url);
  let data = await response.json();
  return data;
}

const cardsArea = document.getElementById("cardsArea");
const cardsTypeButtons = document.querySelectorAll("#card-type");
const cardsButtons = document.querySelectorAll("#card-number");
const resetButton = document.querySelector("#game-reset");
const numberOfTriesSpan = document.getElementById("numberOfTries");

window.addEventListener("load", async () => {
  await getCardDeckAPI();
  await shuffleAndAddCardsToArea();
});
cardsButtons.forEach((element) => {
  element.addEventListener("change", async (e) => {
    numberOfCards = parseInt(e.target.value);
    await shuffleAndAddCardsToArea();
  });
});
cardsTypeButtons.forEach((element) => {
  element.addEventListener("change", async (e) => {
    cardType = e.target.value;
    await shuffleAndAddCardsToArea();
  });
});
resetButton.addEventListener("click", async () => {
  await shuffleAndAddCardsToArea();
});

async function shuffleAndAddCardsToArea() {
  await shuffleCardDeckAPI();
  await addCardsToArea();
}

let cardsObjects = [];
let cardsInPlay = [];
async function addCardsToArea() {
  resetBoard();
  await createCards();
  shuffleCards();
  await placeCards();
}
function resetBoard() {
  cardsArea.innerHTML = "";
  cardsObjects = [];
  cardsInPlay = [];
  numberOfTries = 0;
  numberOfTriesSpan.innerText = numberOfTries;
}
async function createCards(params) {
  let data = await getCardsAPI();
  data.cards.forEach((x) => {
    let cardPair = new CardPair(x.image, x.code);
    cardsObjects.push(cardPair);
    cardsInPlay.push(cardPair.cardHolderOne);
    cardsInPlay.push(cardPair.cardHolderTwo);
  });
}
function shuffleCards() {
  for (let index = cardsInPlay.length - 1; index > 0; index--) {
    var j = Math.floor(Math.random() * (index + 1));
    [cardsInPlay[index], cardsInPlay[j]] = [cardsInPlay[j], cardsInPlay[index]];
  }
}
async function placeCards() {
  for (let e of cardsInPlay) {
    await wait(50);
    await cardsArea.appendChild(e);
  }
}
async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
let cardElementOne;
let cardElementTwo;

function checkForMatch(event) {
  const cardElement = event.target;

  let holderElement = cardsInPlay.find(
    (card) => card.lastChild === cardElement
  );
  holderElement.firstChild.classList.add("card-selected");
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
  element.firstChild.classList.remove("card-selected");
  element.firstChild.classList.add("card-rotate-opposite");
  element.lastChild.classList.remove("card-rotate");
  element.lastChild.addEventListener("click", checkForMatch);
}

function resetMatches() {
  cardElementOne.firstChild.classList.remove("card-selected");
  cardElementTwo.firstChild.classList.remove("card-selected");
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
