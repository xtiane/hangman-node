const Word = require('./word');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

const characterNames = [
	'Mario',
	'Lara Croft',
	'Samus Aran',
	'Link',
	'Master Chief',
	'Kratos',
	'Gordon Freeman',
	'Nathan Drake',
	'Luigi',
	'Pikachu',
	'Sephiroth',
	'Glados',
	'Jill Valentine',
	'Marcus Fenix',
	'Cloud Strife',
	'Princess Zelda',
	'Niko Bellic',
	'Yoshi',
	'Ganon',
	'Subzero',
	'Ryu Hayabusa',
	'Fox McCloud',
	'Toad',
	'Donkey Kong',
	'Sonic The Hedgehog',
	'Crash Bandicoot',
	'Earthworm Jim',
	'Rayman',
	'Diddy Kong',
	'Bowser',
	'Megaman',
	'Max Payne',
	'Pacman',
	'Duke Nukem'
];

const maxGuessesAllowed = 10;

// Start the game
// IIFE function
(function() {
	displayTitle();
})();

function initializeGame() {
	// Randomly select a word
	let currentWord = new word(selectRandomCharacterName());

	playGame(0, currentWord);
}

function playGame(totalGuesses, theWord) {
	theWord.displayWord();

	if (theWord.hasWordBeenGuessed()) {
		displayWinOrLose(true);

		return;
	}

	if (totalGuesses < maxGuessesAllowed) {
		displayHUD(totalGuesses, theWord);

		inquirer
			.prompt([
				// User prompts go here
				{
					type: 'input',
					name: 'userInput',
					message: "What's your guess?",
					validate: function(input) {
						let pass = input.match(/^[a-zA-Z]/i);

						if (pass) {
							if (input.length > 1) {
								return 'Only single letters are allowed.';
							} else if (theWord.letterHasBeenUsed(input) === false) {
								return true;
							} else {
								return (
									"The letter '" +
									input +
									"' has already been used.  Try another one."
								);
							}
						}

						return 'Invalid character entered, only letters are valid.';
					}
				}
			])
			.then(answers => {
				totalGuesses++;

				theWord.takeGuess(answers.userInput);

				// Store this guess
				theWord.lettersGuessed.push(answers.userInput);

				// Recursive call
				playGame(totalGuesses, theWord);
			});
	} else {
		displayWinOrLose(false);
	}
}

// Randomly selects a name from the array of names
function selectRandomCharacterName() {
	return characterNames[Math.floor(Math.random() * characterNames.length)];
}

// Displays information to the user
function displayHUD(totalGuesses, theWord) {
	console.log(
		chalk.whiteBright('\nThis is guess #'),
		chalk.yellowBright(totalGuesses + 1)
	);
	console.log(
		chalk.whiteBright('Current guesses: '),
		chalk.yellowBright(theWord.lettersGuessed)
	);
	console.log(
		chalk.whiteBright('Number of Guesses Remaining: '),
		chalk.yellowBright(maxGuessesAllowed - totalGuesses, '\n')
	);
}

// Display win or lose
function displayWinOrLose(isWinner) {
	if (isWinner) {
		figlet('You Win!', function(err, data) {
			if (err) {
				throw err;
			}

			console.log(data);

			playAgainPrompt();
		});
	} else {
		figlet('You Lose!', function(err, data) {
			if (err) {
				throw err;
			}

			console.log(data);

			playAgainPrompt();
		});
	}
}

// Display ascii art title
function displayTitle() {
	figlet('HANGMAN', function(err, word) {
		if (err) {
			throw err;
		}
		console.log(word);

		figlet('Video Game', function(err, word) {
			if (err) {
				throw err;
			}

			console.log(word);

			figlet('Characters', function(err, word) {
				if (err) {
					throw err;
				}

				console.log(word);

				initializeGame();
			});
		});
	});
}

// Displays play again prompt
function playAgainPrompt() {
	inquirer
		.prompt([
			// User prompts go here
			{
				type: 'confirm',
				name: 'playAgain',
				message: 'Would you like to play again?',
				default: 'Yes'
			}
		])
		.then(answers => {
			if (answers.playAgain) {
				initializeGame();
			} else {
				console.log(chalk.greenBright('OK, maybe next time.'));
			}
		});
}

//====================================//
// Test function section
//====================================//
function testWordGeneration() {
	const randomWord = selectRandomCharacterName();

	console.log(randomWord);

	let currentWord = new word(randomWord);

	currentWord.displayWord();
}

function testPrintWord(printThisWord) {
	printThisWord.word.map(ltr => {
		console.log(ltr.letter, ' ==> ', ltr.hasBeenGuessed);
	});
}

function testChalk() {
	console.log(chalk.blue('Hello World!'));
}

function testFiglet() {
	figlet('Hello World!!', function(err, data) {
		if (err) {
			console.log('Something went wrong...');
			console.dir(err);
			return;
		}
		console.log(data);
	});
}
