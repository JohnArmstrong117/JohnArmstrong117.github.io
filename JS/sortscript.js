let array = [];
let audioCtx = null;

function generateArray(size = 50){
    array = Array.from({length: size}, () => Math.floor(Math.random() * 300));
    renderArray();
}

function renderArray(){
    const container = document.getElementById("array-container");
    container.innerHTML = '';
    array.forEach(height => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${height}px`;
        container.appendChild(bar);
    })
}

async function startSort(){
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const algo = document.getElementById("algorithm").value;
    if (algo === "bubble") await bubbleSort();
    else if (algo === "selection") await selectionSort();
}

async function bubbleSort(){
    const bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j + 1].style.height = `${array[j + 1]}px`;
                playNote(array[j]);
                await sleep(30);
            }
        }
    }
}

function playNote(height){
    if (document.getElementById("muteToggle")?.checked) return;
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const frequency = 200 + (height / 300) * 800;
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
    oscillator.stop(audioCtx.currentTime + 0.2);
}

async function selectionSort(){
    const bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
        bars[i].style.height = `${array[i]}px`;
        bars[minIdx].style.height = `${array[minIdx]}px`;
        playNote(array[i]);
        await sleep(30);
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

generateArray();