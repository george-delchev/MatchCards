window.addEventListener('load', () => {
    addCardsToArea();
});
const cardsArea = document.getElementById('cardsArea');
const numberOfTriesSpan = document.getElementById('numberOfTries');

let numberOfTries = 0;
let typeOfCard = 'color';
let delayTime = 500;
let numberOfCards = 8;

const cardsButtons = document.querySelectorAll('.getCardButton');
cardsButtons.forEach(element => {
    element.addEventListener('click', function (e) {
        numberOfCards = parseInt(e.target.id);
        addCardsToArea()
    });
});
const cardsTypeButtons = document.querySelectorAll('.cardType');
console.log(cardsTypeButtons)
cardsTypeButtons.forEach(element => {
    element.addEventListener('click', addCardsToArea);
});

function addCardsToArea() {
    console.log('addCardsToArea')
    numberOfTries = 0;
    numberOfTriesSpan.innerText = 0;
    cardsArea.innerHTML = '';
    let cardArray = [];

    for (let index = 0; index < numberOfCards; index = index + 2) {
        let cardAttribute;
        let cardsWithAttr;
        do {
            cardsWithAttr = undefined;
            cardAttribute = getRandomCard();
            cardsWithAttr = document.querySelectorAll(`.card[card='${cardAttribute}']`);
        } while (cardsWithAttr.length > 0)

        cardArray.push(createCard(cardAttribute, 1));
        cardArray.push(createCard(cardAttribute, 2));
    }

    cardArray = shuffleCards(cardArray);
    let promise = Promise.resolve();
    cardArray.forEach(function (element) {
        promise = promise.then(function () {
        cardsArea.appendChild(element);
        return new Promise(function (resolve) {
                setTimeout(resolve, 50);
            });
        });
    });
    promise.then(function () {
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

function createCard(cardAttribute, pair) {
    const newCardHolder = document.createElement('div');
    newCardHolder.classList.add('cardHolder');

    const newCardBack = document.createElement('div');
    newCardBack.classList.add('card');
    newCardBack.classList.add('card-back');
    newCardBack.classList.add('incorrect');
    newCardBack.setAttribute("card", cardAttribute);
    newCardBack.setAttribute("pair", cardAttribute+pair);
    newCardBack.setAttribute("tabindex", 0);
    newCardBack.addEventListener('click', checkForMatch);
    newCardHolder.appendChild(newCardBack);

    const newCardFront = document.createElement('div');
    newCardFront.classList.add('card');
    newCardFront.classList.add('card-front');
    newCardFront.classList.add('card-rotate-opposite');
    newCardFront.style.background = setCardFrontSide(cardAttribute);
    newCardFront.setAttribute("card", cardAttribute);
    newCardFront.setAttribute("pair", cardAttribute+pair);
    newCardFront.setAttribute("tabindex", 0);
    newCardHolder.appendChild(newCardFront);

    return newCardHolder;
}
let matchOne;
let matchTwo;

function checkForMatch(event) {
    const cardElement = event.target;

    const cardAttribute = cardElement.getAttribute("pair");
    const cardFront = document.querySelector(`.card-front[pair='${cardAttribute}']`);
    cardFront.classList.toggle('card-rotate-opposite');
    cardElement.classList.toggle('card-rotate');
    cardElement.removeEventListener('click', checkForMatch);
    console.log(matchOne);
    console.log(matchTwo);

    if (matchOne === undefined) {
        matchOne = cardElement;
    }
    else if (matchTwo === undefined) {
        numberOfTries++;
        numberOfTriesSpan.innerText = numberOfTries;
        matchTwo = cardElement;
        if (matchOne.getAttribute("card") === matchTwo.getAttribute("card")) {
            matchOne.classList.remove('incorrect');
            matchTwo.classList.remove('incorrect');
            resetMatches();
        } else {
            disableEnableEventListeners();
            setTimeout(function () {
                returnToNormal(matchTwo);
                returnToNormal(matchOne);
                resetMatches();
            }, delayTime);
        }
    }
    checkForWinner();
}
function disableEnableEventListeners() {
    var allCards = document.querySelectorAll('.card.card-back');
    allCards.forEach(element => {
        element.removeEventListener('click', checkForMatch);
    });
    setTimeout(function () {
        allCards.forEach(element => {
            element.addEventListener('click', checkForMatch);
        });
    }, delayTime);
}
function checkForWinner() {
    let numberOfBacks = 0;
    var allCards = document.querySelectorAll('.card');
    allCards.forEach(element => {
        if (element.classList.contains('incorrect')) {
            numberOfBacks++;
        }
    });
    if (numberOfBacks == 0) {
        alert("Grats!");
    }
}

function returnToNormal(cardElement) {
    const cardAttribute = cardElement.getAttribute("pair");
    const cardFront = document.querySelector(`.card-front[pair='${cardAttribute}']`);
    cardFront.classList.toggle('card-rotate-opposite');
    cardElement.classList.toggle('card-rotate');
    cardElement.addEventListener('click', checkForMatch);
}
function resetMatches() {
    matchOne = undefined;
    matchTwo = undefined;
}
function getRandomCard() {
    var cardTypesElements = document.querySelector('.cardType:checked');
    typeOfCard = cardTypesElements.value;

    switch (typeOfCard) {
        case 'color':
            return getRandomColor();
        case 'cards':
            return getRandomNumber(52) + 1;
        default:
            alert("WRONG CART TYPE");
            break;
    }

}
function setCardFrontSide(cardAttribute) {
    var cardTypesElements = document.querySelector('.cardType:checked');
    typeOfCard = cardTypesElements.value;

    switch (typeOfCard) {
        case 'color':
            return cardAttribute;
        case 'cards':
            let cardNumber = parseInt(cardAttribute);
            return `rgb(${cardNumber}, 0, 0)`;
        default:
            alert("WRONG CART TYPE");
            break;
    }
}
function getRandomColor() {
    let randomRed = getRandomNumber(255);
    let randomGreen = getRandomNumber(255);
    let randomBlue = getRandomNumber(255);
    return `rgb(${randomRed},${randomGreen},${randomBlue})`

}
function getRandomNumber(number) {
    return Math.floor(Math.random() * number);
}