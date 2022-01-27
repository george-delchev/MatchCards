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

        cardArray.push(createCard(cardAttribute));
        cardArray.push(createCard(cardAttribute));
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

function createCard(cardAttribute) {
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.classList.add('back');
    newCard.setAttribute("card", cardAttribute);
    newCard.setAttribute("tabindex", 0);
    newCard.addEventListener('click', checkForMatch);
    return newCard;
}
let matchOne;
let matchTwo;

function checkForMatch(event) {

    let cardElement = event.target;

    let cardAttribute = cardElement.getAttribute("card");
    cardElement.style.background = setCardFrontSide(cardAttribute);

    cardElement.classList.toggle('back');
    cardElement.removeEventListener('click', checkForMatch);

    if (matchOne === undefined) {
        matchOne = cardElement;
    }
    else if (matchTwo === undefined) {
        numberOfTries++;
        numberOfTriesSpan.innerText = numberOfTries;
        matchTwo = cardElement;
        if (matchOne.getAttribute("card") === matchTwo.getAttribute("card")) {
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
    var allCards = document.querySelectorAll('.card.back');
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
        if (element.classList.contains('back')) {
            numberOfBacks++;
        }
    });
    if (numberOfBacks == 0) {
        alert("Grats!");
    }
}

function returnToNormal(element) {
    element.style.background = null;
    element.classList.toggle('back');
    element.addEventListener('click', checkForMatch);
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

// var randomButton = document.getElementById('random');
// randomButton.addEventListener('click', printRandomNumbers);
// function printRandomNumbers() {
//     const distribution = [];
//     let sumOfALL = 0;
//     for (let index = 1; index <= 52; index++) {
//         distribution.push(0);
//     };
//     console.log(distribution);
//     for (let index = 0; index < 10000; index++) {
//         let randomCard = getRandomCard();
//         distribution[randomCard - 1]++;
//     };
//     console.log(distribution);
//     distribution.forEach(element => {
//         console.log(element);
//         sumOfALL += element;
//     });
//     console.log(sumOfALL);
// }