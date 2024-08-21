// Referenzen zu den HTML-Elementen im DOM
const webcamElement = document.getElementById('webcam'); // Webcam-Videoelement
const canvasElement = document.getElementById('canvas'); // Canvas-Element für Zeichnungen
const computerChoiceElement = document.getElementById('computerChoice'); // Element zur Anzeige der Wahl des Computers
const userChoiceElement = document.getElementById('userChoice'); // Element zur Anzeige der Wahl des Benutzers
const winnerElement = document.getElementById('winner'); // Element zur Anzeige des Gewinners
const userScoreElement = document.getElementById('userScore'); // Element zur Anzeige des Punktestands des Benutzers
const computerScoreElement = document.getElementById('computerScore'); // Element zur Anzeige des Punktestands des Computers
const startGameButton = document.getElementById('startGame'); // Start-Button für das Spiel
const stopGameButton = document.getElementById('stopGame'); // Stopp-Button für das Spiel
const toggleModeButton = document.getElementById('toggleMode'); // Button zum Umschalten zwischen Dunkel- und Lichtmodus
const recentMovesElement = document.getElementById('recentMoves'); // Element zur Anzeige der letzten Spielzüge
const countdownOverlay = document.getElementById('countdown-overlay'); // Overlay für den Countdown
const manualControls = document.getElementById('manual-controls'); // Bereich für manuelle Steuerung
const chooseRockButton = document.getElementById('chooseRock'); // Button für die Wahl "Stein"
const choosePaperButton = document.getElementById('choosePaper'); // Button für die Wahl "Papier"
const chooseScissorsButton = document.getElementById('chooseScissors'); // Button für die Wahl "Schere"
const showInstructionsButton = document.getElementById('showInstructions'); // Button zum Anzeigen der Spielanleitung
const closeInstructionsButton = document.getElementById('closeInstructions'); // Button zum Schließen der Spielanleitung
const instructionsOverlay = document.getElementById('instructions-overlay'); // Overlay für die Spielanleitung
const winnerOverlay = document.getElementById('winner-overlay'); // Overlay zur Anzeige des Spielgewinners
const finalWinnerElement = document.getElementById('finalWinner'); // Element zur Anzeige des endgültigen Gewinners
const closeWinnerOverlayButton = document.getElementById('closeWinnerOverlay'); // Button zum Schließen des Gewinner-Overlays

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
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`; // Pfad für MediaPipe-Dateien
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
    if (cameraStream === null) { // Überprüft, ob der Kamerastream bereits läuft
        navigator.mediaDevices.getUserMedia({ video: true }) // Zugriff auf die Kamera
            .then((stream) => {
                cameraStream = stream; // Speichert den Kamerastream
                webcamElement.srcObject = stream; // Verknüpft den Stream mit dem Videoelement
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
      await hands.send({ image: webcamElement }); // Sendet das Bild an MediaPipe Hands zur Verarbeitung
    },
    width: 640, // Breite des Videostreams
    height: 480 // Höhe des Videostreams
  });
  camera.start(); // Startet den Kamerastream
}

// Stoppt den Kamerastream
function stopCamera() {
  if (cameraStream !== null) { // Überprüft, ob der Kamerastream läuft
    const tracks = cameraStream.getTracks(); // Holt alle Tracks des Streams
    tracks.forEach(track => track.stop()); // Stoppt alle Tracks im Stream
    cameraStream = null; // Setzt den Kamerastream auf null
    webcamElement.srcObject = null; // Entfernt die Videoquelle
    manualControls.style.display = 'none'; // Versteckt manuelle Steuerungen, wenn das Spiel beendet wird
  }
}

// Verarbeitet die Ergebnisse der Handerkennung
function onResults(results) {
  const canvasCtx = canvasElement.getContext('2d'); // Holt den 2D-Zeichenkontext des Canvas
  canvasElement.width = webcamElement.videoWidth; // Setzt die Breite des Canvas auf die Breite des Videos
  canvasElement.height = webcamElement.videoHeight; // Setzt die Höhe des Canvas auf die Höhe des Videos

  canvasCtx.save(); // Speichert den aktuellen Zustand des Canvas
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Löscht den gesamten Canvas

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0]; // Holt die Handlandmarks der ersten Hand
    const choice = getUserChoice(landmarks); // Bestimmt die Wahl des Benutzers basierend auf den Handlandmarks
    userChoiceElement.textContent = choice; // Zeigt die Wahl des Benutzers im UI an
  }

  canvasCtx.restore(); // Stellt den zuvor gespeicherten Zustand des Canvas wieder her
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
  const isIndexExtended = indexTip.y < indexBase.y; // Überprüft, ob der Zeigefinger ausgestreckt ist
  const isMiddleExtended = middleTip.y < middleBase.y; // Überprüft, ob der Mittelfinger ausgestreckt ist
  const isRingExtended = ringTip.y < ringBase.y; // Überprüft, ob der Ringfinger ausgestreckt ist
  const isPinkyExtended = pinkyTip.y < pinkyBase.y; // Überprüft, ob der kleine Finger ausgestreckt ist
  const isThumbExtended = thumbTip.x > indexBase.x; // Überprüft, ob der Daumen seitlich zeigt

  // Überprüft die Gesten Rock, Paper und Scissors
  const isRock = !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended; // Faust
  const isPaper = isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended && isThumbExtended; // Handfläche
  const isScissors = isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended; // Zwei Finger

  if (isRock) {
    return 'Stein'; // Rückgabe der Wahl "Stein"
  } else if (isPaper) {
    return 'Papier'; // Rückgabe der Wahl "Papier"
  } else if (isScissors) {
    return 'Schere'; // Rückgabe der Wahl "Schere"
  } else {
    return 'Keine Wahl'; // Fallback, falls keine Geste erkannt wird
  }
}

// Bestimmt die Wahl des Computers
function getComputerChoice() {
  const choices = ['Stein', 'Papier', 'Schere']; // Mögliche Wahlen
  return choices[Math.floor(Math.random() * choices.length)]; // Zufällige Wahl
}

// Bestimmt den Gewinner basierend auf den Spielregeln
function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return 'Unentschieden'; // Rückgabe bei Gleichstand
  }
  if (
    (userChoice === 'Stein' && computerChoice === 'Schere') ||
    (userChoice === 'Schere' && computerChoice === 'Papier') ||
    (userChoice === 'Papier' && computerChoice === 'Stein')
  ) {
    return 'Benutzer'; // Rückgabe bei Sieg des Benutzers
  }
  return 'Computer'; // Rückgabe bei Sieg des Computers
}

// Aktualisiert den Punktestand basierend auf dem Gewinner
function updateScore(winner) {
  if (winner === 'Benutzer') {
    userScore++; // Erhöht den Punktestand des Benutzers
    userScoreElement.textContent = userScore; // Zeigt den neuen Punktestand des Benutzers an
  } else if (winner === 'Computer') {
    computerScore++; // Erhöht den Punktestand des Computers
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

  recentMoves.push(`${emojis[userChoice]} vs ${emojis[computerChoice]}`); // Fügt die aktuellen Züge hinzu
  if (recentMoves.length > 5) {
    recentMoves.shift(); // Entfernt ältere Züge, wenn mehr als 5
  }

  recentMovesElement.innerHTML = recentMoves.map(move => `<span>${move}</span>`).join(''); // Aktualisiert die Anzeige der letzten Züge
}

// Startet eine neue Spielrunde
function startRound() {
  let countdown = isFirstRound ? 7 : 3; // 7 Sekunden für die erste Runde, dann 3 Sekunden
  isFirstRound = false; // Setzt die Flag für die erste Runde zurück
  countdownOverlay.style.opacity = 1; // Zeigt das Overlay an
  countdownInterval = setInterval(() => {
    countdownOverlay.textContent = `Zeit bis zur Wahl: ${countdown}`; // Zeigt den Countdown an
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval); // Stoppt den Countdown
      countdownOverlay.style.opacity = 0; // Versteckt das Overlay nach dem Countdown

      const computerChoice = getComputerChoice(); // Holt die Wahl des Computers
      const userChoice = userChoiceElement.textContent || 'Keine Wahl'; // Holt die Wahl des Benutzers oder setzt eine Standardwahl

      computerChoiceElement.textContent = computerChoice; // Zeigt die Wahl des Computers an
      const winner = determineWinner(userChoice, computerChoice); // Bestimmt den Gewinner
      winnerElement.textContent = winner; // Zeigt den Gewinner an

      updateScore(winner); // Aktualisiert den Punktestand
      updateRecentMoves(userChoice, computerChoice); // Aktualisiert die Anzeige der letzten Züge

      if (userScore >= winningScore || computerScore >= winningScore) {
        const finalWinner = userScore > computerScore ? 'der Benutzer' : 'der Computer'; // Bestimmt den endgültigen Gewinner
        endGame(finalWinner); // Spiel endet, zeige Sieger-Overlay
      } else {
        setTimeout(startRound, 3000); // Wartet 3 Sekunden vor der nächsten Runde
      }
    }
  }, 1000);
}

// Ereignislistener für Spielsteuerungen
startGameButton.addEventListener('click', () => {
  userScore = 0; // Setzt den Punktestand des Benutzers zurück
  computerScore = 0; // Setzt den Punktestand des Computers zurück
  userScoreElement.textContent = userScore; // Zeigt den Punktestand des Benutzers an
  computerScoreElement.textContent = computerScore; // Zeigt den Punktestand des Computers an
  recentMoves.length = 0; // Löscht die Liste der letzten Züge
  recentMovesElement.innerHTML = ''; // Löscht die Anzeige der letzten Züge

  isFirstRound = true; // Setzt die Flag für die erste Runde zurück

  startCamera(); // Startet die Kamera
  startRound(); // Startet die erste Runde
});

// Stoppt das Spiel und den Kamerastream
stopGameButton.addEventListener('click', () => {
  stopCamera(); // Stoppt den Kamerastream
  clearInterval(countdownInterval); // Stoppt den Countdown
  countdownOverlay.style.opacity = 0; // Versteckt das Countdown-Overlay
  countdownOverlay.textContent = ''; // Löscht den Countdown-Text
  winnerElement.textContent = 'Spiel beendet'; // Zeigt an, dass das Spiel beendet ist
});

// Schaltet zwischen Dunkel- und Lichtmodus um
toggleModeButton.addEventListener('click', () => {
  isDarkMode = !isDarkMode; // Schaltet den Dunkelmodus um
  if (isDarkMode) {
      document.body.classList.add('dark-mode'); // Aktiviert den Dunkelmodus
      toggleModeButton.textContent = '☀️'; // Sonne-Symbol für Lichtmodus
  } else {
      document.body.classList.remove('dark-mode'); // Deaktiviert den Dunkelmodus
      toggleModeButton.textContent = '🌙'; // Mond-Symbol für Dunkelmodus
  }
});

// Logik für das Anzeigen und Verstecken der Anweisungen
function showInstructions() {
  instructionsOverlay.style.display = 'flex'; // Zeigt das Anweisungs-Overlay an
}

function hideInstructions() {
  instructionsOverlay.style.display = 'none'; // Versteckt das Anweisungs-Overlay
}

showInstructionsButton.addEventListener('click', showInstructions); // Ereignislistener zum Anzeigen der Anweisungen
closeInstructionsButton.addEventListener('click', hideInstructions); // Ereignislistener zum Schließen der Anweisungen

// Zeigt die Anweisungen beim Laden der Seite an
document.addEventListener('DOMContentLoaded', () => {
  showInstructions(); // Zeigt das Anweisungs-Overlay beim Laden der Seite
  manualControls.style.display = 'none'; // Versteckt manuelle Steuerungen beim Laden der Seite
});

// Ereignislistener für manuelle Steuerungsknöpfe
chooseRockButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Stein'; // Setzt die Wahl auf "Stein"
});

choosePaperButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Papier'; // Setzt die Wahl auf "Papier"
});

chooseScissorsButton.addEventListener('click', () => {
  userChoiceElement.textContent = 'Schere'; // Setzt die Wahl auf "Schere"
});

// Funktion, um das Sieger-Overlay anzuzeigen
function showWinnerOverlay(finalWinner) {
    finalWinnerElement.textContent = finalWinner; // Zeigt den endgültigen Gewinner an
    winnerOverlay.style.display = 'flex'; // Zeigt das Gewinner-Overlay an
}

// Funktion, um das Sieger-Overlay zu schließen
function closeWinnerOverlay() {
    winnerOverlay.style.display = 'none'; // Versteckt das Gewinner-Overlay
    stopCamera(); // Stoppt die Kamera, wenn das Overlay geschlossen wird
}

// Ereignislistener für den Schließen-Button des Sieger-Overlays
closeWinnerOverlayButton.addEventListener('click', closeWinnerOverlay);

// Den Spielabschluss ändern, um das Sieger-Overlay anzuzeigen
function endGame(finalWinner) {
    showWinnerOverlay(finalWinner); // Zeigt das Gewinner-Overlay an
}
