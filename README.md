# Match Two Card Game

Simple match two card game.

**Link to project:** https://match-two.netlify.app/

![alt tag](https://i.imgur.com/iqaru9F.png)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript

Basic html and css to display the cards and javascript to populate based on the chosen cards/number.
Using the https://www.deckofcardsapi.com/ to get random cards from a deck and their images.
Javascript matches the cards by a custom card-id attribute.

## Optimizations

I was originally planning to host the card images myself, and pick a random number and change the background accordingly but then I found the deckofcards api and decided using it was better. Also makes choosing random cards better since it takes care of duplicates.
The design was also completely different, I was going for a poker table look with the buttons styled like chips but didn't look good so I switched in to a more simple design.

## Lessons Learned:

I learned there are tons of APIs out there that you can use to build cool stuff with. 
The rest was just practice of mostly basic stuff, nothing groundbreaking.

## Things to improve:

--add better winning message
--use knockout? - for matching and displaing cards
--top score? - add history with top5 score, maybe change the score to show total wrong tries?
--fix timeouts, as in remove - currently have timeouts as you click through cards to allow the styles to be removed/added correctly after the checks, find a way to remove them.
