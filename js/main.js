/*----- constants -----*/
const WORDS = [
    'ARRAY', 'FUNCTION', 'BINARY', 'VARIABLE', 'BOOLEAN', 'REACT', 'COMPUTER SCIENCE', 'TERMINAL', 'EVENTS'
]; 
const PANEL_WIDTH = 15; 
const MAX_WRONG_GUESSES = 6;
/*----- app's state (variables) -----*/
let secretWord;
let guessWord;
let gameStatus; // null = in progress; 👎 = lose; 👍 = win;
let wrongLetters;

/*----- cached element references -----*/
const guessEl = document.getElementById('guess');
const replayBtn = document.getElementById('replay');
const gallowsEl = document.getElementById('gallows');
const letterBtns = document.querySelectorAll('section > button');
const msgEl = document.getElementById('msg');
/*----- event listeners -----*/
document.querySelector('section').addEventListener('click', handleLetterClick);

document.getElementById('replay').addEventListener('click', init);

/*----- functions -----*/
init();

function handleLetterClick(e) {
    const letter = e.target.textContent;
    if (e.target.tagName !== 'BUTTON' || gameStatus) return;
    if (secretWord.includes(letter)) {
        let newGuess = '';
        for (let i = 0; i < secretWord.length; i++) {
            newGuess += secretWord.charAt(i) === letter ? letter : guessWord.charAt(i);
        }
        guessWord = newGuess;
    }   else {
        wrongLetters.push(letter);
    }
    gameStatus = getGameStatus();
    render();
}

function getGameStatus() {
    if (guessWord === secretWord) return '👍';
    if (wrongLetters.length === MAX_WRONG_GUESSES) return '👎'; 
    return null;
}

function render() {
    guessEl.textContent = guessWord;
    replayBtn.style.visibility = gameStatus ? 'visible' : 'hidden';
    gallowsEl.style.backgroundPositionX = `-${wrongLetters.length * PANEL_WIDTH}vmin`;
    renderButtons();
    renderMessage();
}

function renderMessage() {
    if (gameStatus === '👍') {
        msgEl.textContent = 'Congrats! You won!'
    } else if (gameStatus === '👎') {
        msgEl.textContent = 'GAME OVER'
    } else {
        const num = MAX_WRONG_GUESSES - wrongLetters.length; 
        msgEl.innerHTML = `<h2>Good luck!</h2><span> ${num} Wrong guess${num === 1 ? '' : 'es'} Ramaining</span>`;
    }
}

function renderButtons() {
    letterBtns.forEach(function(btn) {
        const letter = btn.textContent;
        btn.disabled = guessWord.includes(letter) || wrongLetters.includes(letter);
        if (guessWord.includes(letter)) {
            btn.className = 'valid-letter';
        } else if (wrongLetters.includes(letter)) {
            btn.className = 'wrong-letter';
        } else {
            btn.className = '';
        }
    });
}

function init() {
    const rndIdx = Math.floor(Math.random() * WORDS.length);
    secretWord = WORDS[rndIdx];
    guessWord = '';
    // init guessWord with underscores for each char in secretWord
    for (let char of secretWord) {
        guessWord += char === ' ' ? ' ' : '_';
    }
    // guessWord = secretWord.replace(/[A-Z]/g, '_');
    gameStatus = null;
    wrongLetters = [];
    render();
}