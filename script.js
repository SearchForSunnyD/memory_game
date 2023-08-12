// Get necessary elements from the DOM
const gameContainer = document.getElementById("game");
const sliderValue = document.querySelector('#color');
const value = document.querySelector('#slider');
const bestScore = document.querySelector('#best');
const yourScore = document.querySelector('#your');

// Initialize color array
const COLORS = [];

// Update slider value display on input change
sliderValue.addEventListener('input', function() {
    value.innerText = `Current: ${sliderValue.value * 2} tiles`;
});

// Generate randomized colors based on slider value
function createColors() {
    for (let i = 0; i < sliderValue.value; i++) {
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        while (randomColor.length < 6) {
            randomColor = '0' + randomColor;
        }
        for (let j = 0; j < 2; j++) {
            COLORS.push(`#${randomColor}`);
        }
    }
}

// Initialize game when "Start Game" button is clicked
function startGame() {
    const start = document.createElement('button');
    start.classList.add('btn');
    start.innerText = 'Start Game!';
    gameContainer.style.display = "none";
    const b = document.querySelector('body');
    b.appendChild(start);
    sliderValue.style.display = '';

    start.addEventListener("click", function() {
        gameContainer.style.display = "";
        sliderValue.style.display = 'none';
        start.style.display = 'none';
        COLORS.length = 0
        createColors();
        let shuffledColors = shuffle(COLORS);
        createDivsForColors(shuffledColors);
        yourScore.innerText = `Your Score: 0`
    });
}

// Helper function to shuffle an array
function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

// Initialize scores
let c = 0;
if (localStorage.getItem("Score")) {
    bestScore.innerText = `Best Score: ${localStorage.getItem("Score")}`;
} else {
    localStorage.setItem('Score', 0);
}

// Update score display
function score(count) {
    if (count === true) {
        c++;
        yourScore.innerText = `Your Score: ${Math.floor(c / 2)}`;
    } else {
        yourScore.innerText = `Your Score: 0`;
        c++;
        if (c < parseInt(localStorage.getItem("Score")) || parseInt(localStorage.getItem("Score")) === 0) {
            localStorage.setItem('Score', `${Math.floor(c / 2)}`);
            bestScore.innerText = `Best Score: ${localStorage.getItem("Score")}`;
        }
    }
}

// Create color divs for the game
function createDivsForColors(colorArray) {
    for (let color of colorArray) {
        const newDiv = document.createElement("div");
        newDiv.classList.add(color);
        newDiv.setAttribute('id',"panel");
        newDiv.addEventListener("click", handleCardClick);
        gameContainer.append(newDiv);
    }
}

// Handle card click event
let isListening = true;
function handleCardClick(event) {
    if (isListening === false) {
        return;
    }
    isListening = false;

    // Check if the card has already been selected or matched
    if (event.target.getAttribute('isSelected') === 'true' || event.target.getAttribute('isMatched') === 'true') {
        console.log('Already Selected');
    } else {
        event.target.setAttribute('isSelected', 'true');
        event.target.style.backgroundColor = event.target.getAttribute('class');
    }
    
    // Compare selected cards after a delay
    setTimeout(function() {
        if (document.querySelectorAll('[isSelected]').length > 1) {
            let compare = document.querySelectorAll('[isSelected]');
            if (compare[0].getAttribute('class') === compare[1].getAttribute('class')) {
                compare[0].setAttribute('isMatched', 'true');
                compare[1].setAttribute('isMatched', 'true');
            } else {
                compare[0].style.backgroundColor = '';
                compare[1].style.backgroundColor = '';
            }
            compare[0].removeAttribute('isSelected');
            compare[1].removeAttribute('isSelected');
        }
        isListening = true;
        gameComplete();
    }, 500);
}

// Check for game completion
function gameComplete() {
    if (document.querySelectorAll('[isMatched]').length >= document.querySelectorAll("#panel").length) {
        let clear = document.querySelectorAll('[isMatched]');
        for (let div of clear) {
            div.remove();
        }
        let count = false;
        score(count);
        startGame();
    }
    let count = true;
    score(count);
}

// Initialize the game when the DOM loads
startGame();
