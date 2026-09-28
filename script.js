// script.js - Juego "Basta" accesible con voz

let isPlaying = false;
let timer;
let timeLeft = 10;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Array de posibles mensajes (instrucciones del juego)
const instructions = [
    "Di una palabra que empiece con ",
    "Di un animal cuyo nombre empiece con ",
    "Un país que empiece con ",
    "Nombre de mujer que empiece con ",
    "Nombre de hombre que empiece con ",
    "Cosa que empiece con ",
    "Una fruta que empiece con "
];

// Excepciones de letras para cada categoría
const letterExceptions = {
    "Un país que empiece con ": ["X", "Ñ", "W"],
    "Nombre de mujer que empiece con ": ["Ñ"],
    "Nombre de hombre que empiece con ": ["Ñ"],
    "Una fruta que empiece con ": ["Ñ", "X", "W", "O", "Y", "R"],
    "Di un animal cuyo nombre empiece con ": ["Ñ", "W", "X"],
    "Cosa que empiece con ": ["Ñ", "W", "X"],
    "Di una palabra que empiece con ": ["Ñ"]
};

let selectedVoice = null;

// Cargar voces una vez y guardar Sabina
speechSynthesis.onvoiceschanged = () => {
    let voices = speechSynthesis.getVoices();
    selectedVoice = voices.find(v => v.name === "Microsoft Sabina - Spanish (Mexico)");
};

// Función para leer texto en voz alta con voz específica

// Función para leer texto en voz alta con Sabina
function speakText(text, callback) {
    console.log("Leyendo:", text);
    speechSynthesis.cancel();

    let fixedText = text.replace(/\bY\b/g, "ye");
    let utterance = new SpeechSynthesisUtterance(fixedText);
    utterance.lang = "es-MX";
utterance.rate = 1;    // Velocidad de la voz: 
                       // 1 = normal, 
                       // valores menores (0.1–0.9) = más lento, 
                       // valores mayores (1.1–10) = más rápido.

utterance.pitch = 1; // Tono de la voz: 
                       // 1 = tono normal, 
                       // valores menores = más grave, 
                       // valores mayores = más agudo.

utterance.volume = 1;  // Volumen de la voz: 
                       // 1 = máximo, 
                       // 0 = silencio, 
                       // valores intermedios (0.1–0.9) = volumen reducido.
    // Usar la voz ya guardada
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.onend = callback;
    speechSynthesis.speak(utterance);
}


// Función para iniciar o reiniciar el juego
function startGame() {
    clearInterval(timer);
    isPlaying = true;
    timeLeft = 10;
    let randomInstruction = instructions[Math.floor(Math.random() * instructions.length)];
    let validLetters = letters.split("").filter(letter => !(letterExceptions[randomInstruction] || []).includes(letter));
    let randomLetter = validLetters[Math.floor(Math.random() * validLetters.length)];
    
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("instruction").innerHTML = `Instrucción: ${randomInstruction} <span id="letter">${randomLetter}</span>`;
    
    // Evita doble lectura asegurando que solo habla antes de iniciar el temporizador
    speakText(randomInstruction + randomLetter, startTimer);
}

// Función del temporizador que lee los números en voz alta
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            document.getElementById("timer").textContent = timeLeft; // Primero actualiza la pantalla
            speechSynthesis.cancel(); // Cancela cualquier voz en curso
            speakText(timeLeft.toString()); // Luego habla el número
            timeLeft--; // Finalmente, reduce el tiempo
        } else {
            clearInterval(timer);
            isPlaying = false;
            setTimeout(() => {
                speakText("¡Tiempo agotado!");
            }, 500);
        }
    }, 1000);
}

// Función para pausar el juego
function pauseGame() {
    clearInterval(timer);
    speakText("Pausa de jueces");
    isPlaying = false;
}

// Función para reanudar el juego
function resumeGame() {
    speakText("Cuenta atrás reanudada", startTimer);
}

// Evento para detectar teclas
document.addEventListener("keydown", (event) => {
    let key = event.key.toUpperCase(); // Permitir mayúsculas y minúsculas
    
    if (key === "ENTER") {
        startGame();
    } else if (key === "F") {
        pauseGame();
    } else if (key === "J") {
        resumeGame();
    }
});
