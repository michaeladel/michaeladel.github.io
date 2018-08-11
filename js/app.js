// check if both cards are the same pattern
var checkCard = [];
// helper array for storing clicked cards IDs so i can remove "open" class if they are different
var cardID = [];
// number of moves to win the game
var moves = 0;
// for detecting if all cards are done
var totalCardsMatched = 0;
// selecting all cards to start the game
var cards = document.querySelectorAll(".card");
// selecting stars to modifiy rating
var stars = document.querySelector(".stars");
var modalStars = document.getElementsByClassName("stars")[1];
// to prevent show new card if card was opened when reset 
var checkRestart = false;
// number of clicks to initiate timer
var clicks = 0;
var minutesLabel = document.getElementsByClassName("minutes")[0];
var secondsLabel = document.getElementsByClassName("seconds")[0];
var modalMinutesLabel = document.getElementsByClassName("minutes")[1];
var modalSecondsLabel = document.getElementsByClassName("seconds")[1];
var totalSeconds = 0;
// the patterns for the cards
var patterns = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-anchor",
"fa fa-leaf", "fa fa-bicycle", "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle",
"fa fa-paper-plane-o", "fa fa-cube"];

function setTime() {
	if(clicks > 0) {
		++totalSeconds;
	} 
	secondsLabel.innerHTML = pad(totalSeconds % 60);
  	minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  	modalSecondsLabel.innerHTML = pad(totalSeconds % 60);
  	modalMinutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function startGame() {
	// stores the array of shuffled patterns
	const arr = shuffle(patterns);
	// appending patterns to the div with class "back"
	for (let i = 0; i < cards.length; i++) {
		let pattern = document.createElement("i");
		pattern.className = arr[i];
		// add pattern on each back of card
		cards[i].firstElementChild.lastElementChild.appendChild(pattern);
	}
	checkRestart = false;
}

function checkEnd() {
	//if all 16 cards are showed and matched
	if (totalCardsMatched === 16) {
		clicks = 0;
		document.getElementsByClassName("moves")[1].innerHTML = moves;
		$("#myModal").modal();
	}
}

function hideCards() {
	setTimeout(function() {
		// flip the card back
		$("#" + cardID[0]).removeClass("open");
		// second one flip back as well
		$("#" + cardID[1]).removeClass("open");
		$("#" + cardID[0]).removeClass("mismatch");
		$("#" + cardID[1]).removeClass("mismatch");
		//empty checking array for the next 2 cards
		checkCard = [];
		// same with this one
		cardID = [];
		// bind the click back again
		$(".card").on("click", handleClickEvent);
	}, 200)
}

function handleRating() {
	if(moves === 0  && clicks === 0) {
		stars.children[1].innerHTML ="<i class='fa fa-star'>";
		modalStars.children[1].innerHTML ="<i class='fa fa-star'>";
		stars.children[2].innerHTML ="<i class='fa fa-star'>";
		modalStars.children[2].innerHTML ="<i class='fa fa-star'>";
	}
	else if(moves > 16 && moves < 24) {
		stars.children[2].innerHTML ="<i class='fa fa-star-o'>";
		modalStars.children[2].innerHTML ="<i class='fa fa-star-o'>";
	} 
	else if(moves > 24) {
		stars.children[1].innerHTML ="<i class='fa fa-star-o'>";
		modalStars.children[1].innerHTML ="<i class='fa fa-star-o'>";
	}
}

function check() {
	// if cards are clicked 2 times we are doing check
	if (checkCard.length === 2) {
		// disabling click event
		$(".card").off("click", handleClickEvent);
		setTimeout(function() {
			// if there is  no match
			if (checkCard[0] !== checkCard[1]) {
				$("#" + cardID[0]).addClass("mismatch");
				$("#" + cardID[1]).addClass("mismatch");
				// add moves counter
				moves++;
				handleRating();
				// hide cards logic
				hideCards();
			} else {
				// flip the card back
				$("#" + cardID[0]).addClass("match");
				// second one flip back as well
				$("#" + cardID[1]).addClass("match");
				// if there is a match "end" is raised by 2 as 2 cards are uncovered
				totalCardsMatched += 2;
				// empty array for the next try
				checkCard = [];
				// empty array for the next try-
				cardID = [];
				// add moves counter
				moves++;
				handleRating();
				// check if game has eneded
				checkEnd();
				// bind click again
				$(".card").on("click", handleClickEvent);
			}
			// bind moves counter
			document.querySelector(".moves").innerHTML = moves;
		}, 500);
	}
}

function handleClickEvent(event) { 
	clicks++;
	// initiate timer start at first click
	if(clicks === 1)
	{	
		var timeInterval = setInterval(setTime, 1000);
	}
	//  prevet clicking more than 2 times at one card
	if ($(this).hasClass("open")) {
		return;
	}
	$(this).addClass("open");
	console.log($(this).attr("id"))
	checkCard.push($(this).find("i").attr("class"));
	cardID.push($(this).attr("id"));
	check();
}
$(".card").on("click", handleClickEvent);

function restart() {
	if(checkRestart === false)
	{
		// remove open class so they can flip back again at the starting position
		$(".card").removeClass("open");
		$(".card").removeClass("match");
		//remove all current pattern from the card
		$(".back").find("i").remove();
		// empty check array
		checkCard = [];
		// empty IDs check array
		cardID = [];
		// reset counter
		moves = 0;
		document.querySelector(".moves").innerHTML = moves;
		// reset ending variable
		totalCardsMatched = 0;
		// reset timer 
		clicks = 0;
		totalSeconds = 0;
		handleRating();
		// to prevent show new card if card was opened when reset 
		checkRestart = true;
		setTimeout(function() { 
			startGame();
		}, 500)
	}
}
function playAgain() {
	$('#myModal').modal('toggle');
	restart();
}
$(".restart").on("click", restart);

$(document).ready(function(){
	startGame();
});