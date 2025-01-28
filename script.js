const container = document.getElementById("container");
let n = 10; // Default value for n
let array = [];

let audioCtx = null;

init();

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

  const algorithm = document.querySelector(".Algorithm").value;

  switch (algorithm) {
    case "bubble":
      const moves = bubbleSort(copy);
      animate(moves);
      break;
    case "insertion":
      bestCase.innerHTML = "O(n)";
      worstCase.innerHTML = "O(n²)";
      averageCase.innerHTML = "O(n²)";
      break;
    case "quick":
      bestCase.innerHTML = "O(n log n)";
      worstCase.innerHTML = "O(n²)";
      averageCase.innerHTML = "O(n log n)";
      break;
    case "selection":
      const selectionmoves = selectionsort(copy);
      animate(selectionmoves);
      break;
    case "merge":
      bestCase.innerHTML = "O(n log n)";
      worstCase.innerHTML = "O(n log n)";
      averageCase.innerHTML = "O(n log n)";
      break;
    case "radix":
      bestCase.innerHTML = "O(nk)";
      worstCase.innerHTML = "O(nk)";
      averageCase.innerHTML = "O(nk)";
      break;
    case "bucket":
      bestCase.innerHTML = "O(n + k)";
      worstCase.innerHTML = "O(n²)";
      averageCase.innerHTML = "O(n + k)";
      break;
  }
}
// Function to animate the sorting process
function animate(moves) {
  const delay = parseInt(document.getElementsByName("delay")[0].value);

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
  }, delay);
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
function showcomplexity() {
  const algorithm = document.querySelector(".Algorithm").value;

  const bestCase = document.getElementsByName("Bestcase")[0];
  const worstCase = document.getElementsByName("Worstcase")[0];
  const averageCase = document.getElementsByName("Aeveragecase")[0];

  switch (algorithm) {
    case "bubble":
      bestCase.innerHTML = "O(n)";
      worstCase.innerHTML = "O(n²)";
      averageCase.innerHTML = "O(n²)";
      break;
    case "insertion":
      bestCase.innerHTML = "O(n)";
      worstCase.innerHTML = "O(n²)";
      averageCase.innerHTML = "O(n²)";
      break;
    case "quick":
      bestCase.innerHTML = "O(n log n)";
      worstCase.innerHTML = "O(n²)";
      averageCase.innerHTML = "O(n log n)";
      break;
    case "selection":
      bestCase.innerHTML = "O(n²)";
      worstCase.innerHTML = "O(n²)";
      averageCase.innerHTML = "O(n²)";
      break;
    case "merge":
      bestCase.innerHTML = "O(n log n)";
      worstCase.innerHTML = "O(n log n)";
      averageCase.innerHTML = "O(n log n)";
      break;
    case "radix":
      bestCase.innerHTML = "O(nk)";
      worstCase.innerHTML = "O(nk)";
      averageCase.innerHTML = "O(nk)";
      break;
    case "bucket":
      bestCase.innerHTML = "O(n + k)";
      worstCase.innerHTML = "O(n²)";
      averageCase.innerHTML = "O(n + k)";
      break;
    default:
      bestCase.innerHTML = "";
      worstCase.innerHTML = "";
      averageCase.innerHTML = "";
  }
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

function selectionsort(array) {
  const moves = [];
  for (let i = 0; i < array.length; i++) {
    let min_index = i;
    for (let j = i + 1; j < array.length; j++) {
      // Record comparison move
      moves.push({ indices: [j, min_index], type: "compare" });
      if (array[j] < array[min_index]) {
        min_index = j;
      }
    }
    // Record swap move if a swap is needed
    if (min_index !== i) {
      moves.push({ indices: [i, min_index], type: "swap" });
      [array[i], array[min_index]] = [array[min_index], array[i]];
    }
  }
  return moves;
}
