const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const computerChoiceElement = document.getElementById('computerChoice');
const userChoiceElement = document.getElementById('userChoice');
const winnerElement = document.getElementById('winner');
const userScoreElement = document.getElementById('userScore');
const computerScoreElement = document.getElementById('computerScore');
const startGameButton = document.getElementById('startGame');
const stopGameButton = document.getElementById('stopGame');
const toggleModeButton = document.getElementById('toggleMode');
const recentMovesElement = document.getElementById('recentMoves');
const countdownOverlay = document.getElementById('countdown-overlay');
const chooseRockButton = document.getElementById('chooseRock');
const choosePaperButton = document.getElementById('choosePaper');
const chooseScissorsButton = document.getElementById('chooseScissors');

let userScore = 0;
let computerScore = 0;
let isDarkMode = false;
const winningScore = 3; // Score needed to win the game
const recentMoves = [];
let isFirstRound = true; // Flag to track if it's the first round

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

let camera = null;

function startCamera() {
  if (!camera) {  // Ensure the camera is only started once
    camera = new Camera(webcamElement, {
      onFrame: async () => {
        await hands.send({ image: webcamElement });
      },
      width: 640,
      height: 480
    });
    camera.start();
  }
}

function stopCamera() {
  if (camera) {
    camera.stop();
    camera = null;
    webcamElement.srcObject = null;
  }
}

function onResults(results) {
  const canvasCtx = canvasElement.getContext('2d');
  canvasElement.width = webcamElement.videoWidth;
  canvasElement.height = webcamElement.videoHeight;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const choice = getUserChoice(landmarks);
    userChoiceElement.textContent = choice;
  }

  canvasCtx.restore();
}

function getUserChoice(landmarks) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];

  const thumbIndexDistance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
  const indexMiddleDistance = Math.hypot(indexTip.x - middleTip.x, indexTip.y - middleTip.y);

  if (thumbIndexDistance < 0.1) {
    return 'Stein';
  } else if (indexMiddleDistance < 0.1) {
    return 'Schere';
  } else {
    return 'Papier';
  }
}

function getComputerChoice() {
  const choices = ['Stein', 'Papier', 'Schere'];
  return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return 'Unentschieden';
  }
  if (
    (userChoice === 'Stein' && computerChoice === 'Schere') ||
    (userChoice === 'Schere' && computerChoice === 'Papier') ||
    (userChoice === 'Papier' && computerChoice === 'Stein')
  ) {
    return 'Benutzer';
  }
  return 'Computer';
}

function updateScore(winner) {
  if (winner === 'Benutzer') {
    userScore++;
    userScoreElement.textContent = userScore;
  } else if (winner === 'Computer') {
    computerScore++;
    computerScoreElement.textContent = computerScore;
  }
}

function updateRecentMoves(userChoice, computerChoice) {
  const emojis = {
    'Stein': '✊',
    'Papier': '✋',
    'Schere': '✌️'
  };

  recentMoves.push(`${emojis[userChoice]} vs ${emojis[computerChoice]}`);
  if (recentMoves.length > 5) {
    recentMoves.shift();
  }

  recentMovesElement.innerHTML = recentMoves.map(move => `<span>${move}</span>`).join('');
}

function startRound() {
  let countdown = isFirstRound ? 7 : 3; // 7 seconds for the first round, 3 seconds for subsequent rounds
  countdownOverlay.style.opacity = 1; // Show overlay initially
  const countdownInterval = setInterval(() => {
    countdownOverlay.textContent = `Zeit bis zur Wahl: ${countdown}`;
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);
      countdownOverlay.style.opacity = 0; // Hide overlay after countdown

      const computerChoice = getComputerChoice();
      const userChoice = userChoiceElement.textContent || 'Keine Wahl';

      computerChoiceElement.textContent = computerChoice;
      const winner = determineWinner(userChoice, computerChoice);
      winnerElement.textContent = winner;

      updateScore(winner);
      updateRecentMoves(userChoice, computerChoice);

      if (userScore >= winningScore || computerScore >= winningScore) {
        const finalWinner = userScore > computerScore ? 'Benutzer' : 'Computer';
        alert(`Spiel vorbei! Gewinner: ${finalWinner}`);
        stopCamera(); // Stop camera when the game is over
      } else {
        isFirstRound = false; // After the first round, set this to false
        setTimeout(startRound, 3000); // Pause for 3 seconds before starting the next round
      }
    }
  }, 1000);
}

function startGame() {
  userScore = 0;
  computerScore = 0;
  userScoreElement.textContent = userScore;
  computerScoreElement.textContent = computerScore;
  recentMoves.length = 0;
  recentMovesElement.innerHTML = '';

  isFirstRound = true; // Reset the first round flag when starting a new game

  try {
    startCamera();
  } catch (error) {
    alert('Kamerazugriff verweigert oder nicht verfügbar. Du kannst trotzdem mit den Buttons spielen.');
  }
  startRound();
}

function makeManualChoice(choice) {
  userChoiceElement.textContent = choice;
}

startGameButton.addEventListener('click', startGame);

stopGameButton.addEventListener('click', () => {
  stopCamera();
  winnerElement.textContent = 'Spiel beendet';
});

toggleModeButton.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.documentElement.style.setProperty('--background-color', '#2e2e2e');
    document.documentElement.style.setProperty('--text-color', '#ffffff');
    document.documentElement.style.setProperty('--button-background-color', '#444444');
    document.documentElement.style.setProperty('--button-hover-color', '#555555');
    document.documentElement.style.setProperty('--table-header-color', '#555555');
    toggleModeButton.textContent = 'Wechseln zu Lichtmodus';
  } else {
    document.documentElement.style.setProperty('--background-color', '#ffffff');
    document.documentElement.style.setProperty('--text-color', '#0a0a0a');
    document.documentElement.style.setProperty('--button-background-color', '#0096db');
    document.documentElement.style.setProperty('--button-hover-color', '#00aeff');
    document.documentElement.style.setProperty('--table-header-color', '#0096db');
    toggleModeButton.textContent = 'Wechseln zu Dunkelmodus';
  }
});

chooseRockButton.addEventListener('click', () => makeManualChoice('Stein'));
choosePaperButton.addEventListener('click', () => makeManualChoice('Papier'));
chooseScissorsButton.addEventListener('click', () => makeManualChoice('Schere'));
