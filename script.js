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
const manualControls = document.getElementById('manual-controls');
const chooseRockButton = document.getElementById('chooseRock');
const choosePaperButton = document.getElementById('choosePaper');
const chooseScissorsButton = document.getElementById('chooseScissors');
const showInstructionsButton = document.getElementById('showInstructions');
const closeInstructionsButton = document.getElementById('closeInstructions');
const instructionsOverlay = document.getElementById('instructions-overlay');

let userScore = 0;
let computerScore = 0;
let isDarkMode = false;
const winningScore = 3; // Score needed to win the game
const recentMoves = [];
let countdownInterval; // Store the countdown interval
let cameraStream = null;
let isFirstRound = true;

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

function startCamera() {
  if (cameraStream === null) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        cameraStream = stream;
        webcamElement.srcObject = stream;
        manualControls.style.display = 'none';
        startCameraStream();
      })
      .catch(() => {
        manualControls.style.display = 'block';
      });
  }
}

function startCameraStream() {
  const camera = new Camera(webcamElement, {
    onFrame: async () => {
      await hands.send({ image: webcamElement });
    },
    width: 640,
    height: 480
  });
  camera.start();
}

function stopCamera() {
  if (cameraStream !== null) {
    const tracks = cameraStream.getTracks();
    tracks.forEach(track => track.stop());
    cameraStream = null;
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
  // Extract landmarks for fingers
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  // Extract the base points to compare the extensions
  const thumbBase = landmarks[2];
  const indexBase = landmarks[5];
  const middleBase = landmarks[9];
  const ringBase = landmarks[13];
  const pinkyBase = landmarks[17];

  // Calculate distances to check if fingers are extended
  const isIndexExtended = indexTip.y < indexBase.y;
  const isMiddleExtended = middleTip.y < middleBase.y;
  const isRingExtended = ringTip.y < ringBase.y;
  const isPinkyExtended = pinkyTip.y < pinkyBase.y;
  const isThumbExtended = thumbTip.x > indexBase.x; // Checks if thumb is pointing sideways

  // Check for Rock gesture (all fingers except thumb should be curled)
  const isRock = !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;

  // Check for Paper gesture (all fingers should be extended)
  const isPaper = isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended && isThumbExtended;

  // Check for Scissors gesture (only index and middle fingers should be extended)
  const isScissors = isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended;

  if (isRock) {
    return 'Stein';
  } else if (isPaper) {
    return 'Papier';
  } else if (isScissors) {
    return 'Schere';
  } else {
    return 'Keine Wahl'; // Fallback in case no gesture is recognized
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
  let countdown = isFirstRound ? 7 : 3; // Use 7 seconds for the first round, then 3 seconds
  isFirstRound = false; // Set first round flag to false after the first round
  countdownOverlay.style.opacity = 1; // Show overlay initially
  countdownInterval = setInterval(() => {
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
        setTimeout(startRound, 3000); // Pause for 3 seconds before starting the next round
      }
    }
  }, 1000);
}

startGameButton.addEventListener('click', () => {
  userScore = 0;
  computerScore = 0;
  userScoreElement.textContent = userScore;
  computerScoreElement.textContent = computerScore;
  recentMoves.length = 0;
  recentMovesElement.innerHTML = '';

  // Reset the first round flag
  isFirstRound = true;

  // Start camera and show manual controls if needed
  startCamera();
  startRound();
});

stopGameButton.addEventListener('click', () => {
  stopCamera();
  clearInterval(countdownInterval); // Stop the countdown
  countdownOverlay.style.opacity = 0; // Hide countdown overlay
  countdownOverlay.textContent = ''; // Clear countdown text
  winnerElement.textContent = 'Spiel beendet';
});

toggleModeButton.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.documentElement.style.setProperty('--background-color', '#212121');
    document.documentElement.style.setProperty('--text-color', '#eaeaea');
    document.documentElement.style.setProperty('--button-background-color', '#9c27b0');
    document.documentElement.style.setProperty('--button-hover-color', '#7b1fa2');
    document.documentElement.style.setProperty('--table-header-color', '#9c27b0');
    toggleModeButton.textContent = 'Wechseln zu Lichtmodus';
  } else {
    document.documentElement.style.setProperty('--background-color', '#f0f0f0');
    document.documentElement.style.setProperty('--text-color', '#333333');
    document.documentElement.style.setProperty('--button-background-color', '#007bff');
    document.documentElement.style.setProperty('--button-hover-color', '#0056b3');
    document.documentElement.style.setProperty('--table-header-color', '#007bff');
    toggleModeButton.textContent = 'Wechseln zu Dunkelmodus';
  }
});

// Instructions overlay logic
function showInstructions() {
  instructionsOverlay.style.display = 'flex';
}

function hideInstructions() {
  instructionsOverlay.style.display = 'none';
}

showInstructionsButton.addEventListener('click', showInstructions);
closeInstructionsButton.addEventListener('click', hideInstructions);

// Manual control buttons
chooseRockButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Stein';
});

choosePaperButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Papier';
});

chooseScissorsButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Schere';
});
