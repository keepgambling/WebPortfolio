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
const winningScore = 3;
const recentMoves = [];
let countdownInterval;
let cameraStream = null;
let isFirstRound = true;

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
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
  // Simplified logic to determine user's choice based on hand landmarks
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const isIndexExtended = indexTip.y < indexBase.y;
  const isMiddleExtended = middleTip.y < middleBase.y;
  const isRingExtended = ringTip.y < ringBase.y;
  const isPinkyExtended = pinkyTip.y < pinkyBase.y;
  const isThumbExtended = thumbTip.x > indexBase.x;

  if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Rock';
  } else if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended && isThumbExtended) {
    return 'Paper';
  } else if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'Scissors';
  } else {
    return 'Unclear';
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  const backgroundColor = isDarkMode ? '#181818' : '#ffffff';
  const textColor = isDarkMode ? '#f5f5f5' : '#333333';
  const buttonBackgroundColor = isDarkMode ? '#2e2e2e' : '#007bff';
  const buttonHoverColor = isDarkMode ? '#373737' : '#0056b3';
  const tableHeaderColor = isDarkMode ? '#2e2e2e' : '#007bff';

  document.documentElement.style.setProperty('--background-color', backgroundColor);
  document.documentElement.style.setProperty('--text-color', textColor);
  document.documentElement.style.setProperty('--button-background-color', buttonBackgroundColor);
  document.documentElement.style.setProperty('--button-hover-color', buttonHoverColor);
  document.documentElement.style.setProperty('--table-header-color', tableHeaderColor);

  toggleModeButton.textContent = isDarkMode ? 'Wechseln zum Hellenmodus' : 'Wechseln zu Dunkelmodus';
}

toggleModeButton.addEventListener('click', toggleTheme);

showInstructionsButton.addEventListener('click', () => {
  instructionsOverlay.style.display = 'flex';
});

closeInstructionsButton.addEventListener('click', () => {
  instructionsOverlay.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
  toggleTheme(); // Set default theme to light mode
  showInstructions();
});