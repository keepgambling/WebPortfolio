// Referenzen zu den HTML-Elementen im DOM
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

// Variablen zur Spielsteuerung
let userScore = 0; // Punktestand des Benutzers
let computerScore = 0; // Punktestand des Computers
let isDarkMode = false; // Flag für den Dunkelmodus
const winningScore = 3; // Punktestand, um das Spiel zu gewinnen
const recentMoves = []; // Speichert die letzten Spielzüge
let countdownInterval; // Speichert das Intervall für den Countdown
let cameraStream = null; // Speichert den Kamerastream
let isFirstRound = true; // Flag für die erste Runde

// Initialisierung der MediaPipe Hands-Bibliothek
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

hands.setOptions({
  maxNumHands: 1, // Maximale Anzahl an erkannten Händen
  modelComplexity: 1, // Komplexität des Modells
  minDetectionConfidence: 0.5, // Mindestvertrauen für die Erkennung
  minTrackingConfidence: 0.5 // Mindestvertrauen für das Tracking
});

// Legt fest, was passiert, wenn Ergebnisse verfügbar sind
hands.onResults(onResults);

// Startet den Kamerastream
function startCamera() {
    if (cameraStream === null) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                cameraStream = stream;
                webcamElement.srcObject = stream;
                manualControls.style.display = 'none'; // Versteckt manuelle Steuerungen
                startCameraStream(); // Startet die Verarbeitung des Kamerastreams
            })
            .catch(() => {
                manualControls.style.display = 'block'; // Zeigt manuelle Steuerungen bei Fehlern an
            });
    }
}

// Startet den Kamerastream und verarbeitet die Frames
function startCameraStream() {
  const camera = new Camera(webcamElement, {
    onFrame: async () => {
      await hands.send({ image: webcamElement }); // Sendet das Bild an MediaPipe Hands
    },
    width: 640, // Breite des Videostreams
    height: 480 // Höhe des Videostreams
  });
  camera.start(); // Startet den Kamerastream
}

// Stoppt den Kamerastream
function stopCamera() {
  if (cameraStream !== null) {
    const tracks = cameraStream.getTracks();
    tracks.forEach(track => track.stop()); // Stoppt alle Tracks im Stream
    cameraStream = null;
    webcamElement.srcObject = null; // Entfernt die Videoquelle
    manualControls.style.display = 'none'; // Versteckt manuelle Steuerungen, wenn das Spiel beendet wird
  }
}

// Verarbeitet die Ergebnisse der Handerkennung
function onResults(results) {
  const canvasCtx = canvasElement.getContext('2d');
  canvasElement.width = webcamElement.videoWidth;
  canvasElement.height = webcamElement.videoHeight;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    const choice = getUserChoice(landmarks); // Bestimmt die Wahl des Benutzers basierend auf den Handlandmarks
    userChoiceElement.textContent = choice; // Zeigt die Wahl des Benutzers im UI an
  }

  canvasCtx.restore();
}

// Bestimmt die Wahl des Benutzers basierend auf Handlandmarks
function getUserChoice(landmarks) {
  // Extrahiert die Spitzen und Basen der Finger
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const thumbBase = landmarks[2];
  const indexBase = landmarks[5];
  const middleBase = landmarks[9];
  const ringBase = landmarks[13];
  const pinkyBase = landmarks[17];

  // Überprüft, ob die Finger ausgestreckt sind
  const isIndexExtended = indexTip.y < indexBase.y;
  const isMiddleExtended = middleTip.y < middleBase.y;
  const isRingExtended = ringTip.y < ringBase.y;
  const isPinkyExtended = pinkyTip.y < pinkyBase.y;
  const isThumbExtended = thumbTip.x > indexBase.x; // Überprüft, ob der Daumen seitlich zeigt

  // Überprüft die Gesten Rock, Paper und Scissors
  const isRock = !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended;
  const isPaper = isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended && isThumbExtended;
  const isScissors = isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended;

  if (isRock) {
    return 'Stein';
  } else if (isPaper) {
    return 'Papier';
  } else if (isScissors) {
    return 'Schere';
  } else {
    return 'Keine Wahl'; // Fallback, falls keine Geste erkannt wird
  }
}

// Bestimmt die Wahl des Computers
function getComputerChoice() {
  const choices = ['Stein', 'Papier', 'Schere'];
  return choices[Math.floor(Math.random() * choices.length)];
}

// Bestimmt den Gewinner basierend auf den Spielregeln
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

// Aktualisiert den Punktestand basierend auf dem Gewinner
function updateScore(winner) {
  if (winner === 'Benutzer') {
    userScore++;
    userScoreElement.textContent = userScore; // Zeigt den neuen Punktestand des Benutzers an
  } else if (winner === 'Computer') {
    computerScore++;
    computerScoreElement.textContent = computerScore; // Zeigt den neuen Punktestand des Computers an
  }
}

// Aktualisiert die Anzeige der letzten Spielzüge
function updateRecentMoves(userChoice, computerChoice) {
  const emojis = {
    'Stein': '✊',
    'Papier': '✋',
    'Schere': '✌️'
  };

  recentMoves.push(`${emojis[userChoice]} vs ${emojis[computerChoice]}`);
  if (recentMoves.length > 5) {
    recentMoves.shift(); // Entfernt ältere Züge, wenn mehr als 5
  }

  recentMovesElement.innerHTML = recentMoves.map(move => `<span>${move}</span>`).join('');
}

// Startet eine neue Spielrunde
function startRound() {
  let countdown = isFirstRound ? 7 : 3; // 7 Sekunden für die erste Runde, dann 3 Sekunden
  isFirstRound = false; // Setzt die Flag für die erste Runde zurück
  countdownOverlay.style.opacity = 1; // Zeigt das Overlay an
  countdownInterval = setInterval(() => {
    countdownOverlay.textContent = `Zeit bis zur Wahl: ${countdown}`;
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);
      countdownOverlay.style.opacity = 0; // Versteckt das Overlay nach dem Countdown

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
        stopCamera(); // Stoppt die Kamera, wenn das Spiel vorbei ist
      } else {
        setTimeout(startRound, 3000); // Wartet 3 Sekunden vor der nächsten Runde
      }
    }
  }, 1000);
}

// Ereignislistener für Spielsteuerungen
startGameButton.addEventListener('click', () => {
  userScore = 0;
  computerScore = 0;
  userScoreElement.textContent = userScore;
  computerScoreElement.textContent = computerScore;
  recentMoves.length = 0;
  recentMovesElement.innerHTML = '';

  // Setzt die Flag für die erste Runde zurück
  isFirstRound = true;

  // Startet die Kamera und zeigt manuelle Steuerungen bei Bedarf an
  startCamera();
  startRound();
});

// Stoppt das Spiel und den Kamerastream
stopGameButton.addEventListener('click', () => {
  stopCamera();
  clearInterval(countdownInterval); // Stoppt den Countdown
  countdownOverlay.style.opacity = 0; // Versteckt das Countdown-Overlay
  countdownOverlay.textContent = ''; // Löscht den Countdown-Text
  winnerElement.textContent = 'Spiel beendet';
});

// Schaltet zwischen Dunkel- und Lichtmodus um
toggleModeButton.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.documentElement.style.setProperty('--background-color', '#181818');
    document.documentElement.style.setProperty('--text-color', '#ffffff');
    document.documentElement.style.setProperty('--button-background-color', '#2e2e2e');
    document.documentElement.style.setProperty('--button-hover-color', '#373737');
    document.documentElement.style.setProperty('--table-header-color', '#2e2e2e');
    toggleModeButton.textContent = '☀️'; // Sonne-Symbol für Lichtmodus
  } else {
    document.documentElement.style.setProperty('--background-color', '#faf9f6');
    document.documentElement.style.setProperty('--text-color', '#000000');
    document.documentElement.style.setProperty('--button-background-color', '#a2b7ca');
    document.documentElement.style.setProperty('--button-hover-color', '#a2b7caa1');
    document.documentElement.style.setProperty('--table-header-color', '#a2b7ca');
    toggleModeButton.textContent = '🌙'; // Mond-Symbol für Dunkelmodus
  }
});


// Logik für das Anzeigen und Verstecken der Anweisungen
function showInstructions() {
  instructionsOverlay.style.display = 'flex';
}

function hideInstructions() {
  instructionsOverlay.style.display = 'none';
}

showInstructionsButton.addEventListener('click', showInstructions);
closeInstructionsButton.addEventListener('click', hideInstructions);

// Zeigt die Anweisungen beim Laden der Seite an
document.addEventListener('DOMContentLoaded', () => {
  showInstructions();
  manualControls.style.display = 'none'; // Versteckt manuelle Steuerungen beim Laden der Seite
});

// Ereignislistener für manuelle Steuerungsknöpfe
chooseRockButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Stein';
});

choosePaperButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Papier';
});

chooseScissorsButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Schere';
});
