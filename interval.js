// All the small things - nope, these are global things
var inProgress = false;
var paused = false;
var resumed = false;
var stoped = false;

var regularExerciseTypes = "regular pushup, wide pushup, triceps pushup, squat, sit up, jumping jack, burpy";

var initSavedObj = {
  j: "",
  row: -1,
  state: ""
};

var savedObj = JSON.parse(JSON.stringify(initSavedObj));

// Your functions, my functions...
function init() {
  console.log('%c Why are you so curious? ', 'background: #222; color: #bada55; font-size:25px;');
  initExercies();
}

function togglePauseResume(isPaused, isResumed) {
  document.getElementById("pause").disabled = isPaused;
  document.getElementById("play").disabled = isResumed;
}

function pause() {
  togglePauseResume(true, false);
  paused = true;
}

function resume() {
  togglePauseResume(false, true);
  paused = false;
  resumed = true;
  inProgress = false;
  work_hard();
}

function deselect_all() {
  let rows = document.getElementById('input').rows;
  for (let r in rows) {
    rows[r].style="border: thin";
  }
}

async function stop() {
  stoped = true;
  inProgress = false;
  clear();
  showControls(false);
  deselect_all();

  await sleep(1000);
  showControls(false);

  stoped = false;
  paused = false;
  resumed = false;
  document.getElementById('sweat').disabled = false;
  savedObj = JSON.parse(JSON.stringify(initSavedObj));
}

function clear() {
  document.getElementById("scene").innerHTML="";
}

async function count_down(MSG, LIMIT) {
  for (let j = 0; j != LIMIT; ++j) {
    if (stoped) {
      return;
    }

    if (paused) {
      savedObj.j = j;
      savedObj.state = (MSG.substring(0, 4) == "WORK") ? "WORK": "REST";
      return;
    }

    if (resumed) {
      j = savedObj.j;
      resumed = false; // state restored
    }

    clear();
    let ACT = LIMIT - j;
    if (ACT < 10) {
      ACT = "0" + ACT;
    }

    banner(MSG + "<br/>" + ACT);
    if (LIMIT - j < 4) {
      beep();
    }
    await sleep(1000);
  }
}

function banner(msg) {
  document.getElementById("scene").innerHTML += "<h1>" + msg + "</h1>";
}

function bye() {
  clear();
  alert_end();
  banner("Well done");
  document.getElementById("congrats").style.display="block";
  $("#congrats").show().delay(3000).fadeOut();
}

async function rest(REST_INTERVAL) {
  await count_down("REST", REST_INTERVAL);
}

function alert_start() {}

function alert_end() {
  beep();
}

function showControls(enabled) {
  if (enabled) {
    $('#play').show();
    $('#pause').show();
    $('#stop').show();
    return;
  }

  $('#play').hide();
  $('#pause').hide();
  $('#stop').hide();
}

async function work_hard() {
  document.getElementById('sweat').disabled = true;
  let t = document.getElementById('input');
  for (let i = (savedObj.row != -1) ? savedObj.row : 1; i <= t.rows.length-2; i++) {
    savedObj.row = i;
    let cells = t.rows[i].cells;

    let WORK_INTERVAL = cells[0].firstElementChild.value;
    let REST_INTERVAL = cells[1].firstElementChild.value;
    let isFinal = i == t.rows.length - 2;
    await work(WORK_INTERVAL, REST_INTERVAL, isFinal);
    if (stoped || paused) {
      return;
    }
    t.rows[i].style="border: thin";
    inProgress = false;
  }

  bye();
  savedObj = JSON.parse(JSON.stringify(initSavedObj)); // deep copy
  showControls(false);
  inProgress = false;
  document.getElementById('sweat').disabled = false;
}


async function work(WORK_INTERVAL, REST_INTERVAL, isFinal) {
  if (stoped || paused) {
    return;
  }
  document.getElementById('input').rows[savedObj.row].style="border: solid";
  if (inProgress) {
    console.log("already started");
    return;
  }

  showControls(true);
  inProgress = true;

  if (resumed && savedObj.state == "WORK") {
    await count_down("WORK ", WORK_INTERVAL);
  }
  else if (!resumed) {
    await count_down("WORK ", WORK_INTERVAL);
  }
  if (!isFinal && !stoped && !paused) {
    await rest(REST_INTERVAL);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function copyExercise(event){
  event = event || window.event;
  let target = event.target || event.srcElement;
  while (target && target.nodeName != 'TR') {
    target = target.parentElement;
  }
  let t = document.getElementById('input');
  let newRow = t.insertRow(target.rowIndex);
  newRow.innerHTML= target.innerHTML;
  let targetCells = target.cells;
    for (let i=0; i != targetCells.length; i++) {
    let v = targetCells[i].firstElementChild.value;
    newRow.cells[i].firstElementChild.value = v;
  }
}

function removeExercise(event){
  event = event || window.event;
  let target = event.target || event.srcElement;
  while (target && target.nodeName != 'TR') {
    target = target.parentElement;
  }
  let rows = document.getElementById('input').rows.length;
  if (rows > 3) {
    target.remove();
  }
}

function initExercies() {
  document.getElementById('workout-types').value = regularExerciseTypes;
  updateExercises();
}

function updateExercises() {
  let exerciseTypes = document.getElementById('workout-types').value.split(",");
  let selections = document.getElementsByClassName('exerciseTypes');
  for (let s in selections) {
    selections[s].innerHTML = "";
    for (let e in exerciseTypes) {
      let option = document.createElement("option");
      option.text = exerciseTypes[e].trim();
      let exOptions = selections[s].options;
      if (exOptions != undefined) { // wtf
        exOptions.add(option);
      }
    }
  }
}

function beep() {
    let snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}
