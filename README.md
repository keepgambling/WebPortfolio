# Willkommen bei Schere Stein Papier!

Die Web App kann über folgenden Link aufgerufen werden: https://keepgambling.github.io/WebPortfolio/index.html

![Screenshot 1](![4b68b0b4-d05c-402f-89ba-c1079235234e](https://github.com/user-attachments/assets/aa56928a-eb2b-45a1-98e8-735599d27e53))  
![Screenshot 2](![4d55a92d-6cd5-44bd-93d2-4c45f68c4a78](https://github.com/user-attachments/assets/4dce58d6-4678-4fea-99f9-3ca0753b6c79))  

- Um zu beginnen, klicke auf **Spiel Starten**. Der Countdown zeigt die Zeit bis zur Wahl an.
- Verwende die Handgesten vor der Kamera oder die Buttons, falls keine Kamera verfügbar ist um deine Wahl zu treffen.
- **Stein✊** schlägt Schere✌️, **Papier✋** schlägt Stein✊, **Schere✌️** schlägt Papier✋.
- Das Spiel endet, wenn ein Spieler drei Punkte erreicht hat.
- Du kannst jederzeit das Spiel mit **Spiel Beenden** stoppen.
- Benutze den Button **🌙**, um zwischen Licht- und Dunkelmodus zu wechseln.

## Index.html

Diese HTML-Datei erstellt eine Webseite für ein "Schere, Stein, Papier"-Spiel, das sowohl eine Webcam-basierte als auch eine manuelle Benutzereingabe unterstützt. Die Struktur umfasst einen Header mit dem Spieltitel, einen Hauptbereich mit der Spieloberfläche, Ergebnisanzeigen, manuelle Steuerungen und Anweisungen zum Spielen des Spiels. Außerdem sind externe Skripte eingebunden, um die Handerkennung über die Webcam zu ermöglichen und die Spiel-Logik zu verwalten. Die Benutzeroberfläche ist mit Blick auf Zugänglichkeit und Benutzerinteraktion gestaltet und bietet klare Optionen zum Starten und Beenden des Spiels, Umschalten zwischen Licht- und Dunkelmodus und Anzeigen der Spielanleitung.

## Style.css

- **Globale Variablen**: Enthält globale Variablen für Farben, Abstände, Schatten und Übergangsdauer, die auf der gesamten Seite verwendet werden.
- **body**: Setzt die grundlegenden Stile für das Layout der Seite, einschließlich Schriftart, Ausrichtung des Inhalts, Hintergrundfarbe und Textfarbe. Das Flexbox-Layout sorgt dafür, dass der Inhalt vertikal zentriert wird.
- **header**: Definiert das Erscheinungsbild des Kopfbereichs der Seite, inklusive Flexbox-Ausrichtung, Schatten und abgerundeten Ecken. Der Header hat eine maximale Breite und ist vollständig responsive.
- **container**: Ein zentraler Bereich für den Hauptinhalt der Seite, der die Flexbox verwendet, um den Inhalt horizontal zu zentrieren und eine maximale Breite von 100 % festzulegen.
- **webcam-wrapper und #webcam**: Diese Stile bestimmen die Anordnung und das Aussehen des Webcam-Elements, inklusive eines Schatteneffekts und abgerundeter Ecken. Der Wrapper sorgt dafür, dass die Webcam zentriert angezeigt wird.
- **#countdown-overlay**: Ein über der Webcam positioniertes Overlay für den Countdown. Es wird mit einem halbtransparenten Hintergrund, zentraler Textausrichtung und weichen Übergängen definiert.
- **result-section**: Ein Bereich für die Anzeige von Ergebnissen, der eine zentrierte Textausrichtung und angepasste Schriftgrößen für Titel und Untertitel enthält.
- **recent-moves**: Definiert die Stile für die Anzeige der letzten Bewegungen in einem flexiblen Layout, mit Abständen zwischen den Elementen und einer Anpassung an kleine Bildschirmgrößen.
- **table, th, td**: Stile für Tabellen, mit besonderem Fokus auf abgerundete Ecken, Schatten und Innenabstände. Der Tabellenkopf erhält eine eigene Hintergrundfarbe und einen Schatteneffekt.
- **button**: Schaltflächenstile mit Hintergrundfarbe, Textfarbe, abgerundeten Ecken und weichen Übergängen beim Hover. Schaltflächen reagieren auf Hover-Effekte mit Farbänderungen und einer leichten Bewegung nach oben.
- **overlay und overlay-content**: Stile für Overlays, die über den Inhalten der Seite schweben. Sie sind fixiert, zentriert und enthalten abgerundete Ecken sowie Schatten für ein auffälliges Erscheinungsbild.
- **close-button**: Stile für die Schließen-Schaltfläche in Overlays, mit Hintergrundfarbe, abgerundeten Ecken und Hover-Effekten.
- **dark-mode**: Spezielle Stile für den Dunkelmodus, bei dem die Hintergrund- und Textfarben geändert werden, um eine bessere Lesbarkeit bei dunklen Bildschirmen zu gewährleisten. Schaltflächen und Tabellen erhalten ebenfalls angepasste Farben für den Dark Mode.
- **responsive Anpassungen**: Enthält verschiedene Medienabfragen, die das Layout der Seite an kleinere Bildschirmgrößen anpassen. Für Tablets und Mobilgeräte werden Schriftgrößen, Abstände und die Flexbox-Struktur angepasst.

## Script.js

Dieser JavaScript-Code implementiert das klassische Spiel Schere Stein Parpier, bei dem der Benutzer gegen den Computer spielt. Die Besonderheit dieses Spiels besteht darin, dass die Wahl des Benutzers durch Handgestenerkennung über die Webcam erfolgt. Das Spiel läuft, bis entweder der Benutzer oder der Computer eine bestimmte Anzahl an Punkten erreicht hat. Das Spiel kann zwischen einem Dunkel- und einem Lichtmodus umgeschaltet werden, und es bietet sowohl automatisierte als auch manuelle Steuerungen.


## Wichtige HTML-Elemente

- **webcamElement**: Video-Element für die Webcam.
- **canvasElement**: Canvas für Zeichnungen und Handerkennung.
- **computerChoiceElement**: Anzeige der Computerwahl.
- **userChoiceElement**: Anzeige der Benutzerwahl.
- **winnerElement**: Anzeige des Runden-Gewinners.
- **userScoreElement**: Punktestand des Benutzers.
- **computerScoreElement**: Punktestand des Computers.
- **startGameButton**: Startet das Spiel.
- **stopGameButton**: Stoppt das Spiel.
- **toggleModeButton**: Umschalten zwischen Dunkel- und Lichtmodus.

## Wichtige Variablen

- **userScore**: Punktestand des Benutzers.
- **computerScore**: Punktestand des Computers.
- **isDarkMode**: Flag für den Dunkelmodus.
- **isGameRunning**: Zeigt an, ob das Spiel läuft.
- **winningScore**: Punktestand, um das Spiel zu gewinnen.
- **recentMoves**: Speichert die letzten Spielzüge.
- **cameraStream**: Speichert den Kamerastream.

## Hauptfunktionen

- **startCamera()**: Startet den Kamerastream.
- **stopCamera()**: Stoppt den Kamerastream.
- **onResults(results)**: Verarbeitet die Handerkennungsergebnisse.
- **getUserChoice(landmarks)**: Bestimmt die Benutzerwahl (Stein, Papier, Schere).
- **getComputerChoice()**: Ermittelt zufällig die Computerwahl.
- **determineWinner(userChoice, computerChoice)**: Bestimmt den Gewinner der Runde.
- **updateScore(winner)**: Aktualisiert den Punktestand basierend auf dem Gewinner.
- **startRound()**: Startet eine neue Spielrunde.

## Ereignislistener

- **startGameButton**: Startet das Spiel und die Kamera.
- **stopGameButton**: Stoppt das Spiel und die Kamera.
- **toggleModeButton**: Schaltet den Dunkel-/Lichtmodus um.
- **chooseRockButton, choosePaperButton, chooseScissorsButton**: Setzen die manuelle Wahl des Benutzers.

## Weitere Features

- **Dunkel-/Lichtmodus**: Umschaltung und Speicherung der Präferenz im Browser.
- **Gewinner-Overlay**: Zeigt den endgültigen Gewinner des Spiels an.


## Vorgehen

Die Idee zur Entwicklung der Webanwendung begann mit dem Gedanken, eine simple API-basierte Anwendung zu erstellen. Dabei kam sofort das klassische Spiel "Schere, Stein, Papier" in den Sinn. Von dieser Grundidee aus entwickelten sich schnell weitere Umsetzungsideen, die die Anwendung erweitern und interessanter gestalten sollten.

Zu Beginn der Entwicklung wurde ein Grundgerüst mit der Bibliothek Mediapipe erstellt. Dieses Grundgerüst ermöglichte die Erkennung von Handgesten, die essenziell für das Spiel „Schere, Stein, Papier“ sind. Im weiteren Verlauf der Entwicklung wurden der Spielalgorithmus implementiert und zusätzliche Features wie eine Anleitung sowie ein Dark- und White-Mode hinzugefügt.

Gegen Ende des Projekts lag der Fokus auf dem Design und der Anpassung an verschiedene Bildschirmgrößen (Responsive Web Design). Diese Phase stellte sich als besonders herausfordernd heraus, da die Anwendung ursprünglich nur für die Desktop-Ansicht entwickelt wurde.

## Herausforderungen

### 1. Mediapipe Integration und Erkennung

Ein zentrales Element der Anwendung war die präzise Erkennung der Handgesten „Schere“, „Stein“ und „Papier“ mithilfe von Mediapipe. Zu Beginn gab es hier einige Schwierigkeiten, da die Erkennungsrate nicht zufriedenstellend war. Durch Anpassungen und Feinjustierungen in der Konfiguration von Mediapipe konnte die Genauigkeit schließlich verbessert werden.

### 2. Designfindung

Die Gestaltung des User Interface (UI) war eine unerwartet langwierige Aufgabe. Es dauerte länger als erwartet, ein ansprechendes und funktionales Design zu entwickeln. Verschiedene Designkonzepte wurden ausprobiert und verfeinert, bis ein stimmiges Gesamtbild entstand.

### 3. Responsive Web Design

Die Anpassung der Webanwendung an verschiedene Bildschirmgrößen stellte eine der größten Herausforderungen dar. Da die Entwicklung zunächst für Desktop-Bildschirme optimiert wurde, war es schwierig, diese für Mobilgeräte zu adaptieren, ohne das bestehende Design zu beeinträchtigen. Dies erforderte eine umfassende Überarbeitung des Layouts und zahlreiche Tests.

### 4. Kleine Fehler und Optimierungen

Während der gesamten Entwicklungszeit traten immer wieder kleinere Fehler auf, wie z. B. Probleme mit Tabellengrößen, Schriftfarben oder anderen Designaspekten. Diese Fehler erforderten zusätzliche Zeit für Korrekturen und Optimierungen. Diese kleinen Probleme können sich bei zukünftigen Projekten als wertvolle Lektionen erweisen, um solche Fallstricke von Anfang an zu vermeiden.

## Fazit

Die Entwicklung der Webanwendung war ein iterativer Prozess, bei dem die ursprüngliche Idee stetig weiterentwickelt und verbessert wurde. Die größte Herausforderung stellte sich in der Anpassung des Designs und der Responsivität heraus, was zusätzliche Zeit und Aufwand erforderte. Trotz einiger Rückschläge und unerwarteter Probleme konnte das Projekt erfolgreich abgeschlossen werden, und die gewonnenen Erkenntnisse werden bei zukünftigen Projekten von großem Nutzen sein.
