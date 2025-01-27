const container = document.getElementById("container");
let n = 10; // Default value for n
let array = [];

let audioCtx = null;

// Initialize the array and display the bars
function init() {
  // Get the number of elements from the input field
  const inputElement = document.getElementsByName("input")[0];
  n = parseInt(inputElement.value) || 10; // Use input value or default to 10
  array = []; // Clear the previous array
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showbars(); // Re-render the bars with the new array
}

// Function to play the sound for sorting
function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  osc.connect(audioCtx.destination);
}

// Function to start sorting and animate it
function play() {
  const copy = [...array];
  const moves = bubbleSort(copy);
  animate(moves);
}

// Function to animate the sorting process
function animate(moves) {
  if (moves.length == 0) {
    showbars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;
  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
    playNote(200 + array[i] * 500); // Play a note when a swap occurs
  }

  showbars(move);
  setTimeout(function () {
    animate(moves);
  }, 50);
}

// Bubble sort algorithm that tracks swaps
function bubbleSort(array) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      if (array[i - 1] > array[i]) {
        swapped = true;
        moves.push({ indices: [i - 1, i], type: "swap" });
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
  } while (swapped);
  return moves;
}

// Function to render the bars on the screen
function showbars(move) {
  container.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    // Apply color if a move is made (swap or comparison)
    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    }

    container.appendChild(bar);
  }
}
