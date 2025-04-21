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
    else if (algo === "insertion") await insertionSort();
    else if (algo === "merge") await mergeSort(array, 0, array.length -1);
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

async function insertionSort(){
    const bars = document.getElementsByClassName("bar");
    for (let i = 1; i < array.length; i++){
        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key){
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;
            playNote(array[j + 1]);
            await sleep(30);
            j--;
        }

        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        playNote(key);
        await sleep(30);
    }
}

async function merge(start, mid, end){
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;
    const bars = document.getElementsByClassName("bar");

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            array[k] = left[i];
            bars[k].style.height = `${left[i]}px`;
            playNote(left[i]);
            i++;
        } else {
            array[k] = right[j];
            bars[k].style.height = `${right[j]}px`;
            playNote(right[j]);
            j++;
        }
        await sleep(30);
        k++;
    }

    while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = `${left[i]}px`;
        playNote(left[i]);
        await sleep(30);
        i++; k++;
    }

    while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = `${right[j]}px`;
        playNote(right[j]);
        await sleep(30);
        j++; k++;
    }
}

async function mergeSort(arr, start, end){
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(arr, start, mid);
    await mergeSort(arr, mid + 1, end);
    await merge(start, mid, end);
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

generateArray();