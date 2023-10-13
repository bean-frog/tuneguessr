//game init
document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('tuneguessr-newuser?')) {
    onboarding();
  } else {
    returningUser();
    updateStats();
  }
  document.addEventListener('DOMContentLoaded', function() {
    const zoomControl = document.querySelector('.svgMap-map-controls-wrapper');
    if (zoomControl) {
      zoomControl.style.right = '0';
      zoomControl.style.left = 'unset';
    }
  });
});

//selected country display
function keepLastTwo(str) {
  return str.slice(-2); 
}
let currentSel;
function logId(event) {
  if (event.target.classList.contains("svgMap-country")) {
    currentSel = keepLastTwo(event.target.id.toLowerCase())
    console.log(`Clicked country ID: ${currentSel}`);
    document.getElementById('selected').src = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags/png250px/${currentSel}.png`
    document.getElementById('selName').textContent = isoToName(currentSel.toUpperCase());
  }
 
}
document.addEventListener("click", logId);


function onboarding() {
  onboardingModal.showModal();
  document.getElementById('finishOb').addEventListener('click', function() {
  localStorage.setItem('tuneguessr-newuser?', "false");
  localStorage.setItem('tuneguessr-username', document.getElementById('unameInput').value.trim());
  setTimeout(function(){
    returningUser("noback");
  }, 200)
});
}
function returningUser(back) {
  const username = localStorage.getItem('tuneguessr-username');
  const titleText = back === "noback" ? `Welcome, ${username}!` : `Welcome back, ${username}!`;
  document.getElementById('ruModal-content').innerHTML = `
    <h3 class="font-bold text-lg">${titleText}</h3>
    <div class="modal-action">
      <form method="dialog">
        <button onclick='begingame();' class="btn">Start Game</button>
      </form>
    </div>
  `;
  returningUserModal.showModal();
}
function wipeStats() {
  localStorage.setItem('tuneguessr-incorrect', '');
  localStorage.setItem('tuneguessr-correct', '');
  localStorage.setItem('tuneguessr-total', '');
  updateStats()
}
function changeUsername(newName) {
  if (newName && !newName == '') {
  localStorage.setItem('tuneguessr-username', newName)
  } else {
    alert('no name provided')
  }
}
function hideCheck() {
document.getElementById('check').style.visibility = 'hidden';
}
function showCheck() {
  document.getElementById('check').style.visibility = 'visible';
}
function getRandomCountryISO() {
  const countries = Object.keys(trimmedCountryNamesEN);
  const randomIndex = Math.floor(Math.random() * countries.length);
  const randomCountry = countries[randomIndex];
  localStorage.setItem('TCCBPDCBLAT', randomCountry);
  return randomCountry;
};
function isoToName(iso) {
  if (iso in svgMapCountryNamesEN) {
    return svgMapCountryNamesEN[iso];
  } else {
    return 'Unknown :('; 
  }
}
function clearSel() {
  document.getElementById('selected').src = "";
  document.getElementById('selName').textContent = "";
}
function begingame() {
  console.log('start game called')
  clearSel();
showCheck();
const randomCountryISO = getRandomCountryISO();
console.log(`Random Country: ${randomCountryISO} (${isoToName(randomCountryISO)})`);
document.getElementById('status').style.backgroundColor = "white";
document.getElementById('status').innerHTML = "";
let audio = document.getElementById('tuneguessr-audio');
audio.src = `../audio/${localStorage.getItem('TCCBPDCBLAT')}.mp3`;
audio.play();
};
//LS stats functions
function incorrectGuess() {
  let lsIncorrect = localStorage.getItem('tuneguessr-incorrect');
  lsIncorrect = (parseInt(lsIncorrect, 10) || 0) + 1; 
  localStorage.setItem('tuneguessr-incorrect', lsIncorrect);
  document.getElementById('status').style.backgroundColor = 'red';
  document.getElementById('status').innerHTML = `
  <p>You absolute donkey that's wrong</p>
  <p>The correct answer was ${localStorage.getItem('TCCBPDCBLAT')} (${isoToName(localStorage.getItem('TCCBPDCBLAT'))})</p>
  <button class="btn my-4 px-4 py-2 bg-blue-500 text-white rounded"id="next" onclick="begingame()">Next</button>
  `
  hideCheck();
  document.getElementById('tuneguessr-audio').pause()
}
function correctGuess() {
  let lsCorrect = localStorage.getItem('tuneguessr-correct');
  lsCorrect = (parseInt(lsCorrect, 10) || 0) + 1; 
  localStorage.setItem('tuneguessr-correct', lsCorrect);
  document.getElementById('status').style.backgroundColor = 'green';
  document.getElementById('status').innerHTML = `
  <p>Correct! Good job!</p>
  <button class="btn my-4 px-4 py-2 bg-blue-500 text-white rounded" id="next" onclick="begingame()">Next</button>
  `
  hideCheck();
  document.getElementById('tuneguessr-audio').pause();
}
function totalGuess() {
  let lsTotal = localStorage.getItem('tuneguessr-total');
  lsTotal = (parseInt(lsTotal, 10) || 0) + 1; 
  localStorage.setItem('tuneguessr-total', lsTotal);
}
function updateStats() {
  let lsIncorrect = localStorage.getItem('tuneguessr-incorrect');
  let lsCorrect = localStorage.getItem('tuneguessr-correct');
  let lsTotal = localStorage.getItem('tuneguessr-total');
 let template = `
 <h1 class="text-2xl mt-6">${localStorage.getItem('tuneguessr-username')}'s Statistics</h1>
 <ul>
  <li>Total Guesses: ${lsTotal}</li>
  <li>Total Correct Guesses: ${lsCorrect}</li>
  <li>Total Incorrect Guesses: ${lsIncorrect}</li>
  <li>Percent Correct Guesses: ${Math.round((lsCorrect / lsTotal) * 100)}%</li>
 </ul>
 `
 document.getElementById('statsDiv').innerHTML = template;
}
function makeGuess() {
  totalGuess();
  if (currentSel.toLowerCase() === localStorage.getItem('TCCBPDCBLAT').toLowerCase()) {
    correctGuess();
  } else {
    incorrectGuess();
  }
  updateStats();
}
document.getElementById('check').addEventListener('click', makeGuess);

document.addEventListener('keydown', e => {
  if (e.code == "Enter") {
    e.preventDefault();
    return;
  }
	if (e.code == 'Space') {
		e.preventDefault()
		e.stopImmediatePropagation();
		e.stopPropagation();
		if (document.getElementById('next')) {
			begingame();
		} else {
			makeGuess();
		}
	} else {
		return;
	}
});
document.addEventListener('keyup', e => {
  if (e.code == 'Space' || e.code == 'Enter') {
    e.preventDefault()            // - \
    e.stopImmediatePropagation(); //    > super hacky fix to stop that goofy ah issue where begingame() was being called due to default events. may cause error?
    e.stopPropagation();          // - /
   } else {
    return;
   }
})
