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
const showInstructionsButton = document.getElementById('showInstructions');
const closeInstructionsButton = document.getElementById('closeInstructions');
const instructionsOverlay = document.getElementById('instructions-overlay');

let userScore = 0;
let computerScore = 0;
let isDarkMode = false;
const recentMoves = [];
let cameraStream = null;

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
  if (!cameraStream) {
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
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    webcamElement.srcObject = null;
  }
}

function onResults(results) {
  const canvasCtx = canvasElement.getContext('2d');
  canvasElement.width = webcamElement.videoWidth;
  canvasElement.height = webcamElement.videoHeight;

  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks?.length) {
    const choice = getUserChoice(results.multiHandLandmarks[0]);
    userChoiceElement.textContent = choice;
  }
}

function getUserChoice(landmarks) {
  const [thumbTip, indexTip, middleTip, ringTip, pinkyTip] = [
    landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]
  ];

  if (indexTip.y < landmarks[5].y && middleTip.y < landmarks[9].y && ringTip.y < landmarks[13].y && pinkyTip.y < landmarks[17].y) {
    if (thumbTip.x > indexTip.x) return 'Paper';
    return 'Scissors';
  }
  return 'Rock';
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.style.setProperty('--background-color', isDarkMode ? '#181818' : '#ffffff');
  document.documentElement.style.setProperty('--text-color', isDarkMode ? '#f5f5f5' : '#333333');
  document.documentElement.style.setProperty('--button-background-color', isDarkMode ? '#2e2e2e' : '#007bff');
  document.documentElement.style.setProperty('--button-hover-color', isDarkMode ? '#373737' : '#0056b3');
  document.documentElement.style.setProperty('--table-header-color', isDarkMode ? '#2e2e2e' : '#f1f1f1');

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
  toggleTheme();
});
